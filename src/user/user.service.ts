import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from './entities/auth.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) throw new BadRequestException('This email already exists');

    const user = await this.userRepository.save({
      email: createUserDto.email,
    });

    await this.authRepository.save({
      user,
      passwordHash: await argon2.hash(createUserDto.password),
    });
  }

  async findAll() {
    const users = await this.userRepository.find();
    return { users };
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
