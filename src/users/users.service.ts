import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  logout(id: number) {
    return `This action returns a #${id} user`;
  }

  refresh() {
    return `This action updates a #${123} user`;
  }

  async get() {
    return await this.userRepository.find();
  }

  findByEmail = (email: string) => {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  };

  findById = (id: number) => {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  createUser = (registerUserDto: RegisterUserDto) => {
    return  this.userRepository.save(registerUserDto);
  }
}
