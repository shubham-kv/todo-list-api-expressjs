import { Entity, PaginatedResponse, SuccessResponse } from "./misc";
import { TUser } from "./users";

export type TodoType = {
  title: string;
  description: string;
  isDone: boolean;
  user: string | TUser;
} & Entity;

type TodoResponse = SuccessResponse<{
  todo: Omit<TodoType, "user">;
}>;

export type CreateTodoInput = Pick<TodoType, "title" | "description">;
export type CreateTodoResponse = TodoResponse;

export type GetTodosQuery = {
  page: number;
  limit: number;
};

export type GetTodosResponse = PaginatedResponse<Omit<TodoType, "user">>;

export type UpdateTodoInput = Partial<
  Pick<TodoType, "title" | "description" | "isDone">
>;
export type UpdateTodoResponse = TodoResponse;
