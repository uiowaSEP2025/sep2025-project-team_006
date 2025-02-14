# NestJS Architecture & Best Practices (WIP)

## Overview

This document describes the architecture, design principles, and best practices used in this NestJS backend. 
It provides guidelines on structuring the project, handling dependencies, and maintaining clean, scalable code.

## Project Structure

A well-organized NestJS project follows a modular architecture to maintain separation of concerns.

```bash
/backend
├── src/
│   ├── main.ts                         # Entry point
│   ├── app.module.ts                   # Root module
│   ├── config/                         # Environment & app config
│   ├── database/                       # Database connection setup
│   ├── entities/                       # Database schema
│   ├── modules/
│   │   ├── example/
│   │   │   ├── example.controller.ts   # API routes
│   │   │   ├── example.module.ts       # Feature specific module
│   │   │   ├── example.service.ts      # Business logic
│   ├── utils/                          # Utility functions
├── test/                               # Unit and e2e tests
├── .env                                # Environment variables
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript config
```

## Best Practices

1. **Modular Design**
    - Each "feature" is a separate module inside `.*/src/module/.*`
    - `AppModule` should import the feature modules as well as initiate database connections
    ```ts
    // App module that imports other feature modules
    @Module({
        imports: [
            ExampleModule, 
            ...
        ],
    })
    export class AppModule { }

    // Example feature module
    ConfigModule.forRoot();

    @Module({
        imports: [],
        controllers: [ExampleController],
        providers: [ExampleService],
    })
    export class ExampleModule { }
    ```

2. **Controllers: Handling API Routes**
    - Controllers define API endpoints and delegate business logic to services.
    - For each controller and their API calls, list the link extension as shown below for convenience, note that `NestJS` accounts for `/`'s that aren't explicit shown. 
    - For each annotation (`@Get() | @Put() | @Post()`) you can specific an extension for the link, this is especially useful when we have multiple calls of the same type. 
    ```ts
    @Controller('api/example') // .*/api/example/.*
    export class ExampleController {
        constructor(private readonly exampleService: ExampleService) {}

        @Get('get') // .*/api/example/get
        getExample() {
            return this.testService.getExample();
        }

        @Put(':id') // .*/api/example/:id
        putExample(@Param('id') id: string, @Body() data: { message: string }) {
            return this.testService.putExample(id, data);
        }

        @Post('post') // .*/api/test/post
        postTestData(@Body() data: { message: string }) {
            return this.testService.postExample(data);
        }
    }
    ```

3. **Services: Business Logic Layer**
    - Services handle business logic and communicate with the database.
    - They are provided as dependencies in their module.
    - An example of what the structure would look like:
    ```ts
    @Injectable()
    export class ExampleService {
        // db connection

        getExample() {
            // business logic
        }

        putExample(id: string, data: { message: string }) {
            // business logic
        }

        postTestData(data: { message: string }) {
            // business logic
        }
    }
    ```

For any more up-to-date examples please view the code their respective directories and see how items are setup. 