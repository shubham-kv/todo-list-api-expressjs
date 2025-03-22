import { RegisterUserData } from "../src/types/api/users";
import { LoginData } from "../src/types/api/auth";

export const registerUserStub = (): RegisterUserData => ({
  name: "John Doe",
  email: "john.doe@example.com",
  password: "John@123",
});

export const loginStub = (): LoginData => ({
  email: "john.doe@example.com",
  password: "John@123",
});
