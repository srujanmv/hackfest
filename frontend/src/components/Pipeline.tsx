"use client";

import { motion } from "framer-motion";

const stages = [
  "Voice Input",
  "OTP Verification",
  "Location Confirmation",
  "AI Issue Detection",
  "Image Upload",
  "Image Verification",
  "Ticket Creation",
  "Notification + Tracking"
];

export function Pipeline({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {stages.map((s, idx) => {
        const state =
          idx < activeIndex ? "done" : idx === activeIndex ? "active" : "todo";
        const ring =
          state === "done"
            ? "bg-success/20 border-success/30"
            : state === "active"
              ? "bg-primary/15 border-primary/30"
              : "bg-white/5 border-white/10";
        const dot =
          state === "done"
            ? "bg-success"
            : state === "active"
              ? "bg-secondary"
              : "bg-white/30";
        return (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${ring}`}
          >
            <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <div className="text-sm font-semibold">{s}</div>
            <div className="ml-auto text-xs text-white/60">
              {state === "done" ? "Completed" : state === "active" ? "Running" : "Pending"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

