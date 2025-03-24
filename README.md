
# todo-list-api

Simple Todo List API with jwt authentication in express.js.

## List of APIs

- [Register User API](#1-register-user-api)
- [Login API](#2-login-api)
- [Create Todo API](#3-create-todo-api)
- [Update Todo API](#4-update-todo-api)

## Specification

### 1. Register User API

API to allow new users to register to the application.

**API Specification:**

|   |   |
| - | - |
| API Version           | `v1`                |
| Request Method        | `POST`              |
| Request Path          | `/api/v1/register`  |
| Response Content type | `json`              |
| Response Status Code  | `201`               |

**Sample Request:**

```http
POST /api/v1/register HTTP/1.1
Host: localhost:4000
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "John#123"
}
```

**Sample Success Response:**

```json
{
  "message": "Registration Successful",
  "user": {
    "id": "67dbe3d4cf8018a34d0ab44d",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-03-20T09:45:56.097Z",
    "updatedAt": "2025-03-20T09:45:56.097Z"
  }
}
```

### 2. Login API

API to allow users to login to the application by using json web token (JWT) for
authorization.

**API Specification:**

|   |   |
| - | - |
| API Version           | `v1`                |
| Request Method        | `POST`              |
| Request Path          | `/api/v1/auth/login`|
| Response Content type | `json`              |
| Response Status Code  | `200`               |

**Sample Request:**

```http
POST /api/v1/auth/login HTTP/1.1
Host: localhost:4000
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "John#123"
}
```

**Sample Success Response:**

```json
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create Todo API

API to create & add todos for a user, requires authentication with the `Bearer
{token}` authentication scheme.

**API Specification:**

|   |   |
| - | - |
| API Version           | `v1`            |
| Request Method        | `POST`          |
| Request Path          | `/api/v1/todos` |
| Response Content type | `json`          |
| Response Status Code  | `201`           |

**Sample Request:**

```http
POST /api/v1/todos HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkMjQwMzQyZTZkNzE4YzU1MjFjM2QiLCJpYXQiOjE3NDI2NDI0NjcsImV4cCI6MTc0MjcyODg2N30.K8YdfzJT4rClGGpb7bKvJsrqlSmEl30b1nQCFYnKBe8

{
  "title": "Write Docs",
  "description": "Write detailed, clear & concise documentation for Todos API"
}
```

**Sample Success Response:**

```json
{
  "message": "Success",
  "todo": {
    "id": "67dbe3d4cf8018a34d0ab44d",
    "title": "Write Docs",
    "description": "Write detailed, clear & concise doc...",
    "isDone": false,
    "createdAt": "2025-03-23T07:41:04.958Z",
    "updatedAt": "2025-03-23T07:41:04.958Z"
  }
}
```

### 4. Update Todo API

API to update existing todos of a user, requires authentication with the `Bearer
{token}` authentication scheme.

**API Specification:**

|   |   |
| - | - |
| API Version           | `v1`                |
| Request Method        | `PUT`               |
| Request Path          | `/api/v1/todos/:id` |
| Response Content type | `json`              |
| Response Status Code  | `200`               |

**Sample Request:**

```http
PUT /api/v1/todos/67dfd5b2df9ea55a38deae9c HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RkMjQwMzQyZTZkNzE4YzU1MjFjM2QiLCJpYXQiOjE3NDI3OTQ2MjIsImV4cCI6MTc0Mjg4MTAyMn0.Tn46fTdN4ykX_s-C7ZKdqc1vKZcIUqedfa0D4Dp5HFk

{
  "title": "Write Update Todo API docs",
  "description": "Write documentation for Update Todos API",
  "isDone": true
}
```

**Sample Success Response:**

```json
{
  "message": "Updated Successfully",
  "todo": {
    "id": "67dfd5b2df9ea55a38deae9c",
    "title": "Write Update Todo API docs",
    "description": "Write documentation for Update Todos API",
    "isDone": true,
    "createdAt": "2025-03-23T09:34:42.611Z",
    "updatedAt": "2025-03-23T10:08:35.979Z"
  }
}
```

## Credits

Thanks to [Roadmap.sh | Todo List API](https://roadmap.sh/projects/todo-list-api).
