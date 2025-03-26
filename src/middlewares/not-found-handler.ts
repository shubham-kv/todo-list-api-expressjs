import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const notFoundHandler: RequestHandler = (req, _, next) => {
  next(createHttpError(404, `Cannot ${req.method} ${req.path}`));
};
