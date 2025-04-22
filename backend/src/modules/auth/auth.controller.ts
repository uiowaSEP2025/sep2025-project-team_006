import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from 'src/dto/auth.dto';
import { AuthenticatedRequest, AuthGuard } from './auth.guard';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register') // .*/api/auth/student/register
  async postStudentRegistration(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(
      registerUserDto.first_name,
      registerUserDto.last_name,
      registerUserDto.phone_number,
      registerUserDto.email,
      registerUserDto.password,
      false,
    );
  }

  @Post('student/login') // .*/api/auth/student/login
  async postStudentLogin(@Body() createUserDto: LoginDto) {
    return this.authService.login(createUserDto.email, createUserDto.password);
  }

  // For future reference:
  // The idea here is that each role has their own route for oauth logins.
  // This way, people can't just create faculty accounts. However, given their email exists in the database, they should have no problem logging in.
  // There were stubs here, but they were removed. This will likely work a bit differently than previously intended.

  @UseGuards(AuthGuard)
  @Get('')
  async getAuthInfo(@Request() req: AuthenticatedRequest) {
    return this.authService.getAuthInfo(req);
  }

  // This route refreshes the JWT.
  @Post('') // .*/api/auth
  async postRefresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshJWT(refreshTokenDto.session);
  }
}
