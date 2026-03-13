export type IssueType =
  | "Pothole"
  | "Water leak"
  | "Power outage"
  | "Streetlight broken"
  | "Road damage"
  | "Garbage overflow"
  | "Unknown";

export type TicketStatus =
  | "Submitted"
  | "Verified"
  | "Assigned"
  | "In Progress"
  | "Resolved";

export type Ticket = {
  id: string;
  issueType: IssueType;
  description: string;
  locationText: string;
  lat?: number;
  lng?: number;
  timestamp: string;
  verificationStatus: "pending" | "verified" | "failed";
  departmentAssigned: string;
  status: TicketStatus;
  severity: "critical" | "moderate" | "low";
  imageUrl?: string;
};

