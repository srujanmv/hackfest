"use client";

import { AIChatAssistant } from "@/components/AIChatAssistant";

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
  const summary =
    step === "upload"
      ? "I classified your issue. Ask questions or upload an image to continue."
      : step === "ticket"
        ? "Verification passed. Ask for a summary or create the ticket."
        : step === "done"
          ? ticketId
            ? `Ticket ${ticketId} is ready. Ask for the next steps or status details.`
            : "Your report is complete. Ask anything about the incident."
          : verificationMessage
            ? verificationMessage
            : transcript
              ? `Current complaint: ${transcript}`
              : "Describe the issue or ask what to do next.";

  return (
    <aside className="glass sticky top-[92px] rounded-2xl p-5">
      <div>
        <div className="text-sm font-semibold">Voice assistant</div>
        <div className="mt-1 text-xs text-white/60">
          Ask questions about this report, your ticket, or anything else.
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80">
        {summary}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs text-white/55">Routing decision</div>
          <div className="mt-1 text-sm font-semibold text-secondary">{department}</div>
          <div className="mt-2 text-xs text-white/55">Issue type</div>
          <div className="mt-1 text-sm font-semibold">{issueType}</div>
        </div>

        <AIChatAssistant
          ticketId={ticketId}
          issueType={issueType}
          department={department}
          locationText={locationText}
          title="Report copilot"
          description="Use your microphone or type. The assistant speaks every reply and uses the live report context."
          initialAssistantMessage={summary}
          suggestions={[
            "What should I do next?",
            "Summarize this report",
            "Which department is handling this?",
            "Is my ticket resolved?"
          ]}
        />
      </div>
    </aside>
  );
}
