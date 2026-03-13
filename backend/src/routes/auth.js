import { Router } from "express";
import { z } from "zod";
import { otpService } from "../services/otpService.js";

export const authRouter = Router();

authRouter.post("/request-otp", (req, res) => {
  const body = z
    .object({
      phone: z.string().min(6).max(20)
    })
    .safeParse(req.body);
  if (!body.success) return res.status(400).send("Invalid phone number");
  const devOtp = otpService.requestOtp(body.data.phone);
  return res.json({ ok: true, devOtp });
});

