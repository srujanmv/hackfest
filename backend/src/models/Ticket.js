import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    id: { type: String, index: true, unique: true },
    issueType: { type: String },
    description: { type: String },
    locationText: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date },
    verificationStatus: { type: String },
    departmentAssigned: { type: String },
    status: { type: String },
    severity: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export const TicketModel =
  mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);

