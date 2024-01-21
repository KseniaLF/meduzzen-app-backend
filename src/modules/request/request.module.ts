import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { UserActions } from 'src/user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company, UserActions])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
