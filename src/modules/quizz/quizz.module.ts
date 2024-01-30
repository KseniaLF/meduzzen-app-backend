import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question, Quizz } from './entities';
import { Answer } from './entities/answer.entity';
import { Company } from '../company/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Quizz, Question, Answer, Company])],
  controllers: [QuizzController],
  providers: [QuizzService],
})
export class QuizzModule {}
