"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getDashboard } from "@/lib/api";
import { Card } from "@/components/ui/Card";

export default function AdminPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <div className="mt-1 text-sm text-white/65">
          City authority view: department performance, trends, and routing outcomes.
        </div>
      </div>

      {err ? <Card className="p-5 text-sm text-danger">{err}</Card> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 md:p-8">
          <div className="text-lg font-semibold">Department response times</div>
          <div className="mt-1 text-sm text-white/60">Lower is better (hours).</div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.deptResponseTimes ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="department" stroke="rgba(255,255,255,0.55)" />
                <YAxis stroke="rgba(255,255,255,0.55)" />
                <Tooltip contentStyle={{ background: "#0B0F1A", border: "1px solid rgba(255,255,255,0.12)" }} />
                <Bar dataKey="hours" fill="rgba(0,229,255,0.8)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="text-lg font-semibold">Routing console</div>
          <div className="mt-1 text-sm text-white/60">
            In a production system, this would integrate with government ticketing systems.
          </div>
          <div className="mt-4 space-y-3">
            <ConsoleLine label="Classifier" value="AI prompt + heuristics (demo-safe)" />
            <ConsoleLine label="Verification" value="Image heuristics + filename rules" />
            <ConsoleLine label="Ticketing" value="MongoDB + audit events" />
            <ConsoleLine label="Security" value="Rate limit + file validation + OTP (demo)" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ConsoleLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/80">{value}</div>
    </div>
  );
}

