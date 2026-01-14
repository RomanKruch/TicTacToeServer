import { IsEmail, Min } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @Min(6, { message: 'Password must be longer then 6 symbols' })
  password: string;
}