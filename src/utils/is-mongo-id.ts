import { Types } from "mongoose";

export const isMongoId = (value: string) => {
  return Types.ObjectId.isValid(value);
};
