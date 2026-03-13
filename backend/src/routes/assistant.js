import { Router } from "express";
import { z } from "zod";
import { assistantController } from "../controllers/assistantController.js";

export const assistantRouter = Router();

assistantRouter.post("/ask", async (req, res) => {
  const body = z
    .object({
      question: z.string().min(2).max(500),
      ticketId: z.string().optional()
    })
    .safeParse(req.body);
  if (!body.success) return res.status(400).send("Invalid request");
  const out = await assistantController.ask(body.data);
  return res.json(out);
});

