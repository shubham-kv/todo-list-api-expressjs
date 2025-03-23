import { Entity, SuccessResponse } from "./misc";
import { TUser } from "./users";

export type TodoType = {
  title: string;
  description: string;
  isDone: boolean;
  user: string | TUser;
} & Entity;

export type CreateTodoInput = Pick<TodoType, "title" | "description">;
export type CreateTodoResponse = SuccessResponse<{
  todo: Omit<TodoType, "user">;
}>;

export type UpdateTodoInput = Partial<Pick<
  TodoType,
  "title" | "description" | "isDone"
>>;
export type UpdateTodoResponse = SuccessResponse<{
  todo: Omit<TodoType, "user">;
}>;
