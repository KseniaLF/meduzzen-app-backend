import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from './entities/auth.entity';
import { PaginationService } from 'src/common/service/pagination.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth]),
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  exports: [PassportModule],
  controllers: [UserController],
  providers: [UserService, PaginationService, JwtStrategy],
})
export class UserModule {}
