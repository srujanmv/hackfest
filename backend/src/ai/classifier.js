const categories = [
  "Pothole",
  "Water leak",
  "Power outage",
  "Streetlight broken",
  "Road damage",
  "Garbage overflow"
];

function normalize(s) {
  return (s ?? "").toLowerCase();
}

export function classifyIssue(transcript) {
  const t = normalize(transcript);
  if (/(pothole|potholes|crater|hole in road)/.test(t)) return "Pothole";
  if (/(water leak|leakage|pipe burst|burst pipe|overflowing water)/.test(t))
    return "Water leak";
  if (/(power outage|no electricity|blackout|power cut)/.test(t)) return "Power outage";
  if (/(streetlight|street light|lamp post|light not working)/.test(t))
    return "Streetlight broken";
  if (/(road damage|broken road|cracked road|damaged road|sinkhole)/.test(t))
    return "Road damage";
  if (/(garbage|trash|overflow|dump|waste)/.test(t)) return "Garbage overflow";
  return "Unknown";
}

export function estimateSeverity(transcript, issueType) {
  const t = normalize(transcript);
  if (/(accident|danger|emergency|hospital|school|bus stand|highway)/.test(t)) return "critical";
  if (issueType === "Power outage") return "critical";
  if (issueType === "Water leak") return "moderate";
  return "moderate";
}

export function routeDepartment(issueType) {
  if (issueType === "Pothole" || issueType === "Road damage") return "Road Maintenance";
  if (issueType === "Water leak") return "Water Supply";
  if (issueType === "Power outage") return "Electricity";
  if (issueType === "Streetlight broken") return "Electrical Maintenance";
  if (issueType === "Garbage overflow") return "Sanitation";
  return "Municipal Helpline";
}

export function isKnownCategory(issueType) {
  return categories.includes(issueType);
}

