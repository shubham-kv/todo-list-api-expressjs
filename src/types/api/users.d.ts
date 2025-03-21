import { Auth } from "./auth";
import { Entity } from "./entity";

export type User = {
  name: string;
  email: string;
  password: string;
} & Entity;

export type RegisterUserData = Pick<User, "name" | "email" | "password">;
export type RegisterUserResponse = Omit<User, 'password'>;
