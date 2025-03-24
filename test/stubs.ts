import assert from "assert";
import { registerUserInputs } from "./data";

import { RegisterUserData } from "../src/types/api/users";
import { LoginData } from "../src/types/api/auth";
import { CreateTodoInput } from "../src/types/api/todo";

export const registerUserStub = (index = 0): RegisterUserData => {
  const minIndex = 0;
  const maxIndex = registerUserInputs.length - 1;
  assert(
    index >= 0 && index < registerUserInputs.length,
    `Index must be in range ${minIndex} - ${maxIndex}`
  );

  return {
    ...registerUserInputs[index],
  };
};

export const loginStub = (index = 0): LoginData => {
  const minIndex = 0;
  const maxIndex = registerUserInputs.length - 1;
  assert(
    index >= 0 && index < registerUserInputs.length,
    `Index must be in range ${minIndex} - ${maxIndex}`
  );

  const data = registerUserInputs[index];

  return {
    email: data.email,
    password: data.password,
  };
};

export const createTodoInputStub = (): CreateTodoInput => ({
  title: "Write tests",
  description: "Write e2e tests for all APIs",
});
