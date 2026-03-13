export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} Urban Incident Reporter — Smart City Ops
        </div>
        <div className="flex gap-4">
          <span className="text-white/40">Autonomous agent simulation</span>
          <span className="text-white/40">Secure APIs</span>
          <span className="text-white/40">Live map</span>
        </div>
      </div>
    </footer>
  );
}

