import { RegisterUserData } from "../src/types/api/users";
import { LoginData } from "../src/types/api/auth";
import { CreateTodoInput } from "../src/types/api/todo";

export const registerUserStub = (): RegisterUserData => ({
  name: "John Doe",
  email: "john.doe@example.com",
  password: "John@123",
});

export const loginStub = (): LoginData => ({
  email: "john.doe@example.com",
  password: "John@123",
});

export const createTodoInputStub = (): CreateTodoInput => ({
  title: 'Write tests',
  description: 'Write e2e tests for all APIs'
})
