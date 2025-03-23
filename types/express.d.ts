import { TUser } from "../src/types/api/users";

declare module "express-serve-static-core" {
  interface Request {
    user?: TUser;
  }
}
