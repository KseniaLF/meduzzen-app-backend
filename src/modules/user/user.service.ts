import { SignInDto } from './dto/sign-in.dto';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly paginationService: PaginationService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) throw new ConflictException('This email already exists');

    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
    });

    await this.authRepository.save({
      user,
      passwordHash: await argon2.hash(createUserDto.password),
    });

    return 'User created successfully';
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOneBy({ email });
    const auth = await this.authRepository.findOne({
      relations: ['user'],
      where: { user: { email } },
    });

    const isPasssMatch = await argon2.verify(auth.passwordHash, password);
    if (!isPasssMatch) throw new UnauthorizedException();

    const payload = { sub: user.id, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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

  async findUserByEmail(email: string): Promise<User> {
    const existUser = await this.userRepository.findOneBy({ email });
    if (!existUser) throw new NotFoundException('User not found');
    return existUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const existUser = await this.findOne(id);
    if (!existUser) throw new NotFoundException('User not found');

    await this.userRepository.update(id, {
      name: updateUserDto.name,
    });

    return 'User updated successfully';
  }

  async remove(id: string): Promise<string> {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) throw new NotFoundException('User not found');

    await this.userRepository.delete(id);
    return 'User deleted successfully';
  }
}
