import { IsEmail, IsNotEmpty, IsHexadecimal } from 'class-validator';

class CreateUserDto {
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

export { CreateUserDto, RefreshTokenDto };
