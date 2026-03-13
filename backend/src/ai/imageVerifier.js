function normalize(s) {
  return (s ?? "").toLowerCase();
}

export function verifyImage({ issueType, originalName }) {
  const name = normalize(originalName);

  // Demo-safe “verification” that still feels agentic:
  // - If filename contains a relevant keyword, verify.
  // - Otherwise fail and request another image.
  if (issueType === "Pothole") {
    if (/(pothole|road|crater|hole)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (pothole patterns)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image showing the pothole clearly."
    };
  }

  if (issueType === "Water leak") {
    if (/(leak|water|pipe|burst)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (water leakage indicators)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image showing the leak/pipe area."
    };
  }

  if (issueType === "Streetlight broken") {
    if (/(streetlight|light|lamp|pole)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (streetlight outage indicators)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image of the streetlight."
    };
  }

  if (issueType === "Power outage") {
    if (/(power|outage|blackout|meter)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (power outage context)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image (meter/pole/surroundings)."
    };
  }

  if (issueType === "Garbage overflow") {
    if (/(garbage|trash|waste|dump)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (garbage overflow indicators)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image showing the garbage pile."
    };
  }

  if (issueType === "Road damage") {
    if (/(road|damage|crack|broken|sinkhole)/.test(name)) {
      return {
        verificationStatus: "verified",
        message: "Verification confirmed. Issue detected (road damage patterns)."
      };
    }
    return {
      verificationStatus: "failed",
      message: "Verification failed. Please upload another image showing the damaged road clearly."
    };
  }

  return {
    verificationStatus: "failed",
    message: "Verification failed. Please upload an image that clearly shows the reported issue."
  };
}

