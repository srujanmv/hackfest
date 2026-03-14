import { API_BASE_URL } from "@/lib/config";
import type { Ticket } from "@/lib/types";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function startReport(input: {
  transcript: string;
  lat?: number;
  lng?: number;
  locationText?: string;
  phone?: string;
  otp?: string;
}) {
  return await http<{
    reportId: string;
    suggestedIssueType: string;
    severity: string;
    departmentAssigned: string;
    next: "upload_image";
  }>("/api/reports/start", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function uploadVerificationImage(reportId: string, file: File) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}/verify-image`, {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed: ${res.status}`);
  }
  return (await res.json()) as {
    verificationStatus: "verified" | "failed";
    message: string;
    imageUrl?: string;
    next?: "create_ticket" | "upload_image_again";
  };
}

export async function createTicket(reportId: string) {
  return await http<{ ticket: Ticket; notification: string }>(
    `/api/reports/${reportId}/create-ticket`,
    { method: "POST" }
  );
}

export async function getTicket(id: string) {
  return await http<{ ticket: Ticket }>(`/api/tickets/${id}`);
}

export async function listTickets() {
  return await http<{ tickets: Ticket[] }>(`/api/tickets`);
}

export async function getDashboard() {
  return await http<{
    totals: {
      active: number;
      resolved: number;
      avgResponseHours: number;
      departmentsResponding: number;
    };
    issuesByCategory: { name: string; value: number }[];
    dailyTrends: { day: string; count: number }[];
    deptResponseTimes: { department: string; hours: number }[];
    recent: Ticket[];
  }>(`/api/admin/dashboard`);
}

export async function requestOtp(phone: string) {
  return await http<{ ok: true; devOtp: string }>(`/api/auth/request-otp`, {
    method: "POST",
    body: JSON.stringify({ phone })
  });
}

export async function askAssistant(input: {
  question: string;
  ticketId?: string;
  history?: { role: "user" | "assistant"; text: string }[];
  context?: {
    issueType?: string;
    department?: string;
    locationText?: string;
  };
}) {
  return await http<{ answer: string }>(`/api/assistant/ask`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

