import { Router } from "express";
import { z } from "zod";

import { authenticate } from "../middlewares";
import { createTodo } from "../services/todos";

import { validateSchema } from "../utils/validate-schema";
import { debugApiServer } from "../constants";
import { CreateTodoInput } from "../types/api/todo";

const createTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(64),
    description: z.string().trim().min(1).max(512),
  })
  .strict();

const todosRouter = Router();

todosRouter.post(
  "/",
  authenticate,
  async (req, _, next) => {
    try {
      await validateSchema(createTodoSchema, req.body);
    } catch (e) {
      next(e);
    }
    next();
  },
  async (req, res, next) => {
    const input = req.body as CreateTodoInput;
    const user = req.user!;

    try {
      const response = await createTodo(user.id, input);
      debugApiServer(`Created todo: ${JSON.stringify(response.todo, null, 2)}`);

      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }
);

export { todosRouter };
