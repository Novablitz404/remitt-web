"use client";

import { useState } from "react";
import {
  provideLiquidityBuild,
  provideLiquiditySubmit,
  type ProvidePosition,
} from "../../lib/api";
import { connectWallet, signXdr, FreighterError } from "../../lib/freighter";

const RAILS: Record<"us" | "ph", { id: string; label: string }[]> = {
  us: [
    { id: "venmo", label: "Venmo" },
    { id: "cashapp", label: "Cash App" },
    { id: "zelle", label: "Zelle" },
  ],
  ph: [
    { id: "gcash", label: "GCash" },
    { id: "maya", label: "Maya" },
    { id: "coinsph", label: "Coins.ph" },
  ],
};

// USDC on Stellar uses 7 decimal places.
function toMinorUnits(usdc: string): string {
  const [whole, frac = ""] = usdc.trim().split(".");
  const fracPadded = (frac + "0000000").slice(0, 7);
  return (
    BigInt(whole || "0") * BigInt(10000000) + BigInt(fracPadded || "0")
  ).toString();
}

function fmtUsdc(minor: string): string {
  return (Number(minor) / 1e7).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}

type Step = "idle" | "connecting" | "building" | "signing" | "submitting";

export default function MerchantsPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [country, setCountry] = useState<"us" | "ph">("us");
  const [rails, setRails] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<ProvidePosition | null>(null);

  const busy = step !== "idle";

  function pickCountry(c: "us" | "ph") {
    setCountry(c);
    setRails([]); // rails are country-specific
  }

  function toggleRail(rail: string) {
    setRails((prev) =>
      prev.includes(rail) ? prev.filter((r) => r !== rail) : [...prev, rail],
    );
  }

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

  async function handleProvide() {
    if (!address) return;
    setError(null);
    setPosition(null);
    const amountMinor = toMinorUnits(amount);
    try {
      setStep("building");
      const built = await provideLiquidityBuild({
        type: country,
        stellarAddress: address,
        paymentRails: rails,
        amount: amountMinor,
      });
      setStep("signing");
      const signed = await signXdr(built.xdr, built.networkPassphrase);
      setStep("submitting");
      const pos = await provideLiquiditySubmit({
        stellarAddress: address,
        signedXdr: signed,
      });
      setPosition(pos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not provide liquidity");
    } finally {
      setStep("idle");
    }
  }

  if (position) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-green-800 text-lg">
            You&apos;re providing liquidity 🎉
          </h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Country</dt>
              <dd>{position.type.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Rails</dt>
              <dd>{position.paymentRails.join(", ") || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Capacity</dt>
              <dd className="font-semibold">{fmtUsdc(position.availableClaim)} USDC</dd>
            </div>
          </dl>
          <p className="text-sm text-green-700 pt-1">
            Your deposit is your payout capacity — usable in whichever direction
            the market routes you.
          </p>
        </div>
        <button
          onClick={() => {
            setPosition(null);
            setAmount("");
          }}
          className="text-sm text-indigo-600 hover:underline"
        >
          Add more liquidity
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Provide liquidity</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Connect your wallet, pick where you operate, and deposit USDC. Your
          deposit becomes your payout capacity — one step, no registration.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Wallet */}
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

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div className="flex gap-2">
            {(["us", "ph"] as const).map((c) => (
              <button
                key={c}
                onClick={() => pickCountry(c)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  country === c
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {c === "us" ? "🇺🇸 United States" : "🇵🇭 Philippines"}
              </button>
            ))}
          </div>
        </div>

        {/* Rails */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment rails you support
          </label>
          <div className="flex gap-2">
            {RAILS[country].map((rail) => (
              <button
                key={rail.id}
                onClick={() => toggleRail(rail.id)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  rails.includes(rail.id)
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {rail.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deposit (USDC)
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

        <button
          onClick={handleProvide}
          disabled={
            busy || !address || rails.length === 0 || !(parseFloat(amount) > 0)
          }
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {step === "building"
            ? "Preparing…"
            : step === "signing"
              ? "Awaiting signature…"
              : step === "submitting"
                ? "Depositing…"
                : "Provide liquidity"}
        </button>
      </div>
    </div>
  );
}
