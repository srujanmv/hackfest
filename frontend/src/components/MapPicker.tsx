"use client";

import { useMemo } from "react";

export function MapPicker({
  lat,
  lng,
  locationText,
  onChange
}: {
  lat?: number;
  lng?: number;
  locationText: string;
  onChange: (v: { lat?: number; lng?: number; locationText: string }) => void;
}) {
  const display = useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    return "Not set";
  }, [lat, lng]);

  function useGps() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => {
      onChange({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        locationText
      });
    });
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Location detection</div>
          <div className="mt-1 text-xs text-white/60">
            Share GPS or type the location. (Map selection is enabled on the Map page.)
          </div>
        </div>
        <div className="text-xs text-white/55">
          GPS: <span className="text-secondary">{display}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <input
          value={locationText}
          onChange={(e) =>
            onChange({ lat, lng, locationText: e.target.value })
          }
          placeholder="Location description (e.g. Village Road near temple)"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={useGps}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            Use GPS
          </button>
          <button
            onClick={() =>
              onChange({ lat: 26.9124, lng: 75.7873, locationText })
            }
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            Demo location
          </button>
        </div>
      </div>
    </div>
  );
}

