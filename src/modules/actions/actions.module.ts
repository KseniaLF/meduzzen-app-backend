import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';

import { User } from 'src/modules/user/entities';
import { Invitation } from 'src/modules/invitation/entities';
import { Company } from 'src/modules/company/entities';
import { UserRequest } from 'src/modules/request/entities';
import { UserActions } from './entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserActions,
      User,
      Company,
      Invitation,
      UserRequest,
    ]),
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
