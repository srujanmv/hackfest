import Link from "next/link";
import { Button } from "@/components/ui/Button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report" },
  { href: "/track", label: "Track" },
  { href: "/map", label: "Map" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/20 ring-1 ring-white/10 shadow-glow grid place-items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-secondary shadow-glowStrong" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">URBAN</div>
            <div className="-mt-0.5 text-xs text-white/60">Incident Reporter</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/report" className="hidden md:block">
            <Button size="sm">New Report</Button>
          </Link>
          <details className="md:hidden">
            <summary className="focus-ring cursor-pointer list-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80">
              Menu
            </summary>
            <div className="glass-strong absolute right-4 mt-2 w-56 rounded-2xl p-2 shadow-glowSoft">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="block rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/10"
                >
                  {n.label}
                </Link>
              ))}
              <div className="p-2">
                <Link href="/report">
                  <Button className="w-full" size="sm">
                    New Report
                  </Button>
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

