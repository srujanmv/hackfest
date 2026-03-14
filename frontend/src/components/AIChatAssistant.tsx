"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { askAssistant } from "@/lib/api";

type Msg = { role: "user" | "assistant"; text: string };

type Props = {
  ticketId?: string;
  issueType?: string;
  department?: string;
  locationText?: string;
  title?: string;
  description?: string;
  initialAssistantMessage?: string;
  suggestions?: string[];
};

type SpeechRecognitionCtor = new () => SpeechRecognition;

export function AIChatAssistant({
  ticketId: initialTicketId,
  issueType,
  department,
  locationText,
  title = "AI voice assistant",
  description = "Ask anything by typing or using your microphone. Replies are spoken automatically.",
  initialAssistantMessage = "Ask me anything. I can answer general questions and use your ticket or report context when available.",
  suggestions
}: Props) {
  const [ticketId, setTicketId] = useState(initialTicketId ?? "");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: initialAssistantMessage
    }
  ]);
  const recRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const SpeechRecognitionImpl = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor })
        .webkitSpeechRecognition ??
      null
    );
  }, []);

  useEffect(() => {
    setSupported(!!SpeechRecognitionImpl);
  }, [SpeechRecognitionImpl]);

  useEffect(() => {
    setTicketId(initialTicketId ?? "");
  }, [initialTicketId]);

  useEffect(() => {
    setMsgs([{ role: "assistant", text: initialAssistantMessage }]);
  }, [initialAssistantMessage]);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined" || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question) return;

    const history = msgs.slice(-8);
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setQ("");
    setError(null);
    setBusy(true);

    try {
      const r = await askAssistant({
        question,
        ticketId: ticketId.trim() || undefined,
        history,
        context: {
          issueType,
          department,
          locationText
        }
      });
      setMsgs((m) => [...m, { role: "assistant", text: r.answer }]);
      speak(r.answer);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Assistant request failed.";
      setMsgs((m) => [...m, { role: "assistant", text: message }]);
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  function startListening() {
    setError(null);
    if (!SpeechRecognitionImpl) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }

    finalTranscriptRef.current = "";
    const rec = new SpeechRecognitionImpl();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${transcript}`.trim();
        } else {
          interim = `${interim} ${transcript}`.trim();
        }
      }
      setQ(`${finalTranscriptRef.current} ${interim}`.trim());
    };

    rec.onerror = (event) => {
      setError((event as unknown as { error?: string }).error ?? "Microphone error");
      setListening(false);
    };

    rec.onend = () => {
      recRef.current = null;
      setListening(false);
      const spokenQuestion = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";
      if (spokenQuestion) {
        void send(spokenQuestion);
      }
    };

    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stopListening() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  const suggestionList = suggestions ?? [
    "What can you help me with?",
    "How do I report a pothole?",
    "What is the status of my ticket?",
    "What should I do next?"
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="mt-1 text-sm text-white/65">{description}</div>
        </div>
        <button
          onClick={listening ? stopListening : startListening}
          disabled={!supported || busy}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {listening ? "Stop mic" : "Ask by voice"}
        </button>
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
        {suggestionList.map((s) => (
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
          placeholder={listening ? "Listening..." : "Ask anything..."}
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

      <div className="mt-3 text-xs text-white/55">
        {supported
          ? "Voice replies are spoken automatically after each answer."
          : "Speech recognition is unavailable in this browser, but typing still works."}
      </div>
      {error ? <div className="mt-2 text-xs text-danger">{error}</div> : null}
    </div>
  );
}
