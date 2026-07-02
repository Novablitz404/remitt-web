"use client";

import { useState } from "react";

type Corridor = {
  code: string;
  name: string;
  live: boolean;
};

const VISIBLE_COUNT = 12;

export default function CorridorsGrid({ corridors }: { corridors: Corridor[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? corridors : corridors.slice(0, VISIBLE_COUNT);

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((c) => (
          <div
            key={c.name}
            className={`flex items-center gap-3 ${!c.live ? "opacity-40" : ""}`}
          >
            <img
              src={`https://hatscripts.github.io/circle-flags/flags/${c.code}.svg`}
              alt={c.name}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full"
            />
            <span className="text-base font-bold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4 transition-colors hover:text-indigo-600 hover:decoration-indigo-300">
              {c.name}
            </span>
          </div>
        ))}
      </div>

      {!showAll && corridors.length > VISIBLE_COUNT && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            View more
          </button>
        </div>
      )}
    </div>
  );
}
