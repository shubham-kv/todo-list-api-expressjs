import supertest from "supertest";
import { beforeAll, describe, expect, test } from "vitest";
import assert from "assert";

import app from "../../src/app";
import { LoginData } from "../../src/types/api/auth";

import { setupDatabase } from "../setup";
import { loginStub, registerUserStub } from "../stubs";
import { invalidLoginData } from "../data";
import { loginApiPath, registerUserApiPath } from "../constants";

const request = supertest(app);

describe("Authentication e2e", () => {
  setupDatabase();

  describe(`Login API ${loginApiPath}`, () => {
    describe("given no user registration & invalid input", () => {
      describe.each(invalidLoginData)(
        `when 'POST ${loginApiPath}' request is made with email=$email, password=$password`,
        (invalidLoginData) => {
          let response: supertest.Response;

          beforeAll(async () => {
            response = await request.post(loginApiPath).send(invalidLoginData);
          });

          test("should fail", () => {
            expect(response.statusCode).toBe(400);
          });

          test("should return error response", () => {
            expect(response.body).toMatchObject({
              error: { message: expect.any(String) },
            });
          });
        }
      );
    });

    describe("given user has registered", () => {
      beforeAll(async () => {
        const response = await request
          .post(registerUserApiPath)
          .send(registerUserStub());

        assert(
          response.statusCode >= 200 && response.statusCode <= 299,
          "Failed to register the test user."
        );
      });

      describe(`when 'POST ${loginApiPath}' request is made with invalid credentials`, () => {
        let response: supertest.Response;

        beforeAll(async () => {
          const requestBody: LoginData = {
            email: loginStub().email,
            password: "wrong_password",
          };
          response = await request.post(loginApiPath).send(requestBody);
        });

        test("should fail", () => {
          expect(response.statusCode).toBe(400);
        });

        test("should return error response", () => {
          expect(response.body).toMatchObject({
            error: { message: expect.any(String) },
          });
        });
      });

      describe(`when 'POST ${loginApiPath}' request is made with valid credentials`, () => {
        let requestBody: LoginData;
        let response: supertest.Response;

        beforeAll(async () => {
          requestBody = loginStub();
          response = await request.post(loginApiPath).send(requestBody);
        });

        test("should succeed", () => {
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
});
