import { TUser } from "./users";
import { SuccessResponse } from "./misc";

export type LoginData = Pick<TUser, "email" | "password">;
export type LoginResponse = SuccessResponse<{ token: string }>;
