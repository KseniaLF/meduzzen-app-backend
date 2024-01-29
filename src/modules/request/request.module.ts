import { CompanyService } from './../company/company.service';
import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
import { User } from '../user/entities';
import { UserRequest } from './entities';
import { PaginationService } from 'src/common/service/pagination.service';
import { Invitation } from '../invitation/entities';
import { Participant } from '../participant/entities/participant.entity';
import { ParticipantService } from '../participant/participant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participant,
      Company,
      UserActions,
      User,
      UserRequest,
      Invitation,
    ]),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    ActionsService,
    CompanyService,
    ParticipantService,
    PaginationService,
  ],
})
export class RequestModule {}
