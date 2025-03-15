import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './database/database.module';
import { FacultyMetricsModule } from './modules/faculty-metrics/faculty-metrics.module';
import { StudentsModule } from './modules/students/students.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DocumentsModule,
    FacultyMetricsModule,
    StudentsModule,
    TestModule,
  ],
})
export class AppModule {}
