import { Router } from "express";
import { z } from "zod";
import createHttpError from "http-errors";

import { authenticate, todoExistsAndIsAccessible } from "../middlewares";
import { createTodo, updateTodo } from "../services/todos";

import { isMongoId, validateSchema } from "../utils";
import { debugApiServer } from "../constants";
import { CreateTodoInput, UpdateTodoInput } from "../types/api/todo";

const todosRouter = Router();

const titleSchema = z.string().trim().min(1).max(64);
const descriptionSchema = z.string().trim().min(1).max(512);
const isDoneSchema = z.boolean();

const createTodoSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
  })
  .strict();

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

const updateTodoSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    isDone: isDoneSchema.optional(),
  })
  .strict();

todosRouter.put(
  "/:id",
  async (req, _, next) => {
    if (!isMongoId(req.params.id)) {
      const e = createHttpError(
        400,
        "Invalid value passed for request path parameter 'id'"
      );
      next(e);
      return;
    }
    next();
  },
  authenticate,
  todoExistsAndIsAccessible,
  async (req, _, next) => {
    try {
      await validateSchema(updateTodoSchema, req.body);
    } catch (e) {
      next(e);
    }
    next();
  },
  async (req, res, next) => {
    const todoId = req.params.id;
    const updateInput = req.body as UpdateTodoInput;

    try {
      const response = await updateTodo(todoId, updateInput);
      debugApiServer(`Updated todo: ${JSON.stringify(response.todo, null, 2)}`);

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
);

export { todosRouter };
