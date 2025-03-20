import { User } from "../models/user";
import { RegisterUserData, RegisterUserResponse } from "../types/api/users";

export async function registerUser(
  data: RegisterUserData
): Promise<RegisterUserResponse> {
  const userDocument = new User(data);
  const { id, name, email, createdAt, updatedAt } = await userDocument.save();

  return {
    id,
    name,
    email,
    createdAt,
    updatedAt,
  };
}
