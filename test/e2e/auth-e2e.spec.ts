import supertest from "supertest";
import { beforeAll, describe, expect, test } from "vitest";

import app from "../../src/app";
import { LoginData } from "../../src/types/api/auth";

import { setupDatabase } from "../setup";
import { loginStub } from "../stubs";
import { invalidLoginData } from "../data";
import { loginApiPath } from "../constants";

const request = supertest(app);

describe("Authentication e2e", () => {
  const loginRequestLine = `POST ${loginApiPath}`;

  setupDatabase(true);

  describe(`Login API '${loginRequestLine}'`, () => {
    describe.each(invalidLoginData)(
      `when requested with invalid data, email=$email, password=$password`,
      (invalidLoginData) => {
        let response: supertest.Response;

        beforeAll(async () => {
          response = await request.post(loginApiPath).send(invalidLoginData);
        });

        test("should respond with '400 Bad Request'", () => {
          expect(response.statusCode).toBe(400);
        });

        test("should return error response", () => {
          expect(response.body).toMatchObject({
            error: { message: expect.any(String) },
          });
        });
      }
    );

    describe(`when requested with invalid credentials`, () => {
      let response: supertest.Response;

      beforeAll(async () => {
        const requestBody: LoginData = {
          email: loginStub().email,
          password: "wrong_password",
        };
        response = await request.post(loginApiPath).send(requestBody);
      });

      test("should respond with '400 Bad Request'", () => {
        expect(response.statusCode).toBe(400);
      });

      test("should return error response", () => {
        expect(response.body).toMatchObject({
          error: { message: expect.any(String) },
        });
      });
    });

    describe(`when requested with valid credentials`, () => {
      let requestBody: LoginData;
      let response: supertest.Response;

      beforeAll(async () => {
        requestBody = loginStub();
        response = await request.post(loginApiPath).send(requestBody);
      });

      test("should respond with '200 OK'", () => {
        expect(response.statusCode).toBe(200);
      });

      test("should authorize & return success response", () => {
        expect(response.body).toMatchObject({
          message: expect.stringMatching(/success/i),
          token: expect.any(String),
        });
      });
    });
  });
});
