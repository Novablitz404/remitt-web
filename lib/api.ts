const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

export interface FeeSplit {
  receivingLpFee: string;
  payoutLpFee: string;
  platformFee: string;
  riskReserveFee: string;
}

export interface Quote {
  id: string;
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
  fiatAmountCents: number;
  payInRail: string;
}): Promise<Quote> {
  return request<Quote>("/quotes", { method: "POST", body: JSON.stringify(params) });
}

export async function createOrder(params: {
  quoteId: string;
  recipientPhone: string;
  payInRail: string;
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
