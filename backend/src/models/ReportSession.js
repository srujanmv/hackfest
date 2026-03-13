import mongoose from "mongoose";

const ReportSessionSchema = new mongoose.Schema(
  {
    reportId: { type: String, index: true, unique: true },
    transcript: { type: String },
    issueType: { type: String },
    severity: { type: String },
    departmentAssigned: { type: String },
    locationText: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    phone: { type: String },
    verificationStatus: { type: String, default: "pending" },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export const ReportSessionModel =
  mongoose.models.ReportSession ||
  mongoose.model("ReportSession", ReportSessionSchema);

