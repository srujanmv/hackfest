import fs from "fs";
import path from "path";

export function ensureUploadDir() {
  const dirName = process.env.UPLOAD_DIR || "uploads";
  const full = path.join(process.cwd(), dirName);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  return full;
}

