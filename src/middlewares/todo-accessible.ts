import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Todo } from "../models";
import { TUser } from "../types/api/users";

/**
 * Ensures that the accessed `Todo` exists and that the authenticated user is
 * the owner of the accessed `Todo`, responds with a `403 Forbidden` status code
 * otherwise. Requires `request.user` (the authenticated user) to be set.
 */
export const todoExistsAndIsAccessible: RequestHandler = async (
  req,
  _,
  next
) => {
  try {
    const todoId = req.params["id"];
    const todo = await Todo.findById(todoId).populate("user").exec();

    if (!todo) {
      throw createHttpError(404);
    }

    if ((todo.user as TUser).id !== req.user!.id) {
      throw createHttpError(403);
    }
  } catch (e) {
    next(e);
  }
  next();
};
