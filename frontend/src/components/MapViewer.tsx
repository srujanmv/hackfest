"use client";

import Link from "next/link";

export function MapViewer() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Map viewer</div>
          <div className="mt-1 text-sm text-white/65">
            Open the full-screen incident map with live pins.
          </div>
        </div>
        <Link
          href="/map"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold shadow-glow transition hover:brightness-110"
        >
          Open map
        </Link>
      </div>
      <div className="mt-4 grid h-44 place-items-center rounded-2xl border border-dashed border-white/15 bg-black/20 text-sm text-white/55">
        Map tiles render on the Map page (Mapbox token optional).
      </div>
    </div>
  );
}

