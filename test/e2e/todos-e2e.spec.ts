import { beforeAll, describe, expect, test } from "vitest";
import supertest, { Response } from "supertest";
import assert from "assert";

import app from "../../src/app";
import { Todo, User } from "../../src/models";
import { LoginResponse } from "../../src/types/api/auth";
import { CreateTodoInput, CreateTodoResponse } from "../../src/types/api/todo";
import { TUser } from "../../src/types/api/users";

import { setupDatabase } from "../setup";
import { createTodoInputStub, loginStub, registerUserStub } from "../stubs";
import { invalidAuthHeaders, invalidCreateTodoInputs } from "../data";
import { createTodoApiPath, loginApiPath } from "../constants";

const request = supertest(app);

describe("Todo APIs e2e", () => {
  let user: TUser;
  let jwt: string;

  setupDatabase(true);

  beforeAll(async () => {
    const email = registerUserStub().email;
    const registeredUser = await User.findOne({ email }).exec();
    assert(registeredUser !== null, "No registered user found");
    user = registeredUser;

    const response = await request.post(loginApiPath).send(loginStub());
    assert(response.statusCode === 200, "Failed to login test user");
    jwt = (response.body as LoginResponse).token;
  });

  describe(`Create Todo 'POST ${createTodoApiPath}'`, () => {
    describe("given user has registered & authorized", () => {
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
          expect((createdTodo!.user as TUser).id).toBe(user.id);
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
