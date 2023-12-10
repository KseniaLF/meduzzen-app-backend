import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from './entities/auth.entity';
import { User } from './entities/user.entity';
import { PaginationOptions, PaginationResult } from 'src/common/interfaces';
import { PaginationService } from 'src/common/service/pagination.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
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

    return 'User created successfully';
  }

  async findAll(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<User>> {
    return this.paginationService.findAll(
      this.userRepository,
      paginationOptions,
    );
  }

  async findOne(id: string): Promise<User> {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) throw new NotFoundException('User not found');
    return existUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const existUser = await this.findOne(id);
    if (!existUser) throw new NotFoundException('User not found');

    await this.userRepository.update(id, {
      email: updateUserDto.email,
    });

    return 'User updated successfully';
  }

  async remove(id: string): Promise<string> {
    await this.userRepository.delete(id);
    return 'User deleted successfully';
  }
}
