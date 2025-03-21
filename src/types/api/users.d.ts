import { Entity } from "./misc";

export type TUser = {
  name: string;
  email: string;
  password: string;
} & Entity;

export type RegisterUserData = Pick<TUser, "name" | "email" | "password">;
export type RegisterUserResponse = Omit<TUser, 'password'>;
