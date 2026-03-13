"use client";

import { useEffect, useMemo, useState } from "react";

type Step =
  | "voice"
  | "otp"
  | "location"
  | "classify"
  | "upload"
  | "verify"
  | "ticket"
  | "done";

export function AssistantPanel({
  step,
  transcript,
  issueType,
  department,
  locationText,
  verificationMessage,
  ticketId
}: {
  step: Step;
  transcript: string;
  issueType: string;
  department: string;
  locationText: string;
  verificationMessage: string;
  ticketId?: string;
}) {
  const [voiceOn, setVoiceOn] = useState(false);

  const lines = useMemo(() => {
    const base = [
      `I’m listening. Describe the issue clearly and include a landmark.`,
      `I’ll classify the incident and route it to the right department.`
    ];
    if (step === "upload") {
      return [
        `I classified this as: ${issueType}.`,
        `Please upload an image to verify the issue.`,
        `Location noted: ${locationText}.`
      ];
    }
    if (step === "ticket") {
      return [
        `Verification looks good. I can create a service ticket now.`,
        `Assigned department: ${department}.`
      ];
    }
    if (step === "done") {
      return [
        `Ticket created successfully.`,
        ticketId ? `Your ticket ID is ${ticketId}.` : `Your ticket is created.`,
        `Department has been notified successfully.`
      ];
    }
    if (verificationMessage) return [verificationMessage];
    if (transcript) return [`Captured complaint: “${transcript}”`];
    return base;
  }, [step, issueType, department, locationText, verificationMessage, transcript, ticketId]);

  useEffect(() => {
    if (!voiceOn) return;
    if (typeof window === "undefined") return;
    const utter = new SpeechSynthesisUtterance(lines[0] ?? "");
    utter.rate = 1.02;
    utter.pitch = 1.0;
    utter.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return () => window.speechSynthesis.cancel();
  }, [lines, voiceOn]);

  return (
    <aside className="glass sticky top-[92px] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Autonomous Assistant</div>
          <div className="mt-1 text-xs text-white/60">
            Human-like voice guidance (not a chat). It speaks the next best action.
          </div>
        </div>
        <button
          onClick={() => setVoiceOn((v) => !v)}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold transition hover:bg-white/10"
        >
          Voice: {voiceOn ? "On" : "Off"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {lines.map((l, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80"
          >
            {l}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs text-white/55">Routing decision</div>
          <div className="mt-1 text-sm font-semibold text-secondary">{department}</div>
          <div className="mt-2 text-xs text-white/55">Issue type</div>
          <div className="mt-1 text-sm font-semibold">{issueType}</div>
        </div>
      </div>
    </aside>
  );
}

