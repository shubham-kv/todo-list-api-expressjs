import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { isMongoId } from "../utils";

/**
 * Validates whether the id passed in request url parameters in the form `:id`
 * is a valid mongodb id.
 */
export const idParamIsMongoId: RequestHandler = async (req, _, next) => {
  if (!isMongoId(req.params.id)) {
    const e = createHttpError(
      400,
      "Invalid value passed for request path parameter 'id'"
    );
    next(e);
    return;
  }
  next();
};
