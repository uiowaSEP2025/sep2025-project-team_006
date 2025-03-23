# API Methods and WebService Documentation

This document describes the API methods used to interact with our backend and the central WebService class that organizes all API endpoint URLs. 
These functions use Axios to perform HTTP requests and return JSON data.

## Functions for API Methods

### `apiGET`

Performs a `GET` request to fetch data from the server.
The URL includes an optional `:id` placeholder for endpoints that require it.

Usage Example:
```ts
const response = await apiGET(webService.TEST_GET);
```

---

### `apiPUT`

Performs a `PUT` request to update an existing resource on the server.

Usage Example:
```ts
const data = JSON.stringify({ message: "Updated message" });
const response = await apiPUT(webService.TEST_PUT, "1", data);
```

---

### `apiPOST`

Performs a `POST` request to create a new resource on the server.

Usage Example:
```ts
const data = JSON.stringify({ message: "New message" });
const response = await apiPOST(webService.TEST_POST, data);
```

---

### `apiDELETE`

Performs a `DELETE` request to remove a resource from the server. 
The endpoint URL contains a dynamic `:id` placeholder that is replaced with the provided id.

Usage Example:
```ts
const response = await apiDELETE(webService.FACULTY_METRIC_ID, "1");
```

## WebService Class

The WebService class centralizes all our API endpoints. 
It dynamically sets the base URL based on the environment (development or production) and exposes endpoint URLs for different operations.

For each API endpoint, they might hold multiple methods so to help with that all available methods for each item are in the `/docs/backend/api_calls.md` file. As well as for each new endpoint with a comment we will denote the available methods for them just as a quick reference.

Example:
```ts
FACULTY_METRIC_ID = `${this.serverUrl}/api/faculty/metrics/:id`; // PUT, POST, DELETE
```

## Usage In App

Since the backend *should* return a consistent format for all the API endpoints this helps ensure the process is consistent across the project.

For example:
```ts
// Imports that are needed
import { /* Functions that are needed */ } from "@/api/apiMethods";
import WebService from "@/api/WebService";

// Inside the function declaration initialize the webservice like this
const webService = new WebService();
```

Then depending on if the API should be called when the screen is loaded or when some other condition calls it, we want to set up the format like this:  
```ts
// In case some unexpected error occurs, we want the try-catch to avoid crashes.
try {
    // call API
    const response = await apiGETbyId(webService.STUDENTS_APPLICANT_INFO, studentId);
    // we then check to see if we get a { "success": true } from the response
    if (response.success) {
        // If successful use the data from the payload for whatever it is needed for.
        const data = response.payload
    } else {
        // Otherwise we log the error, optionally have some special UI handling depending on the error.
        console.error("GET error:", response.error);
    }
} catch (error) {
    console.error("An unexpected error occurred:", error);
}
```

This documentation outlines the usage and purpose of each API method and the WebService class, providing a clear reference on how to perform HTTP operations within the framework. 
