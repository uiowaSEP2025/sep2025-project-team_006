import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Taken from documentation; https://docs.nestjs.com/security/authentication#implementing-the-authentication-guard

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: object = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload; // We're assigning the payload to the request object here, so that we can access it in our route handlers
    } catch {
      // Slight hack. Check if the token is expired, then throw a unique HTTP code.
      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
      } catch {
        // Malormed token. Bad stuff.
        throw new UnauthorizedException();
      }

      if (payload.exp < (Date.now() / 1000)) {
        throw new ConflictException("Expired JWT");
      } else {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// Interface representing a request with the authentication object.
// Keys are defined in ./auth.service.ts:AuthService/createJWT
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export { AuthGuard, AuthenticatedRequest };
