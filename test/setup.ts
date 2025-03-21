import { afterAll, beforeAll } from "vitest";
import { initiateDbConnection, terminateDbConnection } from "../src/utils/db";

export function setupDatabase() {
  beforeAll(initiateDbConnection);
  afterAll(terminateDbConnection);
}
