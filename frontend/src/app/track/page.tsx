"use client";

import { useState } from "react";
import { getTicket } from "@/lib/api";
import { TicketStatus } from "@/components/TicketStatus";
import type { Ticket } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookup() {
    setBusy(true);
    setErr(null);
    setTicket(null);
    try {
      const r = await getTicket(id.trim());
      setTicket(r.ticket);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Status tracking</h1>
        <div className="mt-1 text-sm text-white/65">
          Enter your ticket ID to see progress: Submitted → Verified → Assigned → In Progress → Resolved
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Ticket ID (e.g. URB-2045)"
            className="focus-ring w-full max-w-sm rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
          <Button onClick={lookup} disabled={!id.trim() || busy} size="lg">
            Track
          </Button>
          <Button
            onClick={() => setId("URB-2045")}
            variant="ghost"
            size="lg"
            type="button"
          >
            Use demo ticket
          </Button>
        </div>
        {err ? <div className="mt-3 text-sm text-danger">{err}</div> : null}
      </Card>

      {ticket ? (
        <div className="space-y-4">
          <Card className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">
                  {ticket.issueType} • <span className="text-secondary">{ticket.id}</span>
                </div>
                <div className="mt-1 text-sm text-white/65">{ticket.locationText}</div>
                <div className="mt-2 text-xs text-white/55">
                  Assigned: <span className="text-secondary">{ticket.departmentAssigned}</span>
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {ticket.status}
              </div>
            </div>
          </Card>
          <TicketStatus status={ticket.status} />
        </div>
      ) : null}
    </div>
  );
}

