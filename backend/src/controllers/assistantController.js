import { store } from "../services/store.js";

function normalize(s) {
  return (s ?? "").toLowerCase();
}

function buildTicketSummary(ticket) {
  if (!ticket) return "No ticket details were found for the provided ticket ID.";
  return [
    `Ticket ID: ${ticket.id}`,
    `Status: ${ticket.status}`,
    `Issue type: ${ticket.issueType}`,
    `Department: ${ticket.departmentAssigned}`,
    `Severity: ${ticket.severity}`,
    `Location: ${ticket.locationText}`,
    `Verification: ${ticket.verificationStatus}`
  ].join("\n");
}

function buildRuntimeContext({ ticket, ticketId, context }) {
  const parts = [
    "You are the civic support voice assistant for the Urban Incident Reporter app.",
    "Answer clearly, helpfully, and in plain language.",
    "If you do not know an app-specific fact, say so instead of inventing it."
  ];

  if (ticketId && !ticket) {
    parts.push(`The user provided ticket ID ${ticketId}, but no matching ticket was found.`);
  }
  if (ticket) {
    parts.push(`Known ticket context:\n${buildTicketSummary(ticket)}`);
  }
  if (context?.issueType || context?.department || context?.locationText) {
    parts.push(
      [
        "Live report context:",
        context.issueType ? `Issue type: ${context.issueType}` : null,
        context.department ? `Department: ${context.department}` : null,
        context.locationText ? `Location: ${context.locationText}` : null
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  return parts.join("\n\n");
}

function extractResponseText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputs = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  return "";
}

function getEtaForSeverity(severity) {
  return severity === "critical"
    ? "2 to 6 hours"
    : severity === "moderate"
      ? "6 to 24 hours"
      : "1 to 3 days";
}

function buildContextSummary(context) {
  const details = [
    context?.issueType ? `Issue type: ${context.issueType}.` : null,
    context?.department ? `Department: ${context.department}.` : null,
    context?.locationText ? `Location: ${context.locationText}.` : null
  ].filter(Boolean);

  return details.length > 0 ? details.join(" ") : "";
}

async function fallbackAnswer({ question, ticket, ticketId, context }) {
  const q = normalize(question);
  const contextSummary = buildContextSummary(context);

  if (ticket) {
    if (/(resolved|done|fixed|completed)/.test(q)) {
      return ticket.status === "Resolved"
        ? `Yes, ticket ${ticket.id} is resolved.`
        : `Not yet. Ticket ${ticket.id} is currently ${ticket.status}.`;
    }
    if (/(status|progress|update)/.test(q)) {
      return `Ticket ${ticket.id} is ${ticket.status}. Assigned department: ${ticket.departmentAssigned}.`;
    }
    if (/(how long|eta|time)/.test(q)) {
      const eta = getEtaForSeverity(ticket.severity);
      return `Estimated resolution time for this ${ticket.severity} issue is ${eta}. Current status: ${ticket.status}.`;
    }
    if (/(department|team|who is handling|who handles)/.test(q)) {
      return `This issue is assigned to ${ticket.departmentAssigned}. Current status is ${ticket.status}.`;
    }
    if (/(location|where)/.test(q)) {
      return `The ticket is logged for ${ticket.locationText}.`;
    }
    if (/(severity|priority|urgent)/.test(q)) {
      return `This ticket is marked ${ticket.severity}. Current status is ${ticket.status}.`;
    }
  }

  if (ticketId && !ticket) {
    return `I could not find ticket ${ticketId}. Please check the ID and try again on the Track page.`;
  }

  if (/(hello|hi|hey|good morning|good evening)/.test(q)) {
    return "Hello. I can help you report civic issues, explain the workflow, and answer ticket-related questions.";
  }

  if (/(who are you|what are you|what can you do|help)/.test(q)) {
    return "I am the project assistant. You can ask me how to report an issue, what each step means, expected resolution times, routing departments, or ticket status.";
  }

  if (/(how do i report|how to report|report an issue|create report|raise complaint|file complaint)/.test(q)) {
    return "Open the Report page, describe the issue, verify with OTP if needed, pin the location, upload an image, and then create the ticket after verification.";
  }

  if (/(otp|verification code|phone verification)/.test(q)) {
    return "OTP is used as a lightweight anti-spam step in this demo. You can request it with your phone number, or skip it in demo mode if needed.";
  }

  if (/(image|photo|upload|picture|verify)/.test(q)) {
    return "After classification, upload a clear image of the issue so the system can verify it before ticket creation.";
  }

  if (/(location|map|pin location|where to mark)/.test(q)) {
    return context?.locationText
      ? `The current report location is ${context.locationText}. You can change it from the map picker on the Report page.`
      : "Use the map picker on the Report page to set the issue location as accurately as possible.";
  }

  if (/(department|which department|who handles|routing)/.test(q)) {
    return context?.department
      ? `This report is currently routed to ${context.department}.${contextSummary ? ` ${contextSummary}` : ""}`
      : "The app routes issues to the relevant department after classification, such as roads, water, sanitation, or electrical maintenance.";
  }

  if (/(issue type|category|classified|classification|what issue)/.test(q)) {
    return context?.issueType
      ? `The current report is classified as ${context.issueType}.${contextSummary ? ` ${contextSummary}` : ""}`
      : "The app can classify issues like potholes, water leaks, power outages, broken streetlights, garbage overflow, and road damage.";
  }

  if (/(nearest|office|service office|help desk)/.test(q)) {
    return "Visit your local municipal ward office or city helpline for routing in this demo.";
  }

  if (/(how long|eta|time)/.test(q)) {
    return "Typical ETAs are 2 to 6 hours for critical issues, 6 to 24 hours for moderate issues, and 1 to 3 days for low-priority issues.";
  }

  if (/(track|status|ticket)/.test(q)) {
    return "Open the Track page and enter your ticket ID for the latest incident status.";
  }

  if (/(dashboard|analytics|admin|recent complaints)/.test(q)) {
    const tickets = await store.listTickets();
    return tickets.length > 0
      ? `There are ${tickets.length} recent tickets available in the dashboard view. You can use Dashboard for trends and Track for a single ticket lookup.`
      : "The dashboard shows recent complaints, category trends, and response metrics. Create a report first if you want to see demo ticket data there.";
  }

  if (/(thanks|thank you)/.test(q)) {
    return "You are welcome. Ask another question if you want help with the report flow or ticket details.";
  }

  return contextSummary
    ? `I do not have a precise answer for that yet, but I can still help with this report. ${contextSummary} You can ask about reporting steps, routing, verification, or ticket tracking.`
    : "I do not have a precise answer for that yet, but I can help with reporting steps, issue categories, routing departments, verification, ETA, and ticket tracking.";
}

async function askOpenAI({ question, history, ticket, ticketId, context }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const input = [
    ...(history ?? []).map((message) => ({
      role: message.role,
      content: [{ type: "input_text", text: message.text }]
    })),
    {
      role: "user",
      content: [{ type: "input_text", text: question }]
    }
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: buildRuntimeContext({ ticket, ticketId, context }),
      input
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `OpenAI request failed with ${response.status}`);
  }

  const payload = await response.json();
  return extractResponseText(payload);
}

export const assistantController = {
  async ask({ question, ticketId, history, context }) {
    const ticket = ticketId ? await store.getTicket(ticketId) : null;

    try {
      const answer = await askOpenAI({ question, history, ticket, ticketId, context });
      if (answer) {
        return { answer };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Assistant fallback:", error);
    }

    return {
      answer: await fallbackAnswer({ question, ticket, ticketId, context })
    };
  }
};
