import mongoose from "mongoose";
import { afterAll, beforeAll } from "vitest";
import { initiateDbConnection, terminateDbConnection } from "../src/utils/db";

async function clearDatabase() {
  const { connection } = mongoose;
  const collections = Object.values(connection.collections);

  for (const collection of collections) {
    await collection.drop();
  }
}

export function setupDatabase() {
  beforeAll(async () => {
    await initiateDbConnection();
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await terminateDbConnection();
  });
}
