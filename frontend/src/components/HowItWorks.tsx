"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const steps = [
  { title: "Citizen speaks a complaint.", n: "01" },
  { title: "AI converts speech to text.", n: "02" },
  { title: "AI analyzes location and images.", n: "03" },
  { title: "AI verifies issue authenticity.", n: "04" },
  { title: "Ticket created & department alerted.", n: "05" }
];

export function HowItWorks() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="text-sm text-white/60">5-step autonomous pipeline</div>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {steps.map((s, idx) => (
          <Card
            key={s.n}
            className="p-4"
            interactive
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/50">Step</div>
              <div className="text-xs font-semibold text-secondary">{s.n}</div>
            </div>
            <div className="mt-3 text-sm font-semibold">{s.title}</div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: `${30 + idx * 14}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="h-full bg-primary/80"
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

