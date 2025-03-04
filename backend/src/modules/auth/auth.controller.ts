import { Controller, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register') // .*/api/auth/register
  async postStudentRegistration(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    return this.authService.register(email, password, false);
  }

  @Post('student/login') // .*/api/auth/login
  async postStudentLogin(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('student/oauth')
  async postStudentOauthCallback() {
    return;
  }

  @Post('faculty/oauth')
  async postFacultyOauthCallback() {
    return;
  }
}
