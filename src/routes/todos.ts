import { Router } from "express";
import { z } from "zod";

import {
  authenticate,
  idParamIsMongoId,
  todoExistsAndIsAccessible,
} from "../middlewares";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todos";

import { validateSchema } from "../utils";
import { debugApiServer } from "../constants";
import {
  CreateTodoInput,
  GetTodosQuery,
  UpdateTodoInput,
} from "../types/api/todo";

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

const getTodosQuerySchema = z
  .object({
    page: z
      .preprocess((val) => Number(val), z.number().min(1))
      .default(1)
      .optional(),
    limit: z
      .preprocess((val) => Number(val), z.number().min(1).max(50))
      .default(10)
      .optional(),
  })
  .strict();

todosRouter.get(
  "/",
  authenticate,
  async (req, _, next) => {
    try {
      req.query = await validateSchema(getTodosQuerySchema, req.query);
    } catch (e) {
      next(e);
    }
    next();
  },
  async (req, res, next) => {
    const query = req.query as unknown as GetTodosQuery

    try {
      const response = await getTodos(query, req.user!.id);
      res.status(200).json(response);
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
  idParamIsMongoId,
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

todosRouter.delete(
  "/:id",
  idParamIsMongoId,
  authenticate,
  todoExistsAndIsAccessible,
  async (req, res, next) => {
    const todoId = req.params.id;

    try {
      await deleteTodo(todoId);
      debugApiServer(`Deleted todo with id '${todoId}'`);

      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }
);

export { todosRouter };
