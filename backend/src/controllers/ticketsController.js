import { store } from "../services/store.js";

export const ticketsController = {
  async list() {
    const rows = await store.listTickets();
    if (rows.length) return rows;
    return seed();
  },
  async get(id) {
    const t = await store.getTicket(id);
    if (t) return t;
    const seeded = seed();
    return seeded.find((x) => x.id === id) ?? null;
  }
};

function seed() {
  const now = Date.now();
  return [
    {
      id: "URB-2045",
      issueType: "Pothole",
      description: "There is a pothole near the temple road.",
      locationText: "Village Road near temple",
      lat: 26.9124,
      lng: 75.7873,
      timestamp: new Date(now - 1000 * 60 * 50).toISOString(),
      verificationStatus: "verified",
      departmentAssigned: "Road Maintenance",
      status: "In Progress",
      severity: "critical",
      imageUrl: undefined
    },
    {
      id: "URB-2101",
      issueType: "Streetlight broken",
      description: "Street light is not working near bus stand.",
      locationText: "Bus Stand junction",
      lat: 26.9224,
      lng: 75.7973,
      timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
      verificationStatus: "verified",
      departmentAssigned: "Electrical Maintenance",
      status: "Assigned",
      severity: "moderate",
      imageUrl: undefined
    },
    {
      id: "URB-1988",
      issueType: "Garbage overflow",
      description: "Garbage overflow near market entrance.",
      locationText: "Main market",
      lat: 26.9054,
      lng: 75.7773,
      timestamp: new Date(now - 1000 * 60 * 320).toISOString(),
      verificationStatus: "verified",
      departmentAssigned: "Sanitation",
      status: "Resolved",
      severity: "low",
      imageUrl: undefined
    }
  ];
}

