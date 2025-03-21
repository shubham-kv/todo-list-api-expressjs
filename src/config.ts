import { RequestHandler } from "express";
import { apiV1Prefix, registerUserSymbol } from "./constants";
import { registerRouter } from "./routes";

type RouteConfig = {
  key: symbol;
  path: string;
  handlers: RequestHandler[];
};

export const routesConfig: RouteConfig[] = [
  {
    key: registerUserSymbol,
    path: `${apiV1Prefix}/register`,
    handlers: [registerRouter],
  },
];
