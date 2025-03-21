import supertest from "supertest";
import { beforeAll, describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";

import { setupDatabase } from "./setup";

import app from "../src/app";
import { User } from "../src/models/user";
import { apiV1Prefix } from "../src/constants";
import { RegisterUserData } from "../src/types/api/users";

const request = supertest(app);
const registerUserApiPath = `${apiV1Prefix}/register`;

const registerUserStub = (): RegisterUserData => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
});

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
