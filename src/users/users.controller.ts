import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hash, genSalt, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { UserRequest } from 'src/types/request.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const existUser = await this.usersService.findByEmail(
      registerUserDto.email,
    );

    if (existUser) throw new ConflictException('Email already here!');

    const user = await this.usersService.createUser({
      ...registerUserDto,
      password: await hash(registerUserDto.password, await genSalt(10)),
    });

    const { password, ...newUser } = user;

    return newUser;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (!user || !(await compare(loginUserDto.password, user.password)))
      throw new UnauthorizedException("Email or password don't success!");

    const token = this.jwtService.sign(
      { id: user.id },
      { secret: this.configService.get('SECRET') },
    );

    const { password, ...newUser } = user;

    return {
      ...newUser,
      token,
    };
  }

  @Get('logout')
  logout() {
    return this.usersService.logout(12);
  }

  @Get('refresh')
  @UseGuards(new JwtGuard(JwtStrategy))
  refresh(@Req() req: UserRequest) {
    const { password, ...user } = req.user;

    return user;
  }

  @Get()
  get() {
    return this.usersService.get();
  }

  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
