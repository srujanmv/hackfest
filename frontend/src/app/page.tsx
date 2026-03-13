 "use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/FeatureCard";
import { LiveIncidentPreview } from "@/components/LiveIncidentPreview";
import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow md:p-10">
        <SmartCityBackground />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-secondary shadow-glowStrong" />
              Autonomous civic agent online • Smart City Ops
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] md:text-6xl">
              Report infrastructure problems using your <span className="text-secondary">voice</span>.
            </h1>
            <p className="max-w-xl text-pretty text-base text-white/75 md:text-lg">
              A human-like autonomous agent that listens, verifies with images, confirms location, and files the right
              ticket to the right department — instantly.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/report">
                <Button size="lg">Start Voice Report</Button>
              </Link>
              <Link href="/report#upload">
                <Button size="lg" variant="ghost">
                  Upload Issue Photo
                </Button>
              </Link>
              <Link href="/map">
                <Button size="lg" variant="ghost">
                  View City Incident Map
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              <MiniKpi label="Avg agent time" value="~22s" />
              <MiniKpi label="Auto-routing" value="100%" />
              <MiniKpi label="Verification" value="Image + location" />
            </div>
          </div>

          <Card className="relative p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Agentic workflow</div>
              <div className="text-xs text-white/60">Live simulation</div>
            </div>
            <div className="mt-4">
              <WorkflowTeaser />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
          </Card>
        </div>
      </section>

      <HowItWorks />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Core capabilities</h2>
          <div className="text-sm text-white/60">
            Built for hackathons, designed like a product
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Voice reporting"
            description="A citizen speaks naturally; the system captures and transcribes instantly."
            accent="primary"
          />
          <FeatureCard
            title="Image verification"
            description="Upload a photo; the agent verifies authenticity with smart heuristics."
            accent="secondary"
          />
          <FeatureCard
            title="AI issue classification"
            description="Agent classifies the incident type and severity using prompts."
            accent="primary"
          />
          <FeatureCard
            title="Automatic department routing"
            description="Routes to the right government unit with clear accountability."
            accent="secondary"
          />
          <FeatureCard
            title="Real-time incident map"
            description="City-wide view of issues, color-coded by urgency and status."
            accent="primary"
          />
          <FeatureCard
            title="Autonomous workflow automation"
            description="Multi-stage pipeline: listen → verify → ticket → notify → track."
            accent="secondary"
          />
        </div>
      </section>

      <LiveIncidentPreview />
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/85">{value}</div>
    </div>
  );
}

function SmartCityBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute inset-0 opacity-70">
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1200" y2="0">
              <stop stopColor="#4F8CFF" stopOpacity="0.55" />
              <stop offset="1" stopColor="#00E5FF" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {Array.from({ length: 18 }).map((_, i) => (
            <path
              key={i}
              d={`M ${40 + i * 65} 20 C ${140 + i * 52} 120, ${
                80 + i * 55
              } 250, ${60 + i * 62} 500`}
              stroke="url(#g)"
              strokeOpacity="0.12"
            />
          ))}
        </svg>
      </div>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-secondary/90 shadow-glowStrong" />
        <div className="absolute left-[24%] top-[48%] h-1.5 w-1.5 rounded-full bg-primary/90 shadow-glow" />
        <div className="absolute left-[70%] top-[30%] h-2 w-2 rounded-full bg-primary/90 shadow-glow" />
        <div className="absolute left-[82%] top-[60%] h-1.5 w-1.5 rounded-full bg-secondary/90 shadow-glowStrong" />
      </motion.div>
    </div>
  );
}

function WorkflowTeaser() {
  const stages = [
    "Voice Input",
    "Speech to Text",
    "AI Issue Detection",
    "Image Verification",
    "Location Confirmation",
    "Ticket Creation",
    "Department Notification"
  ];
  return (
    <div className="space-y-3">
      {stages.map((s, idx) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.06 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
        >
          <div className="h-2 w-2 rounded-full bg-secondary/80 shadow-glowStrong" />
          <div className="text-sm text-white/80">{s}</div>
          <div className="ml-auto h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-primary/80"
              initial={{ width: "15%" }}
              whileInView={{ width: `${30 + idx * 10}%` }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

