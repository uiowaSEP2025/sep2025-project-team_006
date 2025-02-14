import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/entity/test.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGSQL_HOST || 'localhost',
      port: Number(process.env.PGSQL_PORT) || 5432,
      username: process.env.PGSQL_USER || 'postgres',
      password: process.env.PGSQL_PASSWORD || 'password',
      database: process.env.PGSQL_DATABASE || 'postgres',
      // Add any entities into this list
      entities: [Test],
      // dev only, use migrations in production
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule], // Exporting allows other modules to use TypeORM
})
export class DatabaseModule {}
