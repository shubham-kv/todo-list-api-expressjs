import { ErrorRequestHandler } from "express";
import httpErrors from "http-errors";
import { debugApiServer } from "../constants";

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const isHttpError = httpErrors.isHttpError(err);
  const statusCode = isHttpError ? err.statusCode : 500;
  const error = isHttpError ? err : "Something went wrong!";

  if (!isHttpError) {
    debugApiServer("Failed with the following error");
    console.error(err);
  }

  res.status(statusCode).json({ error });
  next();
};
