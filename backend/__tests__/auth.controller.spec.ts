import * as crypto from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe("traditionalLogin", () => {
    it.skip("should return a session token", async () => {
      expect(await controller.postStudentLogin({ email: "minecraftguy66@gmail.com", password: "12345"})).toMatch(/0-9a-f{32}/);
    })
  })
});
