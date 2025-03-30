import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, RefreshTokenDto } from 'src/dto/auth.dto';
import { AuthGuard } from './auth.guard';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register') // .*/api/auth/student/register
  async postStudentRegistration(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.email,
      createUserDto.password,
      false,
    );
  }

  @Post('student/login') // .*/api/auth/student/login
  async postStudentLogin(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto.email, createUserDto.password);
  }

  // For future reference:
  // The idea here is that each role has their own route for oauth logins.
  // This way, people can't just create faculty accounts. However, given their email exists in the database, they should have no problem logging in.
  // There were stubs here, but they were removed. This will likely work a bit differently than previously intended.

  @UseGuards(AuthGuard)
  @Get('')
  async getAuthInfo(@Request() req: Request) {
    return this.authService.getAuthInfo(req);
  }

  // This route refreshes the JWT.
  @Post('') // .*/api/auth
  async postRefresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshJWT(refreshTokenDto.session);
  }
}
