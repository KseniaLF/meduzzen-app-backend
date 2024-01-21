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
import { Company } from '../modules/company/entities/company.entity';
import { Invitation } from '../modules/invitation/entities';
import { UserRequest } from '../modules/request/entities';
import { UserActions } from 'src/modules/actions/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Auth,
      UserActions,
      Company,
      Invitation,
      UserRequest,
    ]),
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '200m' },
    }),
  ],
  exports: [PassportModule],
  controllers: [UserController],
  providers: [UserService, PaginationService, JwtStrategy],
})
export class UserModule {}
