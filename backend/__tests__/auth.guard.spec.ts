import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let jwtService: JwtService;

    beforeEach(() => {
        jwtService = {
            verifyAsync: jest.fn(),
        } as any;
        guard = new AuthGuard(jwtService);
    });

    const createMockContext = (authHeader?: string): ExecutionContext => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({ headers: { authorization: authHeader } }),
            }),
        } as any;
    };

    it('should throw UnauthorizedException if no token is provided', async () => {
        const context = createMockContext(undefined);
        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
        (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('Invalid token'));
        const context = createMockContext('Bearer invalid-token');
        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should validate token and attach payload to request', async () => {
        const payload = { id: 1, email: 'test@example.com' };
        (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
        const request: any = {};
        const context = {
            switchToHttp: () => ({
                getRequest: () => request,
            }),
        } as any;
        // Use a valid authorization header.
        request.headers = { authorization: 'Bearer valid-token' };

        const canActivate = await guard.canActivate(context);
        expect(canActivate).toBe(true);
        expect(request.user).toEqual(payload);
    });

    it('should extract token only if "Bearer" is provided', async () => {
        const context = createMockContext('Basic some-token');
        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
});
