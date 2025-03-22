import supertest from "supertest";
import { beforeAll, describe, expect, test } from "vitest";

import app from "../../src/app";
import { User } from "../../src/models/user";
import { RegisterUserData } from "../../src/types/api/users";

import { setupDatabase } from "../setup";
import { registerUserApiPath } from "../constants";
import { registerUserStub } from "../stubs";

const request = supertest(app);

describe("Registration e2e", () => {
  setupDatabase();

  describe(`when 'POST ${registerUserApiPath}' request is made`, () => {
    let requestBody: RegisterUserData;
    let response: supertest.Response;

    beforeAll(async () => {
      requestBody = registerUserStub();
      response = await request.post(registerUserApiPath).send(requestBody);
    });

    test("should succeed", () => {
      expect(response.statusCode).toBe(201);
    });

    test("registered user should exist in db", async () => {
      const user = await User.findOne({ email: requestBody.email });
      expect(user!.email).toBeDefined();
    });

    test("should return correct response", () => {
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/success/i),
        user: {
          id: expect.any(String),
          name: requestBody.name,
          email: requestBody.email,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
      });
    });
  });
});
