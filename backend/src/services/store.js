import { isDbConnected } from "./db.js";
import { TicketModel } from "../models/Ticket.js";
import { ReportSessionModel } from "../models/ReportSession.js";

const mem = {
  reports: [],
  tickets: []
};

export const store = {
  async createReportSession(r) {
    if (isDbConnected()) {
      await ReportSessionModel.create(r);
      return r;
    }
    mem.reports.unshift(r);
    return r;
  },
  async getReportSession(reportId) {
    if (isDbConnected()) {
      return await ReportSessionModel.findOne({ reportId }).lean();
    }
    return mem.reports.find((x) => x.reportId === reportId) ?? null;
  },
  async updateReportSession(reportId, patch) {
    if (isDbConnected()) {
      return await ReportSessionModel.findOneAndUpdate({ reportId }, patch, {
        new: true
      }).lean();
    }
    const idx = mem.reports.findIndex((x) => x.reportId === reportId);
    if (idx === -1) return null;
    mem.reports[idx] = { ...mem.reports[idx], ...patch };
    return mem.reports[idx];
  },
  async createTicket(t) {
    if (isDbConnected()) {
      await TicketModel.create(t);
      return t;
    }
    mem.tickets.unshift(t);
    return t;
  },
  async getTicket(id) {
    if (isDbConnected()) {
      return await TicketModel.findOne({ id }).lean();
    }
    return mem.tickets.find((x) => x.id === id) ?? null;
  },
  async listTickets() {
    if (isDbConnected()) {
      const rows = await TicketModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
      return rows;
    }
    return mem.tickets.slice(0, 200);
  }
};

