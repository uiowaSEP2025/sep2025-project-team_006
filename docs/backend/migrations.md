# Database Migrations

Every time you make changes to your entities or table definitions, you'll need to update your database via migration files. 
These migration files should be committed to the repository so that all of us can remain in sync.

## When to Run Migration Commands

- **After Changing Your Entities:**
Whenever you update your entity definitions or modify your table structures, generate a new migration file that reflects these changes.

- **After Pulling New Changes:**
When you pull updates from the repository, run the migration command to apply any pending migrations. 
This keeps your local database up-to-date with the latest schema changes.

- **Resetting the Database (Development Only):**
If you encounter issues or want to start fresh, you can drop your entire schema and reapply all migrations. 
Be cautious—this will delete all existing data. However this does not matter for development because of our seeding scripts.

## Full CLI Commands

### Create a Blank Migration File

Creates an empty migration file that you can manually edit:

```bash
npx typeorm migration:create ./src/database/migrations/SepMigration
```
If you want to be more specific about the change you can name it something else instead of `SepMigration`.

### Generate an Automatic Migration

Generates a migration by comparing your current entities with the database schema:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./src/database/migrations/SepMigration -d ./src/database/data-source.ts
```
If you want to be more specific about the change you can name it something else instead of `SepMigration`.

### Run Migrations

Applies all pending migrations to update your database:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource ./src/database/data-source.ts
```

### Revert Migrations

Rolls back the last applied migration:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert --dataSource ./src/database/data-source.ts
```

### Drop the Entire Schema (Development Only)

Drops all tables in your database. Warning: This command will delete all your data.

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js schema:drop --dataSource ./sr
```

## NPM Scripts

For convenience, these commands are in the `package.json` under the `/backend` directory. This allows you to use simple commands to manage your migrations.
```bash
npm run db:drop
npm run migrate:generate
npm run migrate:run
npm run migrate:revert
```
