import supertest from "supertest";
import { beforeEach, describe, expect, test } from "vitest";

import app from "../src/app";
import { setupDatabase } from "./setup";

const request = supertest(app);

describe("API e2e", () => {
  setupDatabase();

  describe("GET /", () => {
    describe("when 'GET /' request is made", () => {
      let response: supertest.Response;

      beforeEach(async () => {
        response = await request.get("/");
      });

      test("should return correct response", () => {
        expect(response.body.message).toMatch(/hello world/i);
      });
    });
  });
});
