import mongoose from "mongoose";

let connected = false;

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    connected = false;
    return { connected: false };
  }
  try {
    await mongoose.connect(uri, { dbName: "urban_incident_reporter" });
    connected = true;
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    return { connected: true };
  } catch (e) {
    connected = false;
    // eslint-disable-next-line no-console
    console.warn("MongoDB connection failed, using in-memory store");
    return { connected: false };
  }
}

export function isDbConnected() {
  return connected;
}

