import { Router } from "express";
import { authRouter } from "./auth.js";
import { reportsRouter } from "./reports.js";
import { ticketsRouter } from "./tickets.js";
import { adminRouter } from "./admin.js";
import { assistantRouter } from "./assistant.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/reports", reportsRouter);
router.use("/tickets", ticketsRouter);
router.use("/admin", adminRouter);
router.use("/assistant", assistantRouter);

