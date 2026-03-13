"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MapPicker } from "@/components/MapPicker";
import { ImageUploader } from "@/components/ImageUploader";
import { Pipeline } from "@/components/Pipeline";
import { AssistantPanel } from "@/components/AssistantPanel";
import { TicketStatus } from "@/components/TicketStatus";
import { StepPills } from "@/components/StepPills";
import { createTicket, requestOtp, startReport, uploadVerificationImage } from "@/lib/api";
import type { Ticket } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Step =
  | "voice"
  | "otp"
  | "location"
  | "classify"
  | "upload"
  | "verify"
  | "ticket"
  | "done";

export default function ReportPage() {
  const [step, setStep] = useState<Step>("voice");
  const [transcript, setTranscript] = useState(
    "There is a pothole on the road near the school in my village."
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [locationText, setLocationText] = useState("Village Road near temple");

  const [reportId, setReportId] = useState<string | null>(null);
  const [issueType, setIssueType] = useState<string>("Unknown");
  const [department, setDepartment] = useState<string>("—");
  const [severity, setSeverity] = useState<string>("moderate");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [notification, setNotification] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const pipelineStage = useMemo(() => {
    const order: Step[] = [
      "voice",
      "otp",
      "location",
      "classify",
      "upload",
      "verify",
      "ticket",
      "done"
    ];
    const idx = order.indexOf(step);
    return Math.max(0, idx);
  }, [step]);

  const stepIndex = pipelineStage;

  async function onRequestOtp() {
    setBusy(true);
    try {
      const r = await requestOtp(phone);
      setDevOtpHint(r.devOtp);
      setStep("otp");
    } finally {
      setBusy(false);
    }
  }

  async function onStart() {
    setBusy(true);
    try {
      const r = await startReport({
        transcript,
        phone,
        otp,
        lat,
        lng,
        locationText
      });
      setReportId(r.reportId);
      setIssueType(r.suggestedIssueType);
      setSeverity(r.severity);
      setDepartment(r.departmentAssigned);
      setStep("upload");
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(file: File) {
    if (!reportId) return;
    setBusy(true);
    setVerificationMessage("");
    try {
      const r = await uploadVerificationImage(reportId, file);
      setImageUrl(r.imageUrl);
      setVerificationMessage(r.message);
      setStep(r.verificationStatus === "verified" ? "ticket" : "upload");
      if (r.verificationStatus === "verified") {
        setStep("ticket");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onCreateTicket() {
    if (!reportId) return;
    setBusy(true);
    try {
      const r = await createTicket(reportId);
      setTicket(r.ticket);
      setNotification(r.notification);
      setStep("done");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="space-y-6">
        <Card className="relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-80" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold md:text-3xl">Create an incident report</h1>
                <p className="mt-1 text-sm text-white/65 md:text-base">
                  One guided flow: voice → classify → verify → ticket → notify.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/70">
                Security: rate-limited + OTP (demo)
              </div>
            </div>

            <div className="mt-4">
              <StepPills activeIndex={Math.min(stepIndex, 6)} />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <VoiceRecorder value={transcript} onChange={setTranscript} />

                <Card className="p-4" interactive>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Citizen verification</div>
                      <div className="mt-1 text-xs text-white/60">
                        Reduces spam. OTP is demo-mode for hackathons.
                      </div>
                    </div>
                    <div className="text-xs text-white/55">Optional</div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number (e.g. 9990001111)"
                      className="focus-ring w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
                    />
                    {step === "otp" || devOtpHint ? (
                      <div className="grid gap-2">
                        <input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          className="focus-ring w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary/60"
                        />
                        {devOtpHint ? (
                          <div className="text-xs text-white/55">
                            Dev OTP (demo): <span className="text-secondary">{devOtpHint}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        onClick={onRequestOtp}
                        disabled={!phone || busy}
                        variant="ghost"
                        size="sm"
                      >
                        Request OTP
                      </Button>
                      <Button
                        onClick={() => setStep("location")}
                        variant="ghost"
                        size="sm"
                      >
                        Skip (demo)
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <MapPicker
                  lat={lat}
                  lng={lng}
                  locationText={locationText}
                  onChange={({ lat, lng, locationText }) => {
                    setLat(lat);
                    setLng(lng);
                    setLocationText(locationText);
                  }}
                />

                <Card id="upload" className="p-4" interactive>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Image verification</div>
                      <div className="mt-1 text-xs text-white/60">
                        Please upload an image to verify the issue.
                      </div>
                    </div>
                    <div className="text-xs text-white/55">
                      Category: <span className="text-secondary">{issueType}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ImageUploader
                      busy={busy}
                      imageUrl={imageUrl}
                      hint="Tip: filename containing “pothole” will verify in demo mode."
                      onUpload={onUpload}
                    />
                  </div>

                  {verificationMessage ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/75"
                    >
                      {verificationMessage}
                    </motion.div>
                  ) : null}
                </Card>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={() => setStep("classify")} variant="ghost" size="lg">
                Continue workflow
              </Button>
              <Button onClick={onStart} disabled={!transcript || busy} size="lg">
                Run AI classification
              </Button>
            {reportId ? (
              <div className="text-sm text-white/60">
                Report session: <span className="text-white/80">{reportId}</span>
              </div>
            ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Autonomous workflow</h2>
              <div className="mt-1 text-sm text-white/65">
                Multi-stage pipeline with progress and state.
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
              Routed to: <span className="text-secondary">{department}</span>
            </div>
          </div>
          <div className="mt-5">
            <Pipeline activeIndex={pipelineStage} />
          </div>
        </Card>

        {step === "ticket" && reportId ? (
          <Card className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Service ticket creation</h2>
                <div className="mt-1 text-sm text-white/65">
                  Verification confirmed? Generate and notify the department.
                </div>
              </div>
              <div className="text-xs text-white/60">
                Severity: <span className="text-warning">{severity}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={onCreateTicket} disabled={busy} size="lg">
                Create Ticket
              </Button>
              <div className="text-sm text-white/65">
                Department routing: <span className="text-secondary">{department}</span>
              </div>
            </div>
          </Card>
        ) : null}

        {ticket ? (
          <Card className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Ticket generated</h2>
                <div className="mt-1 text-sm text-white/65">{notification}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                Ticket ID: <span className="text-secondary">{ticket.id}</span>
              </div>
            </div>
            <div className="mt-4">
              <TicketStatus status={ticket.status} />
            </div>
          </Card>
        ) : null}
      </div>

      <div className="space-y-6">
        <AssistantPanel
          step={step}
          transcript={transcript}
          issueType={issueType}
          department={department}
          locationText={locationText}
          verificationMessage={verificationMessage}
          ticketId={ticket?.id}
        />
      </div>
    </div>
  );
}

