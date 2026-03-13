"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { listTickets } from "@/lib/api";
import type { Ticket } from "@/lib/types";

function colorFor(t: Ticket) {
  if (t.status === "Resolved") return "#22C55E";
  if (t.severity === "critical") return "#FF4D4D";
  if (t.severity === "moderate") return "#FFC107";
  return "#4F8CFF";
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  useEffect(() => {
    listTickets().then((r) => setTickets(r.tickets)).catch(() => setTickets([]));
  }, []);

  const points = useMemo(() => {
    const withCoords = tickets.filter((t) => typeof t.lat === "number" && typeof t.lng === "number");
    return withCoords.length ? withCoords : tickets.slice(0, 10);
  }, [tickets]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (map.current) return;

    if (!token) {
      return;
    }
    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [75.7873, 26.9124],
      zoom: 11
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, [token]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;

    const markers: mapboxgl.Marker[] = [];
    for (const t of points) {
      const lat = typeof t.lat === "number" ? t.lat : 26.9124 + (Math.random() - 0.5) * 0.08;
      const lng = typeof t.lng === "number" ? t.lng : 75.7873 + (Math.random() - 0.5) * 0.08;

      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "999px";
      el.style.background = colorFor(t);
      el.style.boxShadow = `0 0 24px ${colorFor(t)}66`;
      el.style.border = "1px solid rgba(255,255,255,0.25)";

      const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(
        `<div style="font-family: ui-sans-serif; color:#fff;">
          <div style="font-weight:700; margin-bottom:6px;">${t.issueType}</div>
          <div style="opacity:.8; font-size:12px;">Ticket: <b>${t.id}</b></div>
          <div style="opacity:.8; font-size:12px;">Status: <b>${t.status}</b></div>
          <div style="opacity:.8; font-size:12px;">Dept: <b>${t.departmentAssigned}</b></div>
          <div style="opacity:.8; font-size:12px; margin-top:6px;">${t.locationText}</div>
        </div>`
      );

      const mk = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).setPopup(popup).addTo(m);
      markers.push(mk);
    }
    return () => markers.forEach((mk) => mk.remove());
  }, [points]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Incident map</h1>
          <div className="mt-1 text-sm text-white/65">
            Color coding: Red critical • Yellow moderate • Green resolved
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
          {token ? "Mapbox connected" : "Add NEXT_PUBLIC_MAPBOX_TOKEN to enable map tiles"}
        </div>
      </div>

      {token ? (
        <div className="glass overflow-hidden rounded-2xl">
          <div ref={mapRef} className="h-[72vh] w-full" />
        </div>
      ) : (
        <div className="glass grid h-[72vh] place-items-center rounded-2xl p-6 text-center">
          <div>
            <div className="text-lg font-semibold">Map requires a token</div>
            <div className="mt-2 text-sm text-white/65">
              Set <span className="text-secondary">NEXT_PUBLIC_MAPBOX_TOKEN</span> in{" "}
              <span className="text-white/80">frontend/.env.local</span>.
              <div className="mt-3 text-xs text-white/55">
                The platform still works fully without maps (reporting, ticketing, dashboards).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

