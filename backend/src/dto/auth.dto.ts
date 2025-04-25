import { IsEmail, IsNotEmpty, IsHexadecimal } from 'class-validator';

class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

class RefreshTokenDto {
  @IsHexadecimal()
  @IsNotEmpty()
  session: string;
}

// this may be stupid
class LogoutDto extends RefreshTokenDto {}

export { RegisterDto, LoginDto, RefreshTokenDto, LogoutDto };
