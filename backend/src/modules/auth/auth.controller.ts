import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register') // .*/api/auth/register
  async postStudentRegistration(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto.email, createUserDto.password, false);
  }

  @Post('student/login') // .*/api/auth/login
  async postStudentLogin(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto.email, createUserDto.password);
  }

  // The idea here is that each role has their own route for oauth logins.
  // This way, people can't just create faculty accounts. However, given their email exists in the database, they should have no problem logging in.

  @Post('student/oauth')
  async postStudentOauthCallback() {
    return;
  }

  @Post('faculty/oauth')
  async postFacultyOauthCallback() {
    return;
  }
}
