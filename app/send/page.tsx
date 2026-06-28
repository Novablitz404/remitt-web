"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuote, createOrder, type Quote } from "@/lib/api";
import { formatUSD, formatPHP } from "@/lib/format";
import { FeeBreakdown } from "@/components/FeeBreakdown";

const RAILS = [
  { value: "venmo", label: "Venmo" },
  { value: "cashapp", label: "Cash App" },
  { value: "zelle", label: "Zelle" },
];

export default function SendPage() {
  const router = useRouter();
  const [amountDollars, setAmountDollars] = useState("");
  const [rail, setRail] = useState("venmo");
  const [phone, setPhone] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoting, startQuoting] = useTransition();
  const [placing, startPlacing] = useTransition();

  const cents = Math.round(parseFloat(amountDollars || "0") * 100);

  function handleGetQuote() {
    if (cents < 100) {
      setError("Minimum send is $1.00");
      return;
    }
    setError(null);
    startQuoting(async () => {
      try {
        const q = await createQuote({ fiatAmountCents: cents, payInRail: rail });
        setQuote(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to get quote");
      }
    });
  }

  function handlePlaceOrder() {
    if (!quote || !phone.trim()) return;
    setError(null);
    startPlacing(async () => {
      try {
        const order = await createOrder({
          quoteId: quote.id,
          recipientPhone: phone.trim(),
          payInRail: rail,
        });
        router.push(`/send/${order.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to place order");
      }
    });
  }

  const quoteExpired = quote && new Date(quote.expiresAt) < new Date();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Send money to the Philippines</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            You send (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amountDollars}
              onChange={(e) => {
                setAmountDollars(e.target.value);
                setQuote(null);
              }}
              className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pay via
          </label>
          <div className="flex gap-2">
            {RAILS.map((r) => (
              <button
                key={r.value}
                onClick={() => { setRail(r.value); setQuote(null); }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  rail === r.value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {quote && !quoteExpired && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">Recipient gets</span>
              <span className="text-2xl font-bold text-green-700">
                {formatPHP(quote.phpAmountCentavos)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Exchange rate</span>
              <span>₱{quote.fxRate.toFixed(2)} per USD</span>
            </div>
            <FeeBreakdown feeSplit={quote.feeSplit} />
            <div className="text-xs text-gray-400 pt-1">
              Rate locked until {new Date(quote.expiresAt).toLocaleTimeString()}
            </div>
          </div>
        )}

        {(!quote || quoteExpired) && (
          <button
            onClick={handleGetQuote}
            disabled={quoting || !amountDollars}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {quoting ? "Getting rate…" : "Get rate"}
          </button>
        )}

        {quote && !quoteExpired && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient's Coins.ph phone number
              </label>
              <input
                type="tel"
                placeholder="+639xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing || !phone.trim()}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {placing
                ? "Placing order…"
                : `Confirm · send ${formatUSD(cents)}`}
            </button>
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>
    </div>
  );
}
