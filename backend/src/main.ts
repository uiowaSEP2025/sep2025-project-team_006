import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedTestTable } from './database/seedTestTable';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);

  // seed data ONLY when in development mode
  if (process.env.NODE_ENV === 'development') {
    seedTestTable().catch((error) => {
      console.error("Error seeding database:", error);
      process.exit(1);
    });
  }
}

bootstrap();
