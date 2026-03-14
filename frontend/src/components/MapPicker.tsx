"use client";

import { useMemo, useState } from "react";

const LOCATION_SUGGESTIONS = [
  "Main Road near City Bus Stand",
  "Railway Station entrance",
  "Market Square, Ward 4",
  "Government School junction",
  "Community Health Center road",
  "Water tank lane, Sector 2",
  "Temple Road signal point",
  "Panchayat Office front gate",
  "Industrial Area Phase 1",
  "College Circle main crossing"
];

function googleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

async function reverseGeocode(lat: number, lng: number) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  if (!token) {
    return `Current location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  }

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to resolve address");
  }

  const payload = (await response.json()) as {
    features?: Array<{ place_name?: string }>;
  };
  return (
    payload.features?.[0]?.place_name?.trim() ||
    `Current location (${lat.toFixed(5)}, ${lng.toFixed(5)})`
  );
}

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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const display = useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    return "Not set";
  }, [lat, lng]);

  const filteredSuggestions = useMemo(() => {
    const query = locationText.trim().toLowerCase();
    if (!query) {
      return LOCATION_SUGGESTIONS.slice(0, 5);
    }

    return LOCATION_SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [locationText]);

  async function useGps() {
    if (!navigator.geolocation) {
      setError("Live location is not supported in this browser.");
      return;
    }

    setBusy(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;

        try {
          const resolvedLocation = await reverseGeocode(nextLat, nextLng);
          onChange({
            lat: nextLat,
            lng: nextLng,
            locationText: resolvedLocation
          });
        } catch {
          onChange({
            lat: nextLat,
            lng: nextLng,
            locationText: `Current location (${nextLat.toFixed(5)}, ${nextLng.toFixed(5)})`
          });
          setError("Live coordinates were captured, but the address could not be resolved.");
        } finally {
          setBusy(false);
        }
      },
      (geoError) => {
        setBusy(false);
        setError(geoError.message || "Unable to access your live location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Location detection</div>
          <div className="mt-1 text-xs text-white/60">
            Use live location or enter a place manually from the suggestion box.
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
          placeholder="Specified location (e.g. Main Road near City Bus Stand)"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />

        {filteredSuggestions.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
            <div className="px-2 pb-1 text-[11px] uppercase tracking-[0.18em] text-white/40">
              Suggestions
            </div>
            <div className="grid gap-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => onChange({ lat, lng, locationText: item })}
                  className="rounded-xl px-3 py-2 text-left text-sm text-white/75 transition hover:bg-white/10"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {typeof lat === "number" && typeof lng === "number" ? (
          <a
            href={googleMapsUrl(lat, lng)}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-secondary underline-offset-4 hover:underline"
          >
            Open detected point in Google Maps
          </a>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void useGps()}
            disabled={busy}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            {busy ? "Locating..." : "Use live location"}
          </button>
        </div>

        {error ? (
          <div className="text-xs text-warning">{error}</div>
        ) : (
          <div className="text-xs text-white/55">
            Type a landmark, road, or public place and pick a suggested location if needed.
          </div>
        )}
      </div>
    </div>
  );
}
