import { store } from "../services/store.js";
import { ticketsController } from "./ticketsController.js";

function hoursBetween(a, b) {
  return Math.max(0.1, (b - a) / (1000 * 60 * 60));
}

export const adminController = {
  async dashboard() {
    const tickets = await ticketsController.list();

    const active = tickets.filter((t) => t.status !== "Resolved").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const departmentsResponding = new Set(tickets.map((t) => t.departmentAssigned)).size;
    const avgResponseHours =
      tickets.length === 0
        ? 0
        : tickets
            .map((t) => hoursBetween(new Date(t.timestamp).getTime(), Date.now()))
            .reduce((a, b) => a + b, 0) / tickets.length;

    const byCat = new Map();
    for (const t of tickets) byCat.set(t.issueType, (byCat.get(t.issueType) ?? 0) + 1);
    const issuesByCategory = [...byCat.entries()].map(([name, value]) => ({ name, value }));

    const daily = new Map();
    for (const t of tickets) {
      const d = new Date(t.timestamp);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      daily.set(key, (daily.get(key) ?? 0) + 1);
    }
    const dailyTrends = [...daily.entries()]
      .slice(0, 14)
      .map(([day, count]) => ({ day, count }));

    const dept = new Map();
    for (const t of tickets) {
      const h = hoursBetween(new Date(t.timestamp).getTime(), Date.now());
      const prev = dept.get(t.departmentAssigned) ?? [];
      prev.push(h);
      dept.set(t.departmentAssigned, prev);
    }
    const deptResponseTimes = [...dept.entries()].map(([department, hoursArr]) => ({
      department,
      hours:
        hoursArr.reduce((a, b) => a + b, 0) / Math.max(1, hoursArr.length)
    }));

    const recent = tickets.slice(0, 12);

    return {
      totals: {
        active,
        resolved,
        avgResponseHours: Number(avgResponseHours.toFixed(2)),
        departmentsResponding
      },
      issuesByCategory,
      dailyTrends,
      deptResponseTimes,
      recent
    };
  }
};

