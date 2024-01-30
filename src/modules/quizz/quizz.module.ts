import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question, Quizz } from './entities';
import { Answer } from './entities/answer.entity';
import { Company } from '../company/entities';
import { UserService } from '../user/user.service';
import { Auth, User } from '../user/entities';
import { PaginationService } from 'src/common/service/pagination.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quizz, Question, Answer, Company, User, Auth]),
  ],
  controllers: [QuizzController],
  providers: [
    QuizzService,
    UserService,
    PaginationService,
    JwtService,
    CompanyService,
  ],
})
export class QuizzModule {}
