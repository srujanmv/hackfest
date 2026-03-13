"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getDashboard } from "@/lib/api";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, []);

  const totals = data?.totals;
  const recent = useMemo(() => data?.recent ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Citizen dashboard</h1>
          <div className="mt-1 text-sm text-white/65">
            Real-time city incident analytics and recent reports.
          </div>
        </div>
      </div>

      {err ? (
        <Card className="p-5 text-sm text-danger">{err}</Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Active" value={totals ? String(totals.active) : "—"} accent="danger" />
        <Stat label="Resolved" value={totals ? String(totals.resolved) : "—"} accent="success" />
        <Stat
          label="Departments responding"
          value={totals ? String(totals.departmentsResponding) : "—"}
          accent="secondary"
        />
        <Stat
          label="Avg response time"
          value={totals ? `${totals.avgResponseHours.toFixed(1)}h` : "—"}
          accent="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Issues by category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.issuesByCategory ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
              <YAxis stroke="rgba(255,255,255,0.55)" />
              <Tooltip contentStyle={{ background: "#0B0F1A", border: "1px solid rgba(255,255,255,0.12)" }} />
              <Legend />
              <Bar dataKey="value" fill="rgba(79,140,255,0.85)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily incident trends">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data?.dailyTrends ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.55)" />
              <YAxis stroke="rgba(255,255,255,0.55)" />
              <Tooltip contentStyle={{ background: "#0B0F1A", border: "1px solid rgba(255,255,255,0.12)" }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="rgba(0,229,255,0.9)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Recent complaints</div>
            <div className="mt-1 text-sm text-white/65">Live feed (demo data if DB empty).</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {recent.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    {t.issueType} • <span className="text-secondary">{t.id}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    {t.locationText} • {new Date(t.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  {t.status}
                </div>
              </div>
            </div>
          ))}
          {recent.length === 0 ? (
            <div className="text-sm text-white/60">No incidents yet. Create one in Report.</div>
          ) : null}
        </div>
      </div>

      <AIChatAssistant />
    </div>
  );
}

function Stat({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent: "primary" | "secondary" | "danger" | "success";
}) {
  const c =
    accent === "primary"
      ? "text-primary"
      : accent === "secondary"
        ? "text-secondary"
        : accent === "danger"
          ? "text-danger"
          : "text-success";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-sm text-white/60">{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${c}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 md:p-8">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

