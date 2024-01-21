import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities';
import { User } from '../../user/entities';
import { PaginationService } from 'src/common/service/pagination.service';
import { Invitation } from '../invitation/entities';
import { UserActions } from '../actions/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, UserActions, Invitation])],
  controllers: [CompanyController],
  providers: [CompanyService, PaginationService],
})
export class CompanyModule {}
