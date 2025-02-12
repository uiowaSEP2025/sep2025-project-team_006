import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import pool from "./database/db";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);

  // check out a single client
  const pgsql_client = await pool.connect();

  // sample query + response - will be removed
  console.log(await pgsql_client.query(`CREATE TABLE cars (
    brand VARCHAR(255),
    model VARCHAR(255),
    year INT
  );`));

  // release the client
  pgsql_client.release();
}

bootstrap();
