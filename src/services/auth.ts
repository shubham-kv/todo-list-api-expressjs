import jwt, { JwtPayload } from "jsonwebtoken";
import { TUser } from "../types/api/users";
import { LoginResponse } from "../types/api/auth";
import { loginTokenConfig } from "../config/login-token";

export async function login(user: TUser): Promise<LoginResponse> {
  const payload: JwtPayload = { sub: user.id };
  const { secret, expiresIn } = loginTokenConfig;

  // @ts-ignore
  const token = jwt.sign(payload, secret, { expiresIn });

  return {
    message: "Login Successful",
    token: token,
  };
}
