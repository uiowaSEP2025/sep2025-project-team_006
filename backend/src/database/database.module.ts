import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/entity/application.entity';
import { Document } from 'src/entity/document.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { Review } from 'src/entity/review.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Session } from 'src/entity/session.entity';
import { Student } from 'src/entity/student.entity';
import { User } from 'src/entity/user.entity';
import * as dotenv from 'dotenv';
import { TemplateMetric } from 'src/entity/template_metric.entity';
import { Template } from 'src/entity/template.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGSQL_HOST || 'localhost',
      port: Number(process.env.PGSQL_PORT) || 5432,
      username: process.env.PGSQL_USER || 'postgres',
      password: process.env.PGSQL_PASSWORD || 'password',
      database: process.env.PGSQL_DATABASE || 'gapdb',
      // Add any entities into this list in alphabetical order
      entities: [
        Application,
        Document,
        FacultyMetric,
        Faculty,
        ReviewMetric,
        Review,
        TemplateMetric,
        Template,
        Session,
        Student,
        User,
      ],
      // dev only, use migrations in production
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsTableName: 'sep_migration_table',
    }),
  ],
  exports: [TypeOrmModule], // Exporting allows other modules to use TypeORM
})
export class DatabaseModule {}
