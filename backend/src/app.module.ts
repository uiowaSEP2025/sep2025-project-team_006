import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './modules/api_test/test.module';
import { DatabaseModule } from './database/database.module';

ConfigModule.forRoot();

@Module({
  imports: [DatabaseModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
