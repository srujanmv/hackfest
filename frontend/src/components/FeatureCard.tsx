"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

export function FeatureCard({
  title,
  description,
  accent
}: {
  title: string;
  description: string;
  accent: "primary" | "secondary";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass group rounded-2xl p-5 transition hover:border-white/15"
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "mt-1 h-2.5 w-2.5 rounded-full",
            accent === "primary" ? "bg-primary shadow-glow" : "bg-secondary shadow-glowStrong"
          )}
        />
        <div className="space-y-1">
          <div className="text-base font-semibold">{title}</div>
          <div className="text-sm text-white/70">{description}</div>
        </div>
      </div>
    </motion.div>
  );
}

