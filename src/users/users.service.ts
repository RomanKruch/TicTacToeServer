import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  logout(id: number) {
    return `This action returns a #${id} user`;
  }

  refresh() {
    return `This action updates a #${123} user`;
  }

  async get() {
    return await this.userModel.find();
  }

  findByEmail = (email: string) => {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  };

  findById = (id: number) => {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  };

  createUser = (registerUserDto: RegisterUserDto) => {
    return this.userModel.create(registerUserDto);
  };
}
