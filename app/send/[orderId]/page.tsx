"use client";

import { use, useEffect, useState } from "react";
import { getOrder, confirmPayIn, type Order } from "@/lib/api";
import { formatUSD, formatPHP, STATE_DONE } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { FeeBreakdown } from "@/components/FeeBreakdown";

const RAIL_LABEL: Record<string, string> = {
  venmo: "Venmo",
  cashapp: "Cash App",
  zelle: "Zelle",
};

export default function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Manual pay-in confirm form
  const [paymentId, setPaymentId] = useState("");
  const [senderHandle, setSenderHandle] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const o = await getOrder(orderId);
        if (!cancelled) setOrder(o);
        if (!cancelled && !STATE_DONE.has(o.state)) {
          setTimeout(poll, 4000);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load order");
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [orderId]);

  async function handleConfirmPayIn() {
    if (!paymentId.trim() || !senderHandle.trim()) return;
    setConfirming(true);
    setConfirmError(null);
    try {
      const updated = await confirmPayIn(orderId, paymentId.trim(), senderHandle.trim());
      setOrder(updated);
    } catch (e) {
      setConfirmError(e instanceof Error ? e.message : "Confirmation failed");
    } finally {
      setConfirming(false);
    }
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!order) {
    return <p className="text-gray-500 animate-pulse">Loading order…</p>;
  }

  const needsPayment = order.state === "pool_reserved" && !order.payInPaymentId;
  const done = STATE_DONE.has(order.state);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Order status</h1>
        <StatusBadge state={order.state} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="p-5 flex justify-between items-baseline">
          <span className="text-gray-600">You send</span>
          <span className="text-xl font-semibold">{formatUSD(order.fiatAmountCents)}</span>
        </div>
        <div className="p-5 flex justify-between items-baseline">
          <span className="text-gray-600">Recipient gets</span>
          <span className="text-xl font-semibold text-green-700">
            {formatPHP(order.phpAmountCentavos)}
          </span>
        </div>
        <div className="p-5 flex justify-between text-sm text-gray-500">
          <span>Payment method</span>
          <span>{RAIL_LABEL[order.payInRail] ?? order.payInRail}</span>
        </div>
        <div className="p-5 flex justify-between text-sm text-gray-500">
          <span>Recipient phone</span>
          <span>{order.recipientPhone}</span>
        </div>
        <div className="p-5">
          <FeeBreakdown feeSplit={order.feeSplit} />
        </div>
      </div>

      {needsPayment && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-indigo-900">Send your payment</h2>
          <p className="text-sm text-indigo-700">
            Send {formatUSD(order.fiatAmountCents)} via{" "}
            {RAIL_LABEL[order.payInRail]} and enter the confirmation details below.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment / transaction ID
              </label>
              <input
                type="text"
                placeholder="e.g. 4098241234"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your {RAIL_LABEL[order.payInRail]} handle
              </label>
              <input
                type="text"
                placeholder="@username"
                value={senderHandle}
                onChange={(e) => setSenderHandle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleConfirmPayIn}
              disabled={confirming || !paymentId.trim() || !senderHandle.trim()}
              className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {confirming ? "Confirming…" : "I've sent the payment"}
            </button>
            {confirmError && (
              <p className="text-sm text-red-600">{confirmError}</p>
            )}
          </div>
        </div>
      )}

      {order.state === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
          <div className="text-3xl">✓</div>
          <p className="font-semibold text-green-800">Payment delivered!</p>
          <p className="text-sm text-green-700">
            {formatPHP(order.phpAmountCentavos)} sent to {order.recipientPhone}
          </p>
          <a href="/send" className="block mt-3 text-sm text-indigo-600 hover:underline">
            Send another
          </a>
        </div>
      )}

      {!done && (
        <p className="text-xs text-center text-gray-400">
          Auto-refreshing every 4 seconds · Order ID: {orderId.slice(0, 8)}…
        </p>
      )}
    </div>
  );
}
