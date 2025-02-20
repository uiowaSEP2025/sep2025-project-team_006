import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from 'src/modules/test/test.controller';
import { TestService } from 'src/modules/test/test.service';

describe('TestController', () => {
  let controller: TestController;
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: TestService,
          useValue: {
            getTestData: jest
              .fn()
              .mockResolvedValue([{ id: 1, message: 'Hello' }]),
            getTestDataById: jest
              .fn()
              .mockResolvedValue({ id: 1, message: 'Hello' }),
            postTestData: jest.fn().mockResolvedValue({
              success: true,
              newEntry: { id: 2, message: 'New' },
            }),
            putTestData: jest.fn().mockResolvedValue({
              success: true,
              updatedEntry: { id: 1, message: 'Updated' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TestController>(TestController);
    service = module.get<TestService>(TestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all test data', async () => {
    expect(await controller.getTestData()).toEqual([
      { id: 1, message: 'Hello' },
    ]);
  });

  it('should return a single test entry by ID', async () => {
    expect(await controller.getTestById('1')).toEqual({
      id: 1,
      message: 'Hello',
    });
  });

  it('should create a new test entry', async () => {
    expect(await controller.postTestData({ message: 'New' })).toEqual({
      success: true,
      newEntry: { id: 2, message: 'New' },
    });
  });

  it('should update a test entry', async () => {
    expect(await controller.putTestData('1', { message: 'Updated' })).toEqual({
      success: true,
      updatedEntry: { id: 1, message: 'Updated' },
    });
  });
});
