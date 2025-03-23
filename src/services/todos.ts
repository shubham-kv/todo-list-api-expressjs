import { Todo } from "../models";
import { CreateTodoInput, CreateTodoResponse } from "../types/api/todo";
import { TUser } from "../types/api/users";

export async function createTodo(
  input: CreateTodoInput,
  user: TUser
): Promise<CreateTodoResponse> {
  const todo = new Todo({ ...input, user: user.id });
  const { id, title, description, isDone, createdAt, updatedAt } =
    await todo.save();

  return {
    message: "Success",
    todo: { id, title, description, isDone, createdAt, updatedAt },
  };
}
