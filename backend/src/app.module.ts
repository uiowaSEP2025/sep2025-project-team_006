import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { FacultyMetricsModule } from './modules/faculty-metrics/faculty-metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FacultyMetricsModule,
    TestModule,
    AuthModule,
  ],
})
export class AppModule {}
