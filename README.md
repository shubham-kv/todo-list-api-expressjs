
# todo-list-api

Simple Todo List API with jwt authentication in express.js.

## List of APIs

- [Register User API](#1-register-user-api)
- [Login API](#2-login-api)

## Detailed API Specification

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
  "email": "john.doe2@example.com",
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

API to allow users to login to the application, utilizes jwt token.

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

## Credits

Thanks to [Roadmap.sh | Todo List API](https://roadmap.sh/projects/todo-list-api).
