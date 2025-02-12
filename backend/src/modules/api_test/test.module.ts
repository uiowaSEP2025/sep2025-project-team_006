import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test.controller';
import { TestService } from './test.service';

ConfigModule.forRoot();

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule { }
