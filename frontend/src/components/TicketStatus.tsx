"use client";

import clsx from "clsx";
import type { TicketStatus as Status } from "@/lib/types";

const steps: Status[] = ["Submitted", "Verified", "Assigned", "In Progress", "Resolved"];

export function TicketStatus({ status }: { status: Status }) {
  const idx = steps.indexOf(status);
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((s, i) => {
        const done = i <= idx;
        return (
          <div key={s} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/55">Status</div>
              <div
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  done
                    ? "border-success/30 bg-success/15 text-success"
                    : "border-white/10 bg-white/5 text-white/50"
                )}
              >
                {done ? "OK" : "—"}
              </div>
            </div>
            <div className="mt-3 text-sm font-semibold">{s}</div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className={clsx("h-full", done ? "w-full bg-success/70" : "w-1/5 bg-white/20")} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

