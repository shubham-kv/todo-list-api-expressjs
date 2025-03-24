import { Todo } from "../models";
import { CreateTodoInput, CreateTodoResponse } from "../types/api/todo";

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
