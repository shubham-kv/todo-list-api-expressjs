import mongoose from "mongoose";
import { afterAll, beforeAll } from "vitest";

import { registerUser } from "../src/services/user";
import { createTodo } from "../src/services/todos";
import { initiateDbConnection, terminateDbConnection } from "../src/utils/db";
import { createTodoInputStub, registerUserStub } from "./stubs";

async function seedDatabase() {
  const testUser = await registerUser(registerUserStub());
  await createTodo(testUser.id, createTodoInputStub());
}

async function clearDatabase() {
  const { connection } = mongoose;
  const collections = Object.values(connection.collections);

  for (const collection of collections) {
    await collection.drop();
  }
}

export function setupDatabase(shouldSeed: boolean = false) {
  beforeAll(async () => {
    await initiateDbConnection();

    if (shouldSeed) {
      await seedDatabase();
    }
  });

  afterAll(async () => {
    await clearDatabase();
    await terminateDbConnection();
  });
}
