import { User, AccountType } from 'src/entity/user.entity';
import { DataSource } from 'typeorm';

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
  entities: [User],
  synchronize: false, // Ensure migrations are used in production
});

export async function seedUsers() {
  await dataSource.initialize();
  const userRepository = dataSource.getRepository(User);
  const existingCount = await userRepository.count();
  if (existingCount > 0) {
    console.log('Users already seeded. Skipping...');
    await dataSource.destroy();
    return;
  }

  const userEntries = [
    {
      displayName: 'Steven',
      email: 'vanni@uiowa.edu',
      passwordDigest: 'ThisIsAMeaninglessFieldATM',
      role: AccountType.FACULTY,
      oauth: false,
    },
  ];
  await userRepository.save(userEntries);

  console.log('Database seeded successfully with user data.');
  await dataSource.destroy();
}
