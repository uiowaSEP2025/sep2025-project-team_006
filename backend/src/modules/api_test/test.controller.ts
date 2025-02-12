import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { TestService } from './test.service';

/**
 * Job: These calls are test for deployment sake and for calls from the front end
 */
@Controller('api/test') // .*/api/test/.*
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('get') // .*/api/test/get
  getTestData() {
    return this.testService.getTestData();
  }

  @Post('post') // .*/api/test/post
  postTestData(@Body() data: { message: string }) {
    return this.testService.postTestData(data);
  }

  @Put(':id') // .*/api/test/:id
  putTestData(@Param('id') id: string, @Body() data: { message: string }) {
    return this.testService.putTestData(id, data);
  }
}
