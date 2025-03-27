import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './database/database.module';
import { FacultyMetricsModule } from './modules/faculty-metrics/faculty-metrics.module';
import { StudentsModule } from './modules/students/students.module';
import { LoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FacultyMetricsModule,
    StudentsModule,
    TestModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
