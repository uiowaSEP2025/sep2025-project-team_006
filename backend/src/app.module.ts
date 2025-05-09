import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { FacultyMetricsModule } from './modules/faculty-metrics/faculty-metrics.module';
import { StudentsModule } from './modules/students/students.module';
import { LoggerService } from './common/logger/logger.service';
import { DocumentsModule } from './modules/documents/documents.module';
import { ReviewMetricsModule } from './modules/reviews-metrics/review-metrics.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { TemplateModule } from './modules/templates/templates.module';
import { ApplicationModule } from './modules/applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DocumentsModule,
    FacultyMetricsModule,
    ReviewMetricsModule,
    ReviewsModule,
    TemplateModule,
    StudentsModule,
    AuthModule,
    ApplicationModule
  ],
  providers: [LoggerService],
})
export class AppModule {}
