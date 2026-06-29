"use client";

import { useState, useTransition } from "react";
import { DepositPanel } from "../../components/DepositPanel";
import { connectWallet, FreighterError } from "../../lib/freighter";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002";

interface RegisteredLp {
  id: string;
  type: string;
  stellarAddress: string;
  paymentRails: string[];
  phpCapacityCentavos: string;
  kycStatus: string;
}

const US_RAILS = ["venmo", "cashapp", "zelle"];

export default function MerchantsPage() {
  const [type, setType] = useState<"us" | "ph">("us");
  const [stellarAddress, setStellarAddress] = useState("");
  const [selectedRails, setSelectedRails] = useState<string[]>([]);
  const [phpCapacity, setPhpCapacity] = useState("");
  const [result, setResult] = useState<RegisteredLp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleRail(rail: string) {
    setSelectedRails((prev) =>
      prev.includes(rail) ? prev.filter((r) => r !== rail) : [...prev, rail],
    );
  }

  async function handleConnectAddress() {
    setError(null);
    try {
      setStellarAddress(await connectWallet());
    } catch (e) {
      setError(e instanceof FreighterError ? e.message : "Could not connect wallet");
    }
  }

  function handleRegister() {
    setError(null);
    startTransition(async () => {
      try {
        const body: Record<string, unknown> = {
          type,
          stellarAddress,
          paymentRails: type === "us" ? selectedRails : [],
        };
        if (type === "ph" && phpCapacity) {
          body.phpCapacityCentavos = Math.round(parseFloat(phpCapacity) * 100);
        }

        const res = await fetch(`${BACKEND}/lps/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        setResult(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Registration failed");
      }
    });
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-green-800 text-lg">Registered!</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">LP ID</dt>
              <dd className="font-mono text-xs">{result.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Type</dt>
              <dd>{result.type.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">KYC status</dt>
              <dd>{result.kycStatus}</dd>
            </div>
            {result.paymentRails.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Rails</dt>
                <dd>{result.paymentRails.join(", ")}</dd>
              </div>
            )}
          </dl>
          <p className="text-sm text-green-700 pt-2">
            Save your LP ID — you'll need it to deposit USDC and start earning.
          </p>
        </div>
        <DepositPanel initialLpId={result.id} />
        <button
          onClick={() => setResult(null)}
          className="text-sm text-indigo-600 hover:underline"
        >
          Register another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Become a liquidity provider</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Earn fees by providing USD (US-side) or PHP payout capacity (PH-side).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LP type</label>
          <div className="flex gap-2">
            {(["us", "ph"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  type === t
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {t === "us" ? "US (pay-in)" : "PH (pay-out)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Stellar address
            </label>
            <button
              type="button"
              onClick={handleConnectAddress}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Use Freighter
            </button>
          </div>
          <input
            type="text"
            placeholder="G..."
            value={stellarAddress}
            onChange={(e) => setStellarAddress(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {type === "us" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment rails you support
            </label>
            <div className="flex gap-2">
              {US_RAILS.map((rail) => (
                <button
                  key={rail}
                  onClick={() => toggleRail(rail)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                    selectedRails.includes(rail)
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {rail === "cashapp" ? "Cash App" : rail.charAt(0).toUpperCase() + rail.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === "ph" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PHP payout capacity (₱)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₱</span>
              <input
                type="number"
                min="0"
                placeholder="50000"
                value={phpCapacity}
                onChange={(e) => setPhpCapacity(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={pending || !stellarAddress.trim()}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Registering…" : "Register as LP"}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-3 text-xs text-gray-400">
            already registered?
          </span>
        </div>
      </div>

      <DepositPanel />
    </div>
  );
}
