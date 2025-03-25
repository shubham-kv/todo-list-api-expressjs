import { beforeAll, describe, expect, test } from "vitest";
import supertest, { Response } from "supertest";
import assert from "assert";

import app from "../../src/app";
import { Todo, User } from "../../src/models";
import { LoginResponse } from "../../src/types/api/auth";
import {
  CreateTodoInput,
  CreateTodoResponse,
  UpdateTodoInput,
  UpdateTodoResponse,
} from "../../src/types/api/todo";
import { TUser } from "../../src/types/api/users";

import { setupDatabase } from "../setup";
import {
  createTodoInputStub,
  loginStub,
  registerUserStub,
  updateTodoInputStub,
} from "../stubs";
import {
  invalidAuthHeaders,
  invalidCreateTodoInputs,
  invalidMongoIdPathParams,
  invalidUpdateTodoData,
  registerUserInputs,
} from "../data";
import {
  createTodoApiPath,
  deleteTodoApiPath,
  loginApiPath,
  updateTodoApiPath,
} from "../constants";

const request = supertest(app);

describe("Todo APIs e2e", () => {
  const createTodoRequestLine = `POST ${createTodoApiPath}`;
  const updateTodoRequestLine = `PUT ${updateTodoApiPath}`;
  const deleteTodoRequestLine = `DELETE ${deleteTodoApiPath}`;

  let user: TUser;
  const tokens: string[] = [];
  const seededTodoIds: string[] = [];

  setupDatabase(true);

  beforeAll(async () => {
    const email = registerUserStub().email;
    const registeredUser = await User.findOne({ email }).exec();
    assert(registeredUser !== null, "No seeded registered user found");
    user = registeredUser;

    for (let i = 0; i < registerUserInputs.length; i++) {
      const response = await request.post(loginApiPath).send(loginStub(i));
      assert(response.statusCode === 200, "Failed to login test user");
      tokens.push((response.body as LoginResponse).token);
    }

    const seededTodos = await Todo.find().exec();
    seededTodos.map((todo) => {
      seededTodoIds.push(todo.id);
    });
  });

  describe(`Create Todo API '${createTodoRequestLine}'`, () => {
    describe.each(invalidAuthHeaders)(
      `when requested with invalid Authorization header set to $authorization`,
      ({ authorization: authHeader }) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .post(createTodoApiPath)
            .send(createTodoInputStub())
            .set("Authorization", authHeader);
        });

        test("should respond with '401 Unauthorized'", () => {
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

    describe.each(invalidCreateTodoInputs)(
      `when requested with invalid inputs`,
      (input) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .post(createTodoApiPath)
            .set("Authorization", `Bearer ${tokens[0]}`)
            .send(input);
        });

        test("should respond with '400 Bad Request'", () => {
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

    describe(`when requested with valid input`, () => {
      let input: CreateTodoInput;
      let response: Response;
      let responseData: CreateTodoResponse;

      beforeAll(async () => {
        input = createTodoInputStub();

        response = await request
          .post(createTodoApiPath)
          .set("Authorization", `Bearer ${tokens[0]}`)
          .send(input);

        responseData = response.body;
      });

      test("should respond with '201 Created'", () => {
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

  describe(`Update Todo API '${updateTodoRequestLine}`, () => {
    describe.each(invalidAuthHeaders)(
      `when requested with invalid Authorization header set to $authorization`,
      ({ authorization: authHeader }) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .put(updateTodoApiPath.replace(":id", seededTodoIds[0]))
            .send(updateTodoInputStub())
            .set("Authorization", authHeader);
        });

        test("should respond with '401 Unauthorized'", () => {
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

    describe.each(invalidUpdateTodoData)(
      `when requested with invalid inputs`,
      ({ pathParams, updateInput }) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .put(
              updateTodoApiPath.replace(
                ":id",
                pathParams?.id ?? seededTodoIds[0]
              )
            )
            .set("Authorization", `Bearer ${tokens[0]}`)
            .send(updateInput);
        });

        test("should respond with '400 Bad Request'", () => {
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

    describe("when accessing a non-existing resource", () => {
      let response: Response;

      beforeAll(async () => {
        response = await request
          .put(updateTodoApiPath.replace(":id", "aaaaaaaaaaaaaaaaaaaaaaaa"))
          .set("Authorization", `Bearer ${tokens[0]}`)
          .send(updateTodoInputStub());
      });

      test("should respond with '404 Not Found'", () => {
        expect(response.statusCode).toBe(404);
      });

      test("should return error response", () => {
        expect(response.body).toMatchObject({
          error: {
            message: expect.stringMatching(/not found/i),
          },
        });
      });
    });

    describe("when accessing a forbidden resource", () => {
      let response: Response;

      beforeAll(async () => {
        response = await request
          .put(updateTodoApiPath.replace(":id", seededTodoIds[1]))
          .set("Authorization", `Bearer ${tokens[0]}`)
          .send(updateTodoInputStub());
      });

      test("should respond with '403 Forbidden'", () => {
        expect(response.statusCode).toBe(403);
      });

      test("should return error response", () => {
        expect(response.body).toMatchObject({
          error: {
            message: expect.stringMatching(/forbidden/i),
          },
        });
      });
    });

    describe(`when requested with valid input`, () => {
      let input: UpdateTodoInput;
      let response: Response;
      let responseData: UpdateTodoResponse;

      beforeAll(async () => {
        input = updateTodoInputStub();

        response = await request
          .put(updateTodoApiPath.replace(":id", seededTodoIds[0]))
          .set("Authorization", `Bearer ${tokens[0]}`)
          .send(input);

        responseData = response.body;
      });

      test("should respond with '200 OK'", () => {
        expect(response.statusCode).toBe(200);
      });

      test("should update todo for the authorized user", async () => {
        const todo = await Todo.findById(responseData.todo.id).exec();
        expect(todo).toMatchObject({ ...input });
      });

      test("should return success response", () => {
        expect(responseData).toMatchObject({
          message: expect.stringMatching(/success/i),
          todo: {
            id: expect.any(String),
            ...input,
          },
        });
      });
    });
  });

  describe(`Delete Todo API '${deleteTodoRequestLine}'`, () => {
    describe.each(invalidMongoIdPathParams)(
      "when requested with invalid id, `:id` = $id",
      (config) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .delete(deleteTodoApiPath.replace(":id", config.id))
            .set("Authorization", `Bearer ${tokens[0]}`);
        });

        test("should respond with '400 Bad Request'", () => {
          expect(response.statusCode).toBe(400);
        });

        test("should return error response", () => {
          expect(response.body).toMatchObject({
            error: {
              message: expect.stringMatching(/invalid/i),
            },
          });
        });
      }
    );

    describe.each(invalidAuthHeaders)(
      `when requested with invalid header, authorization = $authorization`,
      ({ authorization }) => {
        let response: Response;

        beforeAll(async () => {
          response = await request
            .delete(deleteTodoApiPath.replace(":id", seededTodoIds[0]))
            .set("Authorization", authorization);
        });

        test("should respond with '401 Unauthorized'", () => {
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

    describe("when requested for a non existing resource", () => {
      let response: Response;

      beforeAll(async () => {
        response = await request
          .delete(deleteTodoApiPath.replace(":id", "aaaaaaaaaaaaaaaaaaaaaaaa"))
          .set("Authorization", `Bearer ${tokens[0]}`);
      });

      test("should respond with '404 Not Found'", () => {
        expect(response.statusCode).toBe(404);
      });

      test("should return error response", () => {
        expect(response.body).toMatchObject({
          error: {
            message: expect.stringMatching(/not found/i),
          },
        });
      });
    });

    describe("when requested for a forbidden resource", () => {
      let response: Response;

      beforeAll(async () => {
        response = await request
          .delete(deleteTodoApiPath.replace(":id", seededTodoIds[1]))
          .set("Authorization", `Bearer ${tokens[0]}`);
      });

      test("should respond with '403 Forbidden'", () => {
        expect(response.statusCode).toBe(403);
      });

      test("should return error response", () => {
        expect(response.body).toMatchObject({
          error: {
            message: expect.stringMatching(/forbidden/i),
          },
        });
      });
    });

    describe("when requested with valid id", () => {
      let deleteTodoId: string;
      let response: Response;

      beforeAll(async () => {
        deleteTodoId = seededTodoIds[0];

        response = await request
          .delete(deleteTodoApiPath.replace(":id", deleteTodoId))
          .set("Authorization", `Bearer ${tokens[0]}`);
      });

      test("should respond with '204 No Content'", () => {
        expect(response.statusCode).toBe(204);
      });

      test("resource must be deleted from the database", async () => {
        const deletedTodo = await Todo.findById(deleteTodoId);
        expect(deletedTodo).toBe(null);
      });
    });
  });
});
