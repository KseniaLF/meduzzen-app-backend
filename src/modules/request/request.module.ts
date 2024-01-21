import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
import { User } from '../user/entities';
import { UserRequest } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, UserActions, User, UserRequest]),
  ],
  controllers: [RequestController],
  providers: [RequestService, ActionsService],
})
export class RequestModule {}
