import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { User } from 'src/user/entities';
import { Invitation } from './entities';
import { UserActions } from '../actions/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, UserActions, Invitation])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
