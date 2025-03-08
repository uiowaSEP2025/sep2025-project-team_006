import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedTestTable } from './seed/seedTestTable';
import { seedUserDatabase } from './seed/seed_users';
import { seedFacultyMetrics } from './seed/seed_faculty_metrics';
import { ResponseInterceptor } from './config/response.interceptor';
import { HttpExceptionFilter } from './config/http_exception.filter';
import { seedApplications } from './seed/seed_applications';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://uiowasep2025.github.io'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // To help standardize our API responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 5000);

  // seed data ONLY when in development mode
  if (process.env.NODE_ENV === 'development') {
    try {
      // TODO: Seed new tables, slowly start removing test table as more progress is being made
      await seedTestTable();
      await seedUserDatabase();
      await seedFacultyMetrics();
      await seedApplications();
      console.log('Database seeding completed.');
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
