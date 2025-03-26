import { Router } from "express";
import { z } from "zod";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

import { User } from "../models/user";
import { validateSchema } from "../utils/validate-schema";
import { LoginData } from "../types/api/auth";
import { login } from "../services/auth";

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().trim().min(8).max(16),
  })
  .strict();

const authRouter = Router();

authRouter.post(
  "/login",
  async (req, _, next) => {
    try {
      const loginData: LoginData = req.body;
      await validateSchema(loginSchema, loginData);

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw createHttpError(400, { message: "Invalid credentials" });
      }

      const passwordValid = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (!passwordValid) {
        throw createHttpError(400, { message: "Invalid credentials" });
      }

      req.user = user;
    } catch (e) {
      next(e);
    }

    next();
  },
  async (req, res, next) => {
    try {
      const data = await login(req.user!);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
);

export { authRouter };
