import createHttpError from "http-errors";
import assert from "assert";

import { Todo } from "../models";
import {
  CreateTodoInput,
  CreateTodoResponse,
  DeleteTodoResponse,
  UpdateTodoInput,
} from "../types/api/todo";

export async function createTodo(
  userId: string,
  input: CreateTodoInput
): Promise<CreateTodoResponse> {
  const todo = new Todo({ ...input, user: userId });
  const { id, title, description, isDone, createdAt, updatedAt } =
    await todo.save();

  return {
    message: "Success",
    todo: { id, title, description, isDone, createdAt, updatedAt },
  };
}

export async function updateTodo(
  todoId: string,
  input: UpdateTodoInput
): Promise<CreateTodoResponse> {
  const todo = await Todo.findByIdAndUpdate(
    todoId,
    { $set: input },
    { new: true }
  );

  if (!todo) {
    throw createHttpError(404);
  }

  const { id, title, description, isDone, createdAt, updatedAt } = todo;

  return {
    message: "Updated Successfully",
    todo: { id, title, description, isDone, createdAt, updatedAt },
  };
}

export async function deleteTodo(todoId: string): Promise<DeleteTodoResponse> {
  const todo = await Todo.findByIdAndDelete(todoId);
  assert(todo !== null, `Todo with id '${todoId}' was not found`);

  const { id, title, description, isDone, createdAt, updatedAt } = todo;

  return {
    message: "Deleted Successfully",
    todo: { id, title, description, isDone, createdAt, updatedAt },
  };
}
