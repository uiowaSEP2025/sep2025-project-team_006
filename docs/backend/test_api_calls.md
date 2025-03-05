# Test API Calls

This document shows an example of what each API call available in our NestJS backend, organized by module.

Each `curl` command will use the **localhost** configuration for testing.  
For production, replace `http://localhost:5000` with the production URL.

## Test Module

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/test`
- **Description:** Fetches all test records.
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/test
    ```
- **Response:**
    ```json
    [
        {
            "id": 1,
            "message": "Hello, this is test 1",
            "createdAt": "2025-02-14T22:18:58.228Z",
            "updatedAt": "2025-02-14T22:18:58.228Z"
        },
        ...
    ]
    ```
---

- **Method:** `GET`
- **Endpoint:** `/api/test/:id`
- **Description:** Fetches a single test entry by its ID.
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/test/1
    ```
- **Response:**
    ```json
    {
        "id": 1,
        "message": "Hello, this is test 1",
        "createdAt": "2025-02-14T22:18:58.228Z",
        "updatedAt": "2025-02-14T22:18:58.228Z"
    }
    ```

### PUT
---
- **Method:** `PUT`
- **Endpoint:** `/api/test/:id`
- **Description:** Updates an existing test entry.
- **Request Body:**
    ```json
    { "message": "Updated test message" }
    ```
- **Example:**
    ```sh
    curl --header "Content-Type: application/json" --request PUT --data "{ \"message\": \"Updated test message\" }" http://localhost:5000/api/test/1
    ```
- **Response:**
    ```json
    {
        "success":true,
        "updatedEntry":{
            "id":1,
            "message":"Updated test message",
            "createdAt":"2025-02-14T22:18:58.228Z","updatedAt":"2025-02-14T22:43:12.370Z"
        }
    }
    ```

### POST
---
- **Method:** `POST`
- **Endpoint:** `/api/test`
- **Description:** Creates a new test entry.
- **Request Body:**
    ```json
    { "message": "New test message" }
    ```
- **Example:**
    ```sh
    curl --header "Content-Type: application/json" --request POST --data "{ \"message\": \"New test message\" }" http://localhost:5000/api/test
    ```
- **Response:**
    ```json
    {
        "success":true,
        "newEntry":{
            "id":6,
            "message":"New test message",
            "createdAt":"2025-02-14T22:18:58.228Z","updatedAt":"2025-02-14T22:43:12.370Z"
        }
    }
    ```
