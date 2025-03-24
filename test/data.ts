import { LoginData } from "../src/types/api/auth";
import { CreateTodoInput } from "../src/types/api/todo";

export const invalidLoginData: LoginData[] = [
  { email: "12345##", password: "" },
  { email: "john", password: "" },
  { email: "john@example", password: "" },
  { email: "john@example.", password: "" },
  { email: "john@example.com", password: "" },
  { email: "john@example.com", password: "1234567890123456" },
];

export const invalidCreateTodoInputs: CreateTodoInput[] = [
  { title: "", description: "" },
  { title: "test", description: "" },
  {
    title: "A very long title with more than sixty four characters...........",
    description: "",
  },
  {
    title: "test",
    description:
      "A very very long description with more than 512 characters ......................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
  },
];

export const invalidAuthHeaders = [
  { authorization: "" },
  { authorization: "Bearer " },
  { authorization: "Bearer INVALID_TOKEN" },
];
