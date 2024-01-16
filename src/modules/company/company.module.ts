import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, Invitation } from './entities';
import { User } from '../../user/entities';
import { PaginationService } from 'src/common/service/pagination.service';
import { UserActions } from 'src/user/entities/company-actions.entity';
import { ActivityController } from './controllers/activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, UserActions, Invitation])],
  controllers: [CompanyController, ActivityController],
  providers: [CompanyService, PaginationService],
})
export class CompanyModule {}
