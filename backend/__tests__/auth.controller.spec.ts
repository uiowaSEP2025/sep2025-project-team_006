import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from 'src/dto/auth.dto';
import { AuthenticatedRequest, AuthGuard } from 'src/modules/auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockRegistration = { token: 'jwt-token', session: 'session-token' };
    const mockAuthInfo = { id: 123, email: 'test@example.com', account_type: 'STUDENT', provider: 'local', registered_at: 0, updated_at: 0 };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn().mockResolvedValue(mockRegistration),
                        login: jest.fn().mockResolvedValue(mockRegistration),
                        refreshJWT: jest.fn().mockResolvedValue({ token: 'jwt-token' }),
                        getAuthInfo: jest.fn().mockResolvedValue(mockAuthInfo),
                    },
                },
            ],
        })
            // override AuthGuard to allow calls
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => true,
            })
            .compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    describe('postStudentRegistration', () => {
        it('calls AuthService.register with correct args', async () => {
            const dto: RegisterDto = {
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '1234567890',
                email: 'john@example.com',
                password: 'pass',
            };
            const result = await controller.postStudentRegistration(dto);
            expect(service.register).toHaveBeenCalledWith(
                dto.first_name,
                dto.last_name,
                dto.phone_number,
                dto.email,
                dto.password,
                false,
            );
            expect(result).toEqual(mockRegistration);
        });
    });

    describe('postStudentLogin', () => {
        it('calls AuthService.login with correct args', async () => {
            const dto: LoginDto = { email: 'john@example.com', password: 'pass' };
            const result = await controller.postStudentLogin(dto);
            expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
            expect(result).toEqual(mockRegistration);
        });
    });

    describe('postRefresh', () => {
        it('calls AuthService.refreshJWT and returns token', async () => {
            const dto: RefreshTokenDto = { session: 'some-session' };
            const result = await controller.postRefresh(dto);
            expect(service.refreshJWT).toHaveBeenCalledWith(dto.session);
            expect(result).toEqual({ token: 'jwt-token' });
        });
    });

    describe('getAuthInfo', () => {
        it('calls AuthService.getAuthInfo and returns user info', async () => {
            const req = { user: { email: 'test@example.com', id: 1 } } as AuthenticatedRequest;
            const result = await controller.getAuthInfo(req);
            expect(service.getAuthInfo).toHaveBeenCalledWith(req);
            expect(result).toEqual(mockAuthInfo);
        });
    });
});