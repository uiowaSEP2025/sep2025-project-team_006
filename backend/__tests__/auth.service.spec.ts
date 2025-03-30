import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Student } from 'src/entity/student.entity';
import { Faculty } from 'src/entity/faculty.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let userRepo: Repository<User>;
    let sessionRepo: Repository<Session>;
    let studentRepo: Repository<Student>;
    let facultyRepo: Repository<Faculty>;
    let jwtService: JwtService;

    const fakeUser = {
        user_id: 1,
        email: 'test@example.com',
        password_digest: 'hashedpassword',
        sessions: [],
    } as unknown as User;

    // Provide extra properties to match Session entity shape.
    const fakeSessionFull = {
        id: 1,
        session_token: 'faketoken',
        user: fakeUser,
        created_at: new Date(),
        updated_at: new Date(),
    } as Session;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn((dto) => dto),
                        save: jest.fn(async (dto) => dto),
                    },
                },
                {
                    provide: getRepositoryToken(Session),
                    useValue: {
                        create: jest.fn((dto) => dto),
                        save: jest.fn(async (dto) => dto),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Student),
                    useValue: {
                        create: jest.fn(() => ({})),
                        save: jest.fn(async (dto) => dto),
                    },
                },
                {
                    provide: getRepositoryToken(Faculty),
                    useValue: {
                        create: jest.fn(() => ({})),
                        save: jest.fn(async (dto) => dto),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(async (payload) => 'jwt-token'),
                        verifyAsync: jest.fn(async (token, options) => {
                            if (token === 'valid-token') return { id: 1, email: fakeUser.email };
                            throw new Error('Invalid token');
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepo = module.get<Repository<User>>(getRepositoryToken(User));
        sessionRepo = module.get<Repository<Session>>(getRepositoryToken(Session));
        studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
        facultyRepo = module.get<Repository<Faculty>>(getRepositoryToken(Faculty));
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('register', () => {
        it('should throw error if user already exists', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(fakeUser);
            await expect(
                service.register('test@example.com', 'password', false),
            ).rejects.toThrow(Error);
        });

        it('should register a new student', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hashSync').mockReturnValue('digest');
            jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue("10");

            const result = await service.register('new@example.com', 'password', false);
            expect(result).toHaveProperty('token', 'jwt-token');
            expect(result).toHaveProperty('session');
            expect(userRepo.create).toHaveBeenCalled();
            expect(userRepo.save).toHaveBeenCalled();
            expect(studentRepo.create).toHaveBeenCalled();
            expect(studentRepo.save).toHaveBeenCalled();
        });

        it('should register a new faculty', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hashSync').mockReturnValue('digest');
            jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue("10");

            const result = await service.register('faculty@example.com', 'password', true);
            expect(result).toHaveProperty('token', 'jwt-token');
            expect(result).toHaveProperty('session');
            expect(userRepo.create).toHaveBeenCalled();
            expect(userRepo.save).toHaveBeenCalled();
            expect(facultyRepo.create).toHaveBeenCalled();
            expect(facultyRepo.save).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            await expect(service.login('nonexistent@example.com', 'password')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password does not match', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(fakeUser);
            // Override bcrypt.compare to return false.
            jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
            await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
        });

        it('should login successfully with valid credentials', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(fakeUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
            const result = await service.login('test@example.com', 'password');
            expect(result).toHaveProperty('token', 'jwt-token');
            expect(result).toHaveProperty('session');
        });
    });

    describe('createJWT', () => {
        it('should return a JWT token', async () => {
            const token = await service.createJWT(fakeUser);
            expect(token).toEqual('jwt-token');
            expect(jwtService.signAsync).toHaveBeenCalledWith({ id: fakeUser.user_id, email: fakeUser.email });
        });
    });

    describe('refreshJWT', () => {
        it('should refresh JWT if session exists', async () => {
            // Provide a valid session record with additional properties.
            const sessionRecord = {
                id: 1,
                session_token: 'valid-session',
                user: fakeUser,
                created_at: new Date(),
                updated_at: new Date(),
            } as Session;
            jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(sessionRecord);
            const result = await service.refreshJWT('valid-session');
            expect(result).toHaveProperty('token', 'jwt-token');
        });

        it('should throw UnauthorizedException if session not found', async () => {
            jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(null);
            await expect(service.refreshJWT('invalid-session')).rejects.toThrow(UnauthorizedException);
        });
    });
});
