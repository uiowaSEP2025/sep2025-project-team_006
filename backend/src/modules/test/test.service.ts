import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from 'src/entity/test.entity';
import { Repository } from 'typeorm';

/**
 * Job: Handles the logic for the controller
 */
@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}

  async getTestData() {
    return this.testRepository.find();
  }

  async getTestDataById(id: string) {
    return this.testRepository.findOne({ where: { id: Number(id) } });
  }

  async postTestData(data: { message: string }) {
    try {
      const newTest = this.testRepository.create(data);
      const newEntry = await this.testRepository.save(newTest);
      return { success: true, newEntry };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  async putTestData(id: string, data: { message: string }) {
    try {
      const testRecord = await this.testRepository.findOne({
        where: { id: Number(id) },
      });
      if (!testRecord) {
        return { success: false, error: 'ID not found' };
      }
      testRecord.message = data.message;
      const updatedEntry = await this.testRepository.save(testRecord);

      return { success: true, updatedEntry };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}
