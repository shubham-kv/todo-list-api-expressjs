import { apiV1Prefix } from "../src/constants";

export const registerUserApiPath = `${apiV1Prefix}/register`;
export const loginApiPath = `${apiV1Prefix}/auth/login`;

export const createTodoApiPath = `${apiV1Prefix}/todos`;
export const updateTodoApiPath = `${apiV1Prefix}/todos/:id`;
export const deleteTodoApiPath = `${apiV1Prefix}/todos/:id`;
