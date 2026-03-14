import { Router } from "express";
import { z } from "zod";
import { assistantController } from "../controllers/assistantController.js";

export const assistantRouter = Router();

assistantRouter.post("/ask", async (req, res) => {
  const body = z
    .object({
      question: z.string().min(2).max(2000),
      ticketId: z.string().optional(),
      history: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            text: z.string().min(1).max(2000)
          })
        )
        .max(12)
        .optional(),
      context: z
        .object({
          issueType: z.string().optional(),
          department: z.string().optional(),
          locationText: z.string().optional()
        })
        .optional()
    })
    .safeParse(req.body);
  if (!body.success) return res.status(400).send("Invalid request");
  const out = await assistantController.ask(body.data);
  return res.json(out);
});

