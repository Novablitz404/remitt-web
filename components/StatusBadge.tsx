import { STATE_LABEL } from "@/lib/format";

const COLOR: Record<string, string> = {
  pending_match: "bg-yellow-100 text-yellow-800",
  matched: "bg-blue-100 text-blue-800",
  pool_reserved: "bg-blue-100 text-blue-800",
  payout_submitted: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  expired: "bg-gray-100 text-gray-600",
  disputed: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
};

export function StatusBadge({ state }: { state: string }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${COLOR[state] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATE_LABEL[state] ?? state}
    </span>
  );
}
