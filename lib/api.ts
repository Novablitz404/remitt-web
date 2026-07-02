const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

export interface FeeSplit {
  receivingLpFee: string;
  payoutLpFee: string;
  platformFee: string;
}

export interface Quote {
  id: string;
  direction: number; // 0 = USD->PHP, 1 = PHP->USD
  fiatAmountCents: number;
  usdcAmount: string;
  phpAmountCentavos: string;
  fxRate: number;
  payInRail: string;
  feeSplit: FeeSplit;
  expiresAt: string;
}

export interface Order {
  id: string;
  contractOrderId: string;
  state: string;
  principalUsdc: string;
  fiatAmountCents: number;
  phpAmountCentavos: string;
  recipientPhone: string;
  payInRail: string;
  payInPaymentId: string | null;
  payOutReference: string | null;
  feeSplit: FeeSplit;
  quoteExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createQuote(params: {
  direction: number;
  amount: number; // source fiat minor units (USD cents or PHP centavos)
  payInRail: string;
}): Promise<Quote> {
  return request<Quote>("/quotes", { method: "POST", body: JSON.stringify(params) });
}

export async function createOrder(params: {
  quoteId: string;
  senderId: string;
  recipientPhone: string;
}): Promise<Order> {
  return request<Order>("/orders", { method: "POST", body: JSON.stringify(params) });
}

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`);
}

export interface LpClaim {
  lpId: string;
  totalClaim: string;
  availableClaim: string;
  reservedClaim: string;
}

export interface ProvidePosition {
  lpId: string;
  stellarAddress: string;
  type: "us" | "ph";
  paymentRails: string[];
  totalClaim: string;
  availableClaim: string;
  reservedClaim: string;
}

// Wallet-first onboarding step 1: upsert the LP (country + rails) and get the
// unsigned deposit transaction to sign.
export async function provideLiquidityBuild(params: {
  type: "us" | "ph";
  stellarAddress: string;
  paymentRails: string[];
  amount: string; // USDC minor units
}): Promise<{ lpId: string; stellarAddress: string; xdr: string; networkPassphrase: string }> {
  return request("/lps/provide/build", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// Step 2: submit the wallet-signed deposit; returns the on-chain position.
// `amount` (USDC minor units) lets the backend wait out RPC lag when reading
// the post-deposit balance, so capacity never syncs as a stale 0.
export async function provideLiquiditySubmit(params: {
  stellarAddress: string;
  signedXdr: string;
  amount?: string;
}): Promise<ProvidePosition> {
  return request<ProvidePosition>("/lps/provide/submit", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getLpClaim(lpId: string): Promise<LpClaim> {
  return request<LpClaim>(`/lps/${lpId}/claim`);
}

// Returns an unsigned, simulation-prepared deposit transaction for the LP to
// sign in their wallet.
export async function buildDeposit(
  lpId: string,
  amount: string,
): Promise<{ xdr: string; networkPassphrase: string }> {
  return request(`/lps/${lpId}/deposit/build`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

// Submits the wallet-signed deposit and returns the updated on-chain claim.
export async function submitDeposit(
  lpId: string,
  signedXdr: string,
  amount: string,
): Promise<LpClaim> {
  return request<LpClaim>(`/lps/${lpId}/deposit/submit`, {
    method: "POST",
    body: JSON.stringify({ signedXdr, amount }),
  });
}

export async function confirmPayIn(
  orderId: string,
  paymentId: string,
  senderHandle: string,
): Promise<Order> {
  return request<Order>(`/orders/${orderId}/pay-in-confirm`, {
    method: "POST",
    body: JSON.stringify({ paymentId, senderHandle }),
  });
}
