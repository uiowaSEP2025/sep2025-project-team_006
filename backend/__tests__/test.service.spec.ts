import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from 'src/modules/test/test.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test as TestEntity } from 'src/entity/test.entity';

describe('TestService', () => {
  let service: TestService;
  let repository: Repository<TestEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: getRepositoryToken(TestEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    repository = module.get<Repository<TestEntity>>(
      getRepositoryToken(TestEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all test data', async () => {
    const testData = [
      { id: 1, message: 'Hello', createdAt: new Date(), updatedAt: new Date() },
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(testData);

    expect(await service.getTestData()).toEqual(testData);
  });

  it('should return a single test entry by ID', async () => {
    const testData = {
      id: 1,
      message: 'Hello',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(repository, 'findOne').mockResolvedValue(testData);

    expect(await service.getTestDataById('1')).toEqual(testData);
  });

  it('should create a new test entry', async () => {
    const newTest = { message: 'New Message' };
    const savedTest = {
      id: 1,
      message: 'New Message',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'create').mockReturnValue(savedTest as any);
    jest.spyOn(repository, 'save').mockResolvedValue(savedTest);

    expect(await service.postTestData(newTest)).toEqual({
      success: true,
      newEntry: savedTest,
    });
  });

  it('should update a test entry', async () => {
    const existingTest = {
      id: 1,
      message: 'Old Message',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedTest = {
      id: 1,
      message: 'Updated Message',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(existingTest);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedTest);

    expect(
      await service.putTestData('1', { message: 'Updated Message' }),
    ).toEqual({ success: true, updatedEntry: updatedTest });
  });

  it('should return error if updating non-existent entry', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    expect(
      await service.putTestData('99', { message: 'Updated Message' }),
    ).toEqual({
      success: false,
      error: 'ID not found',
    });
  });
});
