"use client";

import { useState } from "react";
import { buildDeposit, submitDeposit, type LpClaim } from "../lib/api";
import { connectWallet, signXdr, FreighterError } from "../lib/freighter";

// USDC on Stellar uses 7 decimal places.
function toMinorUnits(usdc: string): string {
  const [whole, frac = ""] = usdc.trim().split(".");
  const fracPadded = (frac + "0000000").slice(0, 7);
  return (
    BigInt(whole || "0") * BigInt(10000000) +
    BigInt(fracPadded || "0")
  ).toString();
}

function fmtUsdc(minor: string): string {
  return (Number(minor) / 1e7).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}

type Step = "idle" | "connecting" | "building" | "signing" | "submitting";

export function DepositPanel({ initialLpId = "" }: { initialLpId?: string }) {
  const [lpId, setLpId] = useState(initialLpId);
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<LpClaim | null>(null);

  const busy = step !== "idle";

  async function handleConnect() {
    setError(null);
    setStep("connecting");
    try {
      setAddress(await connectWallet());
    } catch (e) {
      setError(e instanceof FreighterError ? e.message : "Could not connect wallet");
    } finally {
      setStep("idle");
    }
  }

  async function handleDeposit() {
    setError(null);
    setClaim(null);
    const amountMinor = toMinorUnits(amount);
    try {
      setStep("building");
      const { xdr, networkPassphrase } = await buildDeposit(lpId.trim(), amountMinor);
      setStep("signing");
      const signed = await signXdr(xdr, networkPassphrase);
      setStep("submitting");
      const updated = await submitDeposit(lpId.trim(), signed, amountMinor);
      setClaim(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deposit failed");
    } finally {
      setStep("idle");
    }
  }

  const stepLabel =
    step === "building"
      ? "Preparing transaction…"
      : step === "signing"
        ? "Awaiting wallet signature…"
        : step === "submitting"
          ? "Submitting on-chain…"
          : "Deposit USDC";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Deposit USDC</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Fund your clearing-pool capacity. You sign with your own wallet — your
          secret key never leaves Freighter.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Wallet</label>
        {address ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
            <span className="font-mono text-xs text-green-800 truncate">{address}</span>
            <span className="text-xs text-green-600 ml-2 shrink-0">Connected</span>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={busy}
            className="w-full py-2.5 border border-indigo-300 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
          >
            {step === "connecting" ? "Connecting…" : "Connect Freighter"}
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LP ID</label>
        <input
          type="text"
          placeholder="your LP id"
          value={lpId}
          onChange={(e) => setLpId(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USDC)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {claim && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-3 text-sm space-y-1">
          <p className="font-semibold text-green-800">Deposit confirmed on-chain</p>
          <p className="text-green-700">
            Available capacity: {fmtUsdc(claim.availableClaim)} USDC
          </p>
        </div>
      )}

      <button
        onClick={handleDeposit}
        disabled={busy || !address || !lpId.trim() || !(parseFloat(amount) > 0)}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {stepLabel}
      </button>
    </div>
  );
}
