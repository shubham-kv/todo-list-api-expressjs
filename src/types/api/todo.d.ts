import { Entity, SuccessResponse } from "./misc";

export type TodoType = {
  title: string;
  description: string;
  isDone: boolean;
  user: string | User;
} & Entity;

export type CreateTodoInput = Pick<TodoType, "title" | "description">;
export type CreateTodoResponse = SuccessResponse<{
  todo: Omit<TodoType, "user">;
}>;
