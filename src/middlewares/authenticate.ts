import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models";
import { loginTokenConfig } from "../config/login-token";

/**
 * Middleware that authenticates the request based on the jwt passed in
 * request's `authorization` header using `Bearer token` authentication scheme.
 * Set's the `request.user` property to the authenticated user. Responds with
 * `401 Unauthorized` status code for requests with invalid `authorization`
 * header.
 */
export const authenticate: RequestHandler = async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, "Authentication header is required, found none");
    }

    if(!/^Bearer [^\s]+$/.test(authHeader)) {
      throw createHttpError(401, "Authentication header must confirm to the Bearer token authorization scheme");
    }

    const token = authHeader.split(" ")[1];
    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, loginTokenConfig.secret, {
        ignoreExpiration: false,
      }) as JwtPayload;
    } catch (e) {
      throw createHttpError(401, "Invalid or expired token");
    }

    const userId = payload.sub as string;
    const user = await User.findById(userId);

    if (!user) {
      throw createHttpError(401, "Invalid or expired token");
    }

    req.user = user;
  } catch (e) {
    next(e);
  }
  next();
};
