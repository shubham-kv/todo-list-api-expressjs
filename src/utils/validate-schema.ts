import { z, ZodError } from "zod";
import createHttpError from "http-errors";

export async function validateSchema(schema: z.Schema, value: any) {
  try {
    return await schema.parseAsync(value);
  } catch (e: any) {
    if (e instanceof ZodError) {
      const zodError = e.errors[0];

      const errorMessage = zodError
        ? `${zodError.path.length ? `'${zodError.path}': ` : ""}${
            zodError.message
          }`
        : e.message;

      throw createHttpError(400, errorMessage);
    }
    throw e;
  }
}
