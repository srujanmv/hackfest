import Link from "next/link";

export function LiveIncidentPreview() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold">Live incident preview</h2>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
        >
          Open dashboard
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active incidents" value="18" accent="danger" />
        <StatCard label="Resolved incidents" value="46" accent="success" />
        <StatCard label="Departments responding" value="7" accent="secondary" />
        <StatCard label="Avg response time" value="3.2h" accent="primary" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <IncidentMini
          title="Pothole near school"
          meta="Verified • Road Maintenance"
          status="Critical"
        />
        <IncidentMini
          title="Streetlight not working"
          meta="Assigned • Electrical Maintenance"
          status="Moderate"
        />
        <IncidentMini
          title="Garbage overflow"
          meta="In progress • Sanitation"
          status="Moderate"
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent: "primary" | "secondary" | "danger" | "success";
}) {
  const accentClass =
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
      <div className={`mt-2 text-3xl font-semibold ${accentClass}`}>{value}</div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 bg-white/20" />
      </div>
    </div>
  );
}

function IncidentMini({
  title,
  meta,
  status
}: {
  title: string;
  meta: string;
  status: "Critical" | "Moderate" | "Resolved";
}) {
  const badge =
    status === "Critical"
      ? "bg-danger/15 text-danger border-danger/30"
      : status === "Moderate"
        ? "bg-warning/15 text-warning border-warning/30"
        : "bg-success/15 text-success border-success/30";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="mt-1 text-sm text-white/65">{meta}</div>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
          {status}
        </div>
      </div>
    </div>
  );
}

