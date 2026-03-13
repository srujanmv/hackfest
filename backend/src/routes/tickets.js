import { Router } from "express";
import { ticketsController } from "../controllers/ticketsController.js";

export const ticketsRouter = Router();

ticketsRouter.get("/", async (_req, res) => {
  const tickets = await ticketsController.list();
  res.json({ tickets });
});

ticketsRouter.get("/:id", async (req, res) => {
  const t = await ticketsController.get(req.params.id);
  if (!t) return res.status(404).send("Ticket not found");
  return res.json({ ticket: t });
});

