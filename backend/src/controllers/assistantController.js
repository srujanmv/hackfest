import { store } from "../services/store.js";

function normalize(s) {
  return (s ?? "").toLowerCase();
}

export const assistantController = {
  async ask({ question, ticketId }) {
    const q = normalize(question);

    if (ticketId) {
      const t = await store.getTicket(ticketId);
      if (t) {
        if (/(resolved|done|fixed|completed)/.test(q)) {
          return {
            answer:
              t.status === "Resolved"
                ? `Yes — ticket ${t.id} is resolved.`
                : `Not yet — ticket ${t.id} is currently “${t.status}”.`
          };
        }
        if (/(status|progress|update)/.test(q)) {
          return {
            answer: `Ticket ${t.id} status: ${t.status}. Assigned department: ${t.departmentAssigned}.`
          };
        }
        if (/(how long|eta|time)/.test(q)) {
          const eta =
            t.severity === "critical" ? "2–6 hours" : t.severity === "moderate" ? "6–24 hours" : "1–3 days";
          return {
            answer: `Estimated resolution time for ${t.severity} incidents is ${eta}. Current status: ${t.status}.`
          };
        }
      }
    }

    if (/(nearest|office|service office|help desk)/.test(q)) {
      return {
        answer:
          "Nearest service office varies by department. In this demo, visit your local municipal ward office or call the city helpline for routing."
      };
    }

    if (/(how long|eta|time)/.test(q)) {
      return {
        answer:
          "Typical ETAs: critical 2–6h, moderate 6–24h, low 1–3 days. Share your ticket ID for a precise update."
      };
    }

    if (/(track|status|my issue)/.test(q)) {
      return {
        answer:
          "To check progress, open the Track page and enter your ticket ID (example: URB-2045)."
      };
    }

    return {
      answer:
        "I can help with ticket status, ETA, and service office guidance. Provide a ticket ID for the most accurate answer."
    };
  }
};

