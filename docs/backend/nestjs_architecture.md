# NestJS Architecture & Best Practices

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
│   ├── seed/                           # Seeding scripts for each table
│   ├── utils/                          # Utility functions
├── test/                               # Unit and e2e tests
├── .env                                # Environment variables
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript config
```

## Best Practices

When going about and adding a new feature module here are some examples and tips that might be useful when creating each file.

1. **Modular Design**
    - Each "feature" is a separate module inside `.*/src/module/.*`
    - `AppModule` should import the feature modules as well as initiate database connections
        ```ts
        // App module that imports other feature modules
        @Module({
            imports: [
                DatabaseModule, 
                TestModule,
                ... // other modules
            ],
        })
        export class AppModule {}
        ```
    - When creating your own module you will likely need the following files:
        - `feature.service.ts`
        - `feature.controller.ts`
        - `feature.module.ts`
        - `table.entity.ts`
    - Note: that you may not always need a new table for each feature, and some features may use multiple tables
    
2. **Services: Business Logic Layer**
    - Services handle business logic and communicate with the database.
    - They are provided as dependencies in their module.
    - An example structure would look like:
        ```ts
        @Injectable()
        export class TestService {
            constructor(
                // Add an InjectRepository for every table needed
                @InjectRepository(Test) 
                private readonly testRepository: Repository<Test>,
            ) {}

            // Add business logic functions to do various DB commands
            async getTestData() {
                return this.testRepository.find();
            }

            async postTestData(data: { message: string }) {
                try {
                    const newTest = this.testRepository.create(data);
                    const newEntry = await this.testRepository.save(newTest);
                    return { success: true, newEntry };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
        }
        ```

3. **Controllers: Handling API Routes**
    - Controllers define API endpoints and delegate business logic to services.
    - For each controller and their API calls, list the link extension as shown below for convenience, note that `NestJS` accounts for `/`'s that aren't explicit shown. 
    - For each annotation (`@Get() | @Put() | @Post()`) you can specific an extension for the link, this is especially useful when we have multiple calls of the same type, or have an `id` input we would like to utilize.
    - For our convenience, please include the endpoints in comments like shown below  
    - An example structure would look like:
        ```ts
        @Controller('api/test') // .*/api/test/.*
        export class TestController {
            constructor(private readonly testService: TestService) {}

            @Get() // .*/api/test
            async getTestData() {
                return this.testService.getTestData();
            }

            @Get(':id') // .*/api/test/:id
            async getTestById(@Param('id') id: string) {
                return this.testService.getTestDataById(id);
            }

            @Post() // .*/api/test
            async postTestData(@Body() data: { message: string }) {
                return this.testService.postTestData(data);
            }

            @Put(':id') // .*/api/test/:id
            async putTestData(@Param('id') id: string, @Body() data: { message: string }) {
                return this.testService.putTestData(id, data);
            }
        }
        ```

4. **Modules: The Connection Point**
    - Modules server as the central connection point for a feature
    - They bring together entities, services, and controllers within a feature
    - The `imports` section registers the required database tables
    - The `providers` section registers the service responsible for business logic
    - The `controllers` section registers the controller that defines the API endpoints
    - An example structure would look like:
        ```ts
        @Module({
            // Add to the forFeature list if multiple tables are needed
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forFeature([Test]),
            ],
            controllers: [TestController],
            providers: [TestService],
        })
        export class TestModule {}
        ```

5. **Entities: The Database Schemas**
    - Entities define the structure of database tables using `TypeORM`
    - They are simple TypeScript classes decorated with `@Entity()` and various column decorators
    - Each property in the entity corresponds to a column in the database
    - An example structure would look like:
        ```ts
        @Entity('tests') // Table name in PostgreSQL
        export class Test {
            @PrimaryGeneratedColumn()
            id: number;

            @Column()
            message: string;

            @CreateDateColumn()
            createdAt: Date;

            @UpdateDateColumn()
            updatedAt: Date;
        }
        ```

For any more up-to-date examples please view the code their respective directories and see how items are setup. 