import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { CreateUserDto, RefreshTokenDto } from 'src/dto/auth.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const registrationResult = {
        token: 'jwt-token',
        session: 'session-token',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn().mockResolvedValue(registrationResult),
                        login: jest.fn().mockResolvedValue(registrationResult),
                        refreshJWT: jest.fn().mockResolvedValue({ token: 'jwt-token' }),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    describe('postStudentRegistration', () => {
        it('should register a new student', async () => {
            const dto: CreateUserDto = { email: 'student@example.com', password: 'password' };
            const result = await controller.postStudentRegistration(dto);
            expect(result).toEqual(registrationResult);
            expect(service.register).toHaveBeenCalledWith(dto.email, dto.password, false);
        });
    });

    describe('postStudentLogin', () => {
        it('should login a student', async () => {
            const dto: CreateUserDto = { email: 'student@example.com', password: 'password' };
            const result = await controller.postStudentLogin(dto);
            expect(result).toEqual(registrationResult);
            expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
        });
    });

    describe('postRefresh', () => {
        it('should refresh the JWT token', async () => {
            const dto: RefreshTokenDto = { session: 'some-session' };
            const result = await controller.postRefresh(dto);
            expect(result).toEqual({ token: 'jwt-token' });
            expect(service.refreshJWT).toHaveBeenCalledWith(dto.session);
        });
    });
});
