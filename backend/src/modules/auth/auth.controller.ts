import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, RefreshTokenDto } from 'src/dto/auth.dto';
import { AuthGuard } from './auth.guard';

/**
 * Job: These routes are for user authentication.
 */
@Controller('api/auth') // .*/api/auth/.*
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('student/register') // .*/api/auth/register
  async postStudentRegistration(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.email,
      createUserDto.password,
      false,
    );
  }

  @Post('student/login') // .*/api/auth/login
  async postStudentLogin(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto.email, createUserDto.password);
  }

  // The idea here is that each role has their own route for oauth logins.
  // This way, people can't just create faculty accounts. However, given their email exists in the database, they should have no problem logging in.

  /* eslint-disable @typescript-eslint/require-await */
  @Post('student/oauth')
  async postStudentOauthCallback() {
    return;
  }

  @Post('faculty/oauth')
  async postFacultyOauthCallback() {
    return;
  }
  /* eslint-enable @typescript-eslint/require-await */

  @UseGuards(AuthGuard)
  @Post('refresh')
  async postRefresh(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshJWT(req, refreshTokenDto.session);
  }
}
