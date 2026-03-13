import { Router } from "express";
import { adminController } from "../controllers/adminController.js";

export const adminRouter = Router();

adminRouter.get("/dashboard", async (_req, res) => {
  const out = await adminController.dashboard();
  res.json(out);
});

