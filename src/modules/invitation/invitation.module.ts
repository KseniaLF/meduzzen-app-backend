import { Participant } from 'src/modules/participant/entities/participant.entity';
import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { User } from 'src/modules/user/entities';
import { Invitation } from './entities';
import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
import { ParticipantService } from '../participant/participant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participant,
      Company,
      User,
      UserActions,
      Invitation,
    ]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, ActionsService, ParticipantService],
})
export class InvitationModule {}
