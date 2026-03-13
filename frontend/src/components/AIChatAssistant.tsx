"use client";

import { useState } from "react";
import { askAssistant } from "@/lib/api";

type Msg = { role: "user" | "assistant"; text: string };

export function AIChatAssistant() {
  const [ticketId, setTicketId] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask me about ticket status, ETA, or the nearest service office. Add a ticket ID for precise answers."
    }
  ]);

  async function send(text: string) {
    const question = text.trim();
    if (!question) return;
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const r = await askAssistant({
        question,
        ticketId: ticketId.trim() || undefined
      });
      setMsgs((m) => [...m, { role: "assistant", text: r.answer }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = [
    "Has my issue been resolved?",
    "How long will repairs take?",
    "Where is the nearest service office?",
    "What is the current status?"
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">AI assistant</div>
          <div className="mt-1 text-sm text-white/65">
            Citizen Q&A powered by the platform’s agent logic.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <input
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Optional ticket ID (e.g. URB-2045)"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />
      </div>

      <div className="mt-4 space-y-2">
        {msgs.slice(-6).map((m, i) => (
          <div
            key={i}
            className={
              m.role === "assistant"
                ? "rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80"
                : "ml-auto max-w-[92%] rounded-2xl border border-white/10 bg-primary/15 px-3 py-3 text-sm text-white/90"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => void send(s)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question..."
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
          onKeyDown={(e) => {
            if (e.key === "Enter") void send(q);
          }}
        />
        <button
          onClick={() => void send(q)}
          disabled={busy}
          className="rounded-xl bg-secondary/20 px-4 py-2 text-sm font-semibold shadow-glowStrong transition hover:bg-secondary/25 disabled:opacity-50"
        >
          {busy ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

