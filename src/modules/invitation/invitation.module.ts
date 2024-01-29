import { Participant } from 'src/modules/participant/entities/participant.entity';
import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { Auth, User } from 'src/modules/user/entities';
import { Invitation } from './entities';
import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
import { ParticipantService } from '../participant/participant.service';
import { UserService } from '../user/user.service';
import { PaginationService } from 'src/common/service/pagination.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participant,
      Company,
      User,
      UserActions,
      Invitation,
      Auth,
    ]),
  ],
  controllers: [InvitationController],
  providers: [
    InvitationService,
    ActionsService,
    ParticipantService,
    UserService,
    JwtService,
    PaginationService,
  ],
})
export class InvitationModule {}
