"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognition;

export function VoiceRecorder({ value, onChange }: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognitionImpl = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor })
        .webkitSpeechRecognition ??
      null
    );
  }, []);

  useEffect(() => {
    setSupported(!!SpeechRecognitionImpl);
  }, [SpeechRecognitionImpl]);

  function start() {
    setError(null);
    if (!SpeechRecognitionImpl) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    const rec = new SpeechRecognitionImpl();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (ev) => {
      const parts: string[] = [];
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        parts.push(ev.results[i][0]?.transcript ?? "");
      }
      const next = (value + " " + parts.join(" ")).replace(/\s+/g, " ").trim();
      onChange(next);
    };
    rec.onerror = (e) => setError((e as unknown as { error?: string }).error ?? "Error");
    rec.onend = () => setListening(false);

    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stop() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Microphone</div>
          <div className="mt-1 text-xs text-white/60">
            {supported
              ? "Press to record and transcribe."
              : "Speech-to-text unavailable — type the complaint below."}
          </div>
        </div>

        <button
          onClick={listening ? stop : start}
          className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-black/25 shadow-glow transition hover:bg-black/35"
          aria-label={listening ? "Stop recording" : "Start recording"}
        >
          <motion.div
            animate={listening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={listening ? { repeat: Infinity, duration: 1.1 } : {}}
            className={listening ? "h-5 w-5 rounded bg-danger shadow-glow" : "h-5 w-5 rounded-full bg-secondary shadow-glowStrong"}
          />
          {listening ? (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ boxShadow: ["0 0 0 rgba(255,77,77,0.0)", "0 0 30px rgba(255,77,77,0.35)", "0 0 0 rgba(255,77,77,0.0)"] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          ) : null}
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-primary/60"
        />
        {error ? (
          <div className="text-xs text-danger">{error}</div>
        ) : (
          <div className="text-xs text-white/55">
            Example: “There is a pothole on the road near the bus stand.”
          </div>
        )}
      </div>
    </div>
  );
}

