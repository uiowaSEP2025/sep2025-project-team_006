import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './database/database.module';

ConfigModule.forRoot();

@Module({
  imports: [DatabaseModule, TestModule],
})
export class AppModule {}
