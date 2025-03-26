import { Router } from "express";
import { z } from "zod";
import createHttpError from "http-errors";

import { registerUser } from "../services/user";
import { User } from "../models/user";
import { validateSchema } from "../utils/validate-schema";

import { debugApiServer } from "../constants";
import { RegisterUserData } from "../types/api/users";

const registerUserSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    password: z.string().trim().min(8).max(16),
  })
  .strict();

export const registerRouter = Router();

registerRouter.post(
  "/",
  async (req, _, next) => {
    try {
      await validateSchema(registerUserSchema, req.body);
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        throw createHttpError(400, {message: "'email': Invalid email"});
      }
    } catch (e) {
      next(e);
    }

    next();
  },
  async (req, res, next) => {
    const registerUserData = req.body as RegisterUserData;

    try {
      const user = await registerUser(registerUserData);
      debugApiServer(`Registered new user: ${JSON.stringify(user, null, 2)}`);

      const message = "Registration successful";
      res.statusCode = 201;
      res.json({ message, user });
    } catch (e) {
      next(e);
    }
  }
);
