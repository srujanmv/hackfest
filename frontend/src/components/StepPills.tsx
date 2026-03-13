"use client";

import clsx from "clsx";

type Step =
  | "Voice"
  | "Verify citizen"
  | "Confirm location"
  | "Classify"
  | "Upload photo"
  | "Verify image"
  | "Create ticket";

const steps: Step[] = [
  "Voice",
  "Verify citizen",
  "Confirm location",
  "Classify",
  "Upload photo",
  "Verify image",
  "Create ticket"
];

export function StepPills({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
        return (
          <div
            key={s}
            className={clsx(
              "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold",
              state === "done"
                ? "border-success/30 bg-success/15 text-success"
                : state === "active"
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-white/10 bg-white/5 text-white/55"
            )}
          >
            {s}
          </div>
        );
      })}
    </div>
  );
}

