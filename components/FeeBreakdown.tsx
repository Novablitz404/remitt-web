import { type FeeSplit } from "@/lib/api";
import { formatUSDC } from "@/lib/format";

export function FeeBreakdown({
  feeSplit,
  railFeeUsdc,
}: {
  feeSplit: FeeSplit;
  railFeeUsdc?: string;
}) {
  const total =
    BigInt(feeSplit.receivingLpFee) +
    BigInt(feeSplit.payoutLpFee) +
    BigInt(feeSplit.platformFee);

  // payoutLpFee bundles the rail (delivery) fee; split it out for display.
  const rail = BigInt(railFeeUsdc ?? "0");
  const payoutBase = BigInt(feeSplit.payoutLpFee) - rail;

  return (
    <details className="text-sm text-gray-500 mt-2">
      <summary className="cursor-pointer select-none">
        Fee: {formatUSDC(total.toString())} included
      </summary>
      <ul className="mt-2 space-y-1 pl-4 border-l border-gray-200">
        <li className="flex justify-between">
          <span>Network fee</span>
          <span>{formatUSDC(feeSplit.receivingLpFee)}</span>
        </li>
        <li className="flex justify-between">
          <span>Payout fee</span>
          <span>{formatUSDC(payoutBase.toString())}</span>
        </li>
        {rail > BigInt(0) && (
          <li className="flex justify-between">
            <span>Delivery fee</span>
            <span>{formatUSDC(rail.toString())}</span>
          </li>
        )}
        <li className="flex justify-between">
          <span>Platform fee</span>
          <span>{formatUSDC(feeSplit.platformFee)}</span>
        </li>
      </ul>
    </details>
  );
}
