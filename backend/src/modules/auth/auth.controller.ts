import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // .*/api/auth/register
  async postTestData(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Post('login') // .*/api/auth/login
  async putTestData(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}
