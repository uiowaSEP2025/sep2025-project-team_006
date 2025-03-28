import { Test } from 'src/entity/test.entity';
import { DataSource } from 'typeorm';
import { LoggerService } from 'src/common/logger/logger.service';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Job: Seeds data in the test table, purely for API endpoint testing and production testing
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGSQL_HOST || 'localhost',
  port: Number(process.env.PGSQL_PORT) || 5432,
  username: process.env.PGSQL_USER || 'postgres',
  password: process.env.PGSQL_PASSWORD || 'password',
  database: process.env.PGSQL_DATABASE || 'gapdb',
  entities: [Test],
  synchronize: false, // Ensure migrations are used in production
});

export async function seedTestTable(logger: LoggerService) {
  await dataSource.initialize();
  const testRepository = dataSource.getRepository(Test);
  const existingCount = await testRepository.count();
  if (existingCount > 0) {
    logger.warn('Test table already seeded. Skipping...');
    await dataSource.destroy();
    return;
  }

  const testEntries = [
    { message: 'Hello, this is test 1' },
    { message: 'This is another test message' },
    { message: 'Seeding database with sample data' },
    { message: 'Testing API with mock data' },
    { message: 'Fifth test entry for database' },
  ];
  await testRepository.save(testEntries);

  logger.debug('Database seeded successfully with test data.');
  await dataSource.destroy();
}
