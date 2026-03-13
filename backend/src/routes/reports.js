import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { reportsController } from "../controllers/reportsController.js";
import { ensureUploadDir } from "../services/uploads.js";

export const reportsRouter = Router();

const uploadDir = ensureUploadDir();
const maxMb = Number(process.env.MAX_UPLOAD_MB || 8);

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: maxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Only image uploads allowed"), ok);
  }
});

reportsRouter.post("/start", async (req, res) => {
  const body = z
    .object({
      transcript: z.string().min(6).max(800),
      lat: z.number().optional(),
      lng: z.number().optional(),
      locationText: z.string().min(2).max(120).optional(),
      phone: z.string().optional(),
      otp: z.string().optional()
    })
    .safeParse(req.body);
  if (!body.success) return res.status(400).send("Invalid request");
  const out = await reportsController.start(body.data);
  return res.json(out);
});

reportsRouter.post("/:reportId/verify-image", upload.single("image"), async (req, res) => {
  const { reportId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).send("Missing image");
  const out = await reportsController.verifyImage({ reportId, file });
  return res.json(out);
});

reportsRouter.post("/:reportId/create-ticket", async (req, res) => {
  const { reportId } = req.params;
  const out = await reportsController.createTicket({ reportId });
  if (!out) return res.status(404).send("Report not found");
  return res.json(out);
});

