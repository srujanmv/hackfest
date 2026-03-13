import path from "path";
import { nanoid } from "nanoid";
import { classifyIssue, estimateSeverity, routeDepartment } from "../ai/classifier.js";
import { verifyImage } from "../ai/imageVerifier.js";
import { store } from "../services/store.js";
import { otpService } from "../services/otpService.js";

function mkReportId() {
  return `REP-${nanoid(10)}`;
}

function mkTicketId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `URB-${n}`;
}

export const reportsController = {
  async start({ transcript, lat, lng, locationText, phone, otp }) {
    if (phone && otp) {
      const ok = otpService.verifyOtp(phone, otp);
      if (!ok) {
        return {
          reportId: mkReportId(),
          suggestedIssueType: "Unknown",
          severity: "moderate",
          departmentAssigned: "Municipal Helpline",
          next: "upload_image",
          warning: "OTP invalid (demo). Continuing in demo mode."
        };
      }
    }

    const issueType = classifyIssue(transcript);
    const severity = estimateSeverity(transcript, issueType);
    const departmentAssigned = routeDepartment(issueType);
    const reportId = mkReportId();

    await store.createReportSession({
      reportId,
      transcript,
      issueType,
      severity,
      departmentAssigned,
      locationText: locationText || "Unknown location",
      lat,
      lng,
      phone: phone || undefined,
      verificationStatus: "pending",
      imageUrl: undefined
    });

    return {
      reportId,
      suggestedIssueType: issueType,
      severity,
      departmentAssigned,
      next: "upload_image"
    };
  },

  async verifyImage({ reportId, file }) {
    const report = await store.getReportSession(reportId);
    if (!report) {
      return {
        verificationStatus: "failed",
        message: "Report session not found. Please restart the workflow."
      };
    }

    const v = verifyImage({ issueType: report.issueType, originalName: file.originalname });
    const imageUrl = `/uploads/${path.basename(file.path)}`;

    await store.updateReportSession(reportId, {
      verificationStatus: v.verificationStatus,
      imageUrl
    });

    return {
      verificationStatus: v.verificationStatus,
      message: v.message,
      imageUrl,
      next: v.verificationStatus === "verified" ? "create_ticket" : "upload_image_again"
    };
  },

  async createTicket({ reportId }) {
    const report = await store.getReportSession(reportId);
    if (!report) return null;
    if (report.verificationStatus !== "verified") {
      return {
        ticket: null,
        notification: "Verification pending. Please upload a clearer image."
      };
    }

    const ticket = {
      id: mkTicketId(),
      issueType: report.issueType,
      description: report.transcript,
      locationText: report.locationText,
      lat: report.lat,
      lng: report.lng,
      timestamp: new Date().toISOString(),
      verificationStatus: "verified",
      departmentAssigned: report.departmentAssigned,
      status: "Assigned",
      severity: report.severity || "moderate",
      imageUrl: report.imageUrl
    };

    await store.createTicket(ticket);

    return {
      ticket,
      notification: "Department has been notified successfully."
    };
  }
};

