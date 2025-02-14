import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { TestService } from './test.service';

/**
 * Job: These calls are test for deployment sake and for calls from the front end
 */
@Controller('api/test') // .*/api/test/.*
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get() // .*/api/test
  async getTestData() {
    return this.testService.getTestData();
  }

  @Get(':id') // .*/api/test/:id
  async getTestById(@Param('id') id: string) {
    return this.testService.getTestDataById(id);
  }

  @Post() // .*/api/test
  async postTestData(@Body() data: { message: string }) {
    return this.testService.postTestData(data);
  }

  @Put(':id') // .*/api/test/:id
  async putTestData(
    @Param('id') id: string,
    @Body() data: { message: string },
  ) {
    return this.testService.putTestData(id, data);
  }
}
