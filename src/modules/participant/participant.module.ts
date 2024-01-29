import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { Participant } from 'src/modules/participant/entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { User } from 'src/modules/user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, Company, User])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
