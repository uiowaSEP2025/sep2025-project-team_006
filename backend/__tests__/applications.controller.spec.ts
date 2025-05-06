import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from 'src/modules/applications/applications.controller';
import { ApplicationsService } from 'src/modules/applications/applications.service';
import { CreateApplicationDto } from 'src/dto/create-application.dto';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const mockService = {
      createApplication: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        { provide: ApplicationsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('delegates POST /api/applications to service.createApplication', async () => {
    const dto: CreateApplicationDto = {
      student_id: 5,
      department: 'ISE',
      degree_program: 'PHD',
    };
    const mockResponse = { application_id: 999 };
    (service.createApplication as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.postApplication(dto);

    expect(service.createApplication).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockResponse);
  });
});
