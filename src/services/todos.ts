import createHttpError from "http-errors";
import assert from "assert";
import { Types } from "mongoose";

import { Todo } from "../models";
import {
  CreateTodoInput,
  CreateTodoResponse,
  GetTodosQuery,
  GetTodosResponse,
  TodoType,
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

export async function getTodos(
  query: GetTodosQuery,
  userId: string
): Promise<GetTodosResponse> {
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const aggregateResult = await Todo.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    { $sort: { createdAt: 1 } },
    {
      $project: {
        title: 1,
        description: 1,
        isDone: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        metadata: [{ $count: "total" }],
      },
    },
  ]);

  const data: Omit<TodoType, "user">[] = (aggregateResult[0]?.data ?? []).map(
    (r: any) => ({
      id: r._id,
      ...r,
      _id: undefined,
    })
  );

  return {
    data,
    page: query.page,
    limit: query.limit,
    total: aggregateResult[0]?.metadata[0]?.total ?? 0,
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

export async function deleteTodo(todoId: string): Promise<void> {
  const todo = await Todo.findByIdAndDelete(todoId);
  assert(todo !== null, `Todo with id '${todoId}' was not found`);
}
