import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center py-16 gap-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Send money to the Philippines
        </h1>
        <p className="text-xl text-gray-500 max-w-md">
          No bank account needed. Your recipient gets pesos in minutes, not days.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/send"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-colors"
        >
          Send money →
        </Link>
        <Link
          href="/merchants"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-100 transition-colors"
        >
          Become a liquidity provider
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-8 text-left max-w-2xl w-full">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-600">1.2%</div>
          <div className="text-sm text-gray-600">Total fee, all-in</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-600">&lt; 2 min</div>
          <div className="text-sm text-gray-600">Typical delivery time</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-600">₱56+</div>
          <div className="text-sm text-gray-600">Per US dollar sent</div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full text-left space-y-3">
        <h2 className="font-semibold text-gray-900">How it works</h2>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
          <li>Enter how much USD you want to send</li>
          <li>We lock in the exchange rate and show the recipient amount</li>
          <li>Pay via Venmo, Cash App, or Zelle</li>
          <li>Recipient receives pesos via Coins.ph within minutes</li>
        </ol>
      </div>
    </div>
  );
}
