import { beforeAll, describe, expect, test } from "vitest";
import supertest, { Response } from "supertest";
import assert from "assert";

import app from "../../src/app";
import { Todo } from "../../src/models";
import { LoginResponse } from "../../src/types/api/auth";
import { CreateTodoInput, CreateTodoResponse } from "../../src/types/api/todo";
import { TUser } from "../../src/types/api/users";

import { setupDatabase } from "../setup";
import { createTodoInputStub, loginStub, registerUserStub } from "../stubs";
import {
  createTodoApiPath,
  loginApiPath,
  registerUserApiPath,
} from "../constants";

const request = supertest(app);

describe("Todo APIs", () => {
  setupDatabase();

  describe(`Create Todo 'POST ${createTodoApiPath}'`, () => {
    describe("given user has registered & authorized", () => {
      let user: Omit<TUser, "password">;
      let jwt: string;

      beforeAll(async () => {
        const registerResponse = await request
          .post(registerUserApiPath)
          .send(registerUserStub());

        user = registerResponse.body.user;

        assert(
          registerResponse.statusCode >= 200 &&
            registerResponse.statusCode <= 299,
          "Failed to register the test user."
        );

        const loginResponse = await request
          .post(loginApiPath)
          .send(loginStub());

        assert(
          loginResponse.statusCode === 200,
          "Failed to authenticate the test user."
        );

        jwt = (loginResponse.body as LoginResponse).token;
      });

      const invalidCreateTodoInputs: CreateTodoInput[] = [
        { title: "", description: "" },
        { title: "test", description: "" },
        {
          title:
            "A very long title with more than sixty four characters...........",
          description: "",
        },
        {
          title: "test",
          description:
            "A very very long description with more than 512 characters ......................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
        },
      ];

      describe.each(invalidCreateTodoInputs)(
        `when 'POST ${createTodoApiPath}' request is made with invalid inputs`,
        (input) => {
          let response: Response;

          beforeAll(async () => {
            response = await request
              .post(createTodoApiPath)
              .set("Authorization", `Bearer ${jwt}`)
              .send(input);
          });

          test("should respond with Bad Request status code", () => {
            expect(response.statusCode).toBe(400);
          });

          test("should return error response", () => {
            expect(response.body).toMatchObject({
              error: {
                message: expect.any(String),
              },
            });
          });
        }
      );

      describe(`when 'POST ${createTodoApiPath}' request is made with valid input`, () => {
        let input: CreateTodoInput;
        let response: Response;
        let responseData: CreateTodoResponse;

        beforeAll(async () => {
          input = createTodoInputStub();

          response = await request
            .post(createTodoApiPath)
            .set("Authorization", `Bearer ${jwt}`)
            .send(input);

          responseData = response.body;
        });

        test("should respond with Created status code", () => {
          expect(response.statusCode).toBe(201);
        });

        test("should create todo for the authorized user", async () => {
          const createdTodoId = responseData.todo.id;
          const createdTodo = await Todo.findById(createdTodoId)
            .populate("user", "name")
            .exec();
          expect(createdTodo!.user.id).toBe(user.id);
        });

        test("should return success response", () => {
          expect(responseData).toMatchObject({
            message: expect.stringMatching(/success/i),
            todo: {
              id: expect.any(String),
              isDone: false,
              ...input,
            },
          });
        });
      });
    });

    describe("given invalid or no user authentication", () => {
      const invalidAuthHeaders = [
        { authorization: "" },
        { authorization: "Bearer " },
        { authorization: "Bearer INVALID_TOKEN" },
      ];

      describe.each(invalidAuthHeaders)(
        `when 'POST ${createTodoApiPath}' request is made with Authorization header set to $authorization`,
        ({ authorization: authHeader }) => {
          let response: Response;

          beforeAll(async () => {
            response = await request
              .post(createTodoApiPath)
              .send(createTodoInputStub())
              .set("Authorization", authHeader);
          });

          test("should respond with Unauthorized status code", () => {
            expect(response.statusCode).toBe(401);
          });

          test("should return error response", () => {
            expect(response.body).toMatchObject({
              error: {
                message: expect.any(String),
              },
            });
          });
        }
      );
    });
  });
});
