import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import pool from "./lib/db";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);

  // check out a single client
  const client = await pool.connect();

  // sample query + response
  console.log(await client.query(`CREATE TABLE cars (
    brand VARCHAR(255),
    model VARCHAR(255),
    year INT
  );`));

  // release the client
  client.release();
}

bootstrap();
