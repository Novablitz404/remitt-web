import { type FeeSplit } from "@/lib/api";
import { formatUSDC } from "@/lib/format";

export function FeeBreakdown({ feeSplit }: { feeSplit: FeeSplit }) {
  const total =
    BigInt(feeSplit.receivingLpFee) +
    BigInt(feeSplit.payoutLpFee) +
    BigInt(feeSplit.platformFee);

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
          <span>{formatUSDC(feeSplit.payoutLpFee)}</span>
        </li>
        <li className="flex justify-between">
          <span>Platform fee</span>
          <span>{formatUSDC(feeSplit.platformFee)}</span>
        </li>
      </ul>
    </details>
  );
}
