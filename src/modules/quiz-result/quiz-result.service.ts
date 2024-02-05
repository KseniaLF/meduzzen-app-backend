import { Injectable } from '@nestjs/common';
import {
  CreateQuizResultDataDto,
  CreateQuizResultDataDtoI,
} from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { QuizzService } from '../quizz/quizz.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizResult } from './entities';
import { Repository } from 'typeorm';
import { RedisService } from 'src/common/service';

@Injectable()
export class QuizResultService {
  constructor(
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,

    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly quizzService: QuizzService,
    private readonly redisService: RedisService,
  ) {}

  async sendAnswer(createQuizResultDto: CreateQuizResultDataDtoI) {
    const { email, quizId, answers } = createQuizResultDto;

    await this.quizzService.findOne(quizId);

    const key = `${email}:${quizId}`;

    this.redisService.setCache({ key, value: { email, ...answers } });
    const data = await this.redisService.getCache(key);
    return data;
  }

  async create(createQuizResultDto: CreateQuizResultDataDto) {
    const { email, quizId, correctAnswers } = createQuizResultDto;

    const quiz = await this.quizzService.findOne(quizId);
    if (correctAnswers > quiz.questions.length) {
      const message = 'More answers than allowed';
      return { message };
    }

    const user = await this.userService.findUserByEmail(email);
    const company = await this.companyService.findOne(quiz.company.id);

    const res = await this.quizResultRepository.save({
      user,
      correctAnswers,
      company,
      quiz,
    });

    return res;
  }

  findAll() {
    return `This action returns all quizResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizResult`;
  }

  update(id: number, updateQuizResultDto: UpdateQuizResultDto) {
    return `This action updates a #${id} quizResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizResult`;
  }
}
