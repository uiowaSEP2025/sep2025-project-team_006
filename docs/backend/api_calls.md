# API Calls

This document explains each API call available in our NestJS backend, organized by module.

Each `curl` command will use the **localhost** configuration for testing.  
For production, replace `http://localhost:5000` with the production URL.


## General Response Patterns

To help keep the format consistent and to help not having to have a different way to handle each API response here is what the error and success responses look like.

### Success Response

This just checks if it successfully, if true, go ahead and grab the contents from the payload.

```json
{
  "success": true,
  "payload": [
    ...
  ]
}
```

### Error Response

Example format of the error case, the important thing is to check if the success is false and then a generic error message can be shown. Or a specific one depending on the use case.

```json
{
  "success": false,
  "error": {
    "message": "Cannot GET /api/faculty/metrics",
    "error": "Not Found",
    "statusCode": 404
  },
  "timestamp": "2025-03-04T03:40:03.449Z",
  "path": "/api/faculty/metrics"
}
```

**Note: Because of this consistency only the happy path payload will be shown as part of the example response.**

## Faculty Metrics Module

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/faculty/metrics/default`
- **Description:** Fetches all of our predefined, static, default review metrics
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/faculty/metrics/default
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload": [
            {
                "metric_name": "Recommendation Score",
                "description": "Quality of recommendation letters",
                "default_weight": 0.2
            },
            {
                "metric_name": "GPA (University Modifier)",
                "description": "GPA with consideration of institution prestige",
                "default_weight": 0.25
            },
            ...
        ] 
    }
    ```
    To see or modify all the default metrics please view the `faculty-metrics-default.ts` file. 
---

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/faculty/metrics/:id`
- **Description:** Fetches all of the faculty metrics, by an `:id`, which is for the faculty member viewing their settings page.
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/faculty/metrics/1
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload": [
            {
                "faculty_metric_id": 1,
                "metric_name": "Updated GPA",
                "description": "M.I.T",
                "default_weight": 5.5
            },
            ...
        ] 
    }
    ```
---

### PUT
---
- **Method:** `PUT`
- **Endpoint:** `/api/faculty/metrics/:id`
- **Description:** Updates an existing faculty metric entry. `:id` is for the `faculty_metric_id`
- **Request Body:**
    ```json
    {  
        "metric_name": "Name", // optional
        "description": "Description", // optional
        "default_weight": 1.0 // optional
    }
    ```
- **Example:**
    ```sh
    curl --header "Content-Type: application/json" --request PUT --data "{ \"metric_name\": \"Updated GPA\", \"default_weight\": 5.5 }" http://localhost:5000/api/faculty/metrics/1
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload":{
            "faculty_metric_id":1,
            "metric_name":"Updated GPA",
            "description":"M.I.T",
            "default_weight":5.5
        }
    }
    ```

### POST
---
- **Method:** `POST`
- **Endpoint:** `/api/faculty/metrics`
- **Description:** Creates a new metric for the faculty member entry.
- **Request Body:**
    ```json
    { 
        "metric_name": "NEW GPA", 
        "description": "Iowa GPA", 
        "default_weight": 2.0, 
        "faculty_id": 1 // this finds the faculty account to link to
    }
    ```
- **Example:**
    ```sh
    curl --header "Content-Type: application/json" --request POST --data "{ \"metric_name\": \"NEW GPA\", \"description\": \"Iowa GPA\", \"default_weight\": 2.0, \"faculty_id\": 1 }" http://localhost:5000/api/faculty/metrics
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload":{
            "metric_name":"NEW GPA",
            "description":"Iowa GPA",
            "default_weight":2,
            "faculty":{
                "faculty_id":1,
                "first_name":"Alice",
                "last_name":"Faculty",
                "phone_number":"3191234567",
                "department":"ECE",
                "job_title":"Professor"
            },
            "faculty_metric_id":21
        }
    }
    ```

### DELETE
---
- **Method:** `DELETE`
- **Endpoint:** `/api/faculty/metrics/:id`
- **Description:** Deletes a metric for the faculty member by the `:id` specified.
- **Example:**
    ```sh
    curl --header "Content-Type: application/json" --request DELETE http://localhost:5000/api/faculty/metrics/1
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload":{
            "message":"Faculty metric ID: 1 has been deleted."
        }
    }
    ```

## Students Module

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/students/applicants`
- **Description:** Fetches a list of all students that have an application with a "submitted" status, as well as the degree and department.
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/students/applicants
    ```
- **Response:**
    ```json
    {
        "success":true,
        "payload": [
            {
                "student_id": 2,
                "full_name": "Alice Scholar",
                "status": "submitted",
                "department": "ECE",
                "degree_program": "M.S."
            },
            {
                "student_id": 10,
                "full_name": "Julia Bookworm",
                "status": "submitted",
                "department": "ECE",
                "degree_program": "M.S."
            },
            ...
        ] 
    }
    ```

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/students/:id`
- **Description:** Fetches all the information about the student given an `:id` parameter.
- **Example:**
    ```sh
    $ curl http://localhost:5000/api/students/2
    ```
- **Response:**
    ```json
    {
        "success": true,
        "payload": {
            "student_id": 2,
            "first_name": "Alice",
            "last_name": "Scholar",
            "phone_number": "3192345678",
            "address": "456 College Ave, Iowa City, IA 52242",
            "applications": [
                {
                    "application_id": 8,
                    "status": "submitted",
                    "submission_date": "2025-03-08T10:00:00.000Z",
                    "department": "ECE",
                    "degree_program": "M.S.",
                    "documents": [],
                    "reviews": []
                }
            ]
        }
    }
    ```
---

## Documents Module

### POST
---
- **Method:** `POST`
- **Endpoint:** `/api/documents`
- **Description:** Uploads a new document file (`pdf` or `xlsx`) for a specific application. The request must be sent as `multipart/form-data` and include:
- **Request Body:**
    ```json
    {
        "file": "<file location>",
        "document_type": "xlsx", // either "xlsx" or "pdf"
        "application_id": 6
    }
    ```
- **Example:**
    ```sh
    curl -X POST "http://localhost:5000/api/documents" \
     -F "file=@test_excel.xlsx" \
     -F "document_type=xlsx" \
     -F "application_id=6"
    ```
- **Response:**
    ```json
    {
        "success": true,
        "payload": {
            "document_type": "xlsx",
            "file_path": "uploads\\file-1742065435575-328615993.xlsx",
            "application": {
                "application_id": 6,
                "status": "submitted",
                "submission_date": "2025-03-06T10:00:00.000Z",
                "department": "ECE",
                "degree_program": "M.S."
            },
            "document_id": 3,
            "uploaded_at": "2025-03-15T19:03:55.598Z"
        }
    }
    ```

### GET
---
- **Method:** `GET`
- **Endpoint:** `/api/documents/:id`
- **Description:** Retrieves a document by its ID, streams the binary file (`pdf` or `xlsx`) to the client, and sets the appropriate `Content-Type` header.
- **Example:**
    ```sh
    # Note: the --output tag is used in cURL so we can open the file locally.
    $ curl http://localhost:5000/api/documents/1 --output test.pdf
    ```
- **Response:**
    ```sh
    # With cURL the output will just be showing saving the data.
    # With the API function the output will look like:
    blob:http://localhost:3000/32e89ba6-65f0-40ec-a29b-3814e49026e9
    # This is essentially the "URL" to open or download the file
    ```
---