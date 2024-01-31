import { CompanyService } from 'src/modules/company/company.service';
import { Company } from 'src/modules/company/entities';
import { QuizResult } from 'src/modules/quiz-result/entities';
import { QuizResultService } from 'src/modules/quiz-result/quiz-result.service';
import { Question, Quizz } from 'src/modules/quizz/entities';
import { Answer } from 'src/modules/quizz/entities/answer.entity';
import { QuizzService } from 'src/modules/quizz/quizz.service';
import { Auth, User } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/user.service';
import { PaginationService } from '../service/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

export const entities = [
  QuizResult,
  Question,
  Answer,
  Quizz,
  Company,
  User,
  Auth,
];

export const imports = [TypeOrmModule.forFeature([...entities])];

export const providers = [
  QuizResultService,
  QuizzService,
  UserService,
  PaginationService,
  CompanyService,
  JwtService,
];
