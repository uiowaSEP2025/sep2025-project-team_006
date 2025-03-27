import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedTestTable } from './seed/seedTestTable';
import { seedUserDatabase } from './seed/seed_users';
import { seedFacultyMetrics } from './seed/seed_faculty_metrics';
import { ResponseInterceptor } from './config/response.interceptor';
import { HttpExceptionFilter } from './config/http_exception.filter';
import { seedApplications } from './seed/seed_applications';
import { LoggerService } from './common/logger/logger.service';
import { seedDocuments } from './seed/seed_documents';
import { seedReviews } from './seed/seed_reviews';
import { seedReviewMetrics } from './seed/seed_review_metrics';

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.enableCors({
    origin: ['http://localhost:3000', 'https://uiowasep2025.github.io'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // To help standardize our API responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(process.env.PORT ?? 5000);

  // seed data ONLY when in development mode
  if (process.env.NODE_ENV === 'development') {
    try {
      await seedTestTable();
      await seedUserDatabase();
      await seedFacultyMetrics();
      await seedApplications();
      await seedDocuments();
      await seedReviews();
      await seedReviewMetrics();
      console.log('Database seeding completed.');
    } catch (error) {
      logger.error('Error seeding database:', error);
      process.exit(1);
    }
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
