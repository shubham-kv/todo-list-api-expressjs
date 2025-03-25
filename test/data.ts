import { LoginData } from "../src/types/api/auth";
import { CreateTodoInput, UpdateTodoInput } from "../src/types/api/todo";
import { RegisterUserData } from "../src/types/api/users";

export const registerUserInputs: RegisterUserData[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "John@123",
  },
  {
    name: "Test",
    email: "test@example.com",
    password: "Test@123",
  },
];

export const invalidLoginData: LoginData[] = [
  { email: "12345##", password: "" },
  { email: "john", password: "" },
  { email: "john@example", password: "" },
  { email: "john@example.", password: "" },
  { email: "john@example.com", password: "" },
  { email: "john@example.com", password: "1234567890123456" },
];

export const invalidAuthHeaders = [
  { authorization: "" },
  { authorization: "Bearer " },
  { authorization: "Bearer INVALID_TOKEN" },
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

type PathParams = { id: string };

export const invalidMongoIdPathParams: PathParams[] = [
  { id: "-1" },
  { id: "1" },
  { id: "12345678901234567890123" },
  { id: "1234567890123456789012345" },
];

type InvalidUpdateTodoData = {
  pathParams?: PathParams;
  updateInput?: UpdateTodoInput;
};

export const invalidUpdateTodoData: InvalidUpdateTodoData[] = [
  ...invalidMongoIdPathParams.map((v) => ({ pathParams: v })),
  { updateInput: { title: "" } },
  {
    updateInput: {
      title:
        "A very long title with more than sixty four characters...........",
    },
  },
  { updateInput: { description: "" } },
  {
    updateInput: {
      description:
        "A very very long description with more than 512 characters ......................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
    },
  },
];
