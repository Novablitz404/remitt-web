export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatPHP(centavos: string | number): string {
  const value = typeof centavos === "string" ? parseInt(centavos, 10) : centavos;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value / 100);
}

export function formatUSDC(minorUnits: string): string {
  const value = parseInt(minorUnits, 10) / 10_000_000;
  return value.toFixed(2) + " USDC";
}

export const STATE_LABEL: Record<string, string> = {
  pending_match: "Finding a liquidity provider…",
  matched: "Matched — waiting for payment",
  pool_reserved: "Reserved — send your payment now",
  payout_submitted: "Payment received — sending to recipient",
  completed: "Delivered",
  expired: "Expired",
  disputed: "Under review",
  refunded: "Refunded",
};

export const STATE_DONE = new Set(["completed", "expired", "disputed", "refunded"]);
