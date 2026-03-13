"use client";

import type { Ticket } from "@/lib/types";

export function IssueCard({ ticket }: { ticket: Ticket }) {
  const badge =
    ticket.status === "Resolved"
      ? "bg-success/15 text-success border-success/30"
      : ticket.severity === "critical"
        ? "bg-danger/15 text-danger border-danger/30"
        : ticket.severity === "moderate"
          ? "bg-warning/15 text-warning border-warning/30"
          : "bg-primary/15 text-primary border-primary/30";

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">
            {ticket.issueType} • <span className="text-secondary">{ticket.id}</span>
          </div>
          <div className="mt-1 text-sm text-white/65">{ticket.locationText}</div>
          <div className="mt-2 text-xs text-white/55">
            Dept: <span className="text-white/80">{ticket.departmentAssigned}</span>
          </div>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
          {ticket.status}
        </div>
      </div>
    </div>
  );
}

