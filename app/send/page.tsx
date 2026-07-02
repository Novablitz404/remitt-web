"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuote, createOrder, type Quote } from "@/lib/api";
import { formatUSD, formatPHP } from "@/lib/format";
import { FeeBreakdown } from "@/components/FeeBreakdown";

type Direction = 0 | 1;

const CONFIG: Record<
  Direction,
  {
    label: string;
    sendCurrency: string;
    sendSymbol: string;
    rails: { value: string; label: string }[];
    recipientLabel: string;
    recipientPlaceholder: string;
  }
> = {
  0: {
    label: "USD → PHP",
    sendCurrency: "USD",
    sendSymbol: "$",
    rails: [
      { value: "venmo", label: "Venmo" },
      { value: "cashapp", label: "Cash App" },
      { value: "zelle", label: "Zelle" },
    ],
    recipientLabel: "Recipient's Coins.ph phone number",
    recipientPlaceholder: "+639xxxxxxxxx",
  },
  1: {
    label: "PHP → USD",
    sendCurrency: "PHP",
    sendSymbol: "₱",
    rails: [{ value: "coinsph", label: "Coins.ph" }],
    recipientLabel: "Recipient's US payment handle",
    recipientPlaceholder: "@venmo-handle",
  },
};

export default function SendPage() {
  const router = useRouter();
  const [direction, setDirection] = useState<Direction>(0);
  const [amountStr, setAmountStr] = useState("");
  const [rail, setRail] = useState("venmo");
  const [recipient, setRecipient] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoting, startQuoting] = useTransition();
  const [placing, startPlacing] = useTransition();

  const cfg = CONFIG[direction];
  // Source minor units: USD cents or PHP centavos.
  const minorUnits = Math.round(parseFloat(amountStr || "0") * 100);

  function pickDirection(d: Direction) {
    setDirection(d);
    setRail(CONFIG[d].rails[0].value);
    setQuote(null);
    setError(null);
  }

  function handleGetQuote() {
    if (minorUnits < 100) {
      setError(`Minimum send is ${cfg.sendSymbol}1.00`);
      return;
    }
    setError(null);
    startQuoting(async () => {
      try {
        const q = await createQuote({ direction, amount: minorUnits, payInRail: rail });
        setQuote(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to get quote");
      }
    });
  }

  function handlePlaceOrder() {
    if (!quote || !recipient.trim()) return;
    setError(null);
    startPlacing(async () => {
      try {
        const order = await createOrder({
          quoteId: quote.id,
          senderId: `web-${Date.now()}`,
          recipientPhone: recipient.trim(),
        });
        router.push(`/send/${order.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to place order");
      }
    });
  }

  const quoteExpired = quote && new Date(quote.expiresAt) < new Date();
  const recipientGets =
    quote &&
    (direction === 0
      ? formatPHP(quote.phpAmountCentavos)
      : formatUSD(quote.fiatAmountCents));

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Send money</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
          <div className="flex gap-2">
            {([0, 1] as Direction[]).map((d) => (
              <button
                key={d}
                onClick={() => pickDirection(d)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  direction === d
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {CONFIG[d].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            You send ({cfg.sendCurrency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {cfg.sendSymbol}
            </span>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                setQuote(null);
              }}
              className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pay via</label>
          <div className="flex gap-2">
            {cfg.rails.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setRail(r.value);
                  setQuote(null);
                }}
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
              <span className="text-2xl font-bold text-green-700">{recipientGets}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Exchange rate</span>
              <span>₱{quote.fxRate.toFixed(2)} per USD</span>
            </div>
            <FeeBreakdown feeSplit={quote.feeSplit} railFeeUsdc={quote.railFeeUsdc} />
            <div className="text-xs text-gray-400 pt-1">
              Rate locked until {new Date(quote.expiresAt).toLocaleTimeString()}
            </div>
          </div>
        )}

        {(!quote || quoteExpired) && (
          <button
            onClick={handleGetQuote}
            disabled={quoting || !amountStr}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {quoting ? "Getting rate…" : "Get rate"}
          </button>
        )}

        {quote && !quoteExpired && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {cfg.recipientLabel}
              </label>
              <input
                type="text"
                placeholder={cfg.recipientPlaceholder}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing || !recipient.trim()}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {placing
                ? "Placing order…"
                : `Confirm · send ${cfg.sendSymbol}${(minorUnits / 100).toFixed(2)}`}
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
