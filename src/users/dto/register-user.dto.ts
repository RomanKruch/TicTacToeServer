import { IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @MinLength(3, { message: 'Username must be longer then 3 symbols' })
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be longer then 6 symbols' })
  password: string;
}