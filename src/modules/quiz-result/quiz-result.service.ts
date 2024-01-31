import { Injectable } from '@nestjs/common';
import { CreateQuizResultDataDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { QuizzService } from '../quizz/quizz.service';

@Injectable()
export class QuizResultService {
  constructor(
    private readonly userService: UserService,

    private readonly companyService: CompanyService,

    private readonly quizzService: QuizzService,
  ) {}

  async create(createQuizResultDto: CreateQuizResultDataDto) {
    const { email, quizId, correctAnswers } = createQuizResultDto;

    const user = await this.userService.findUserByEmail(email);
    const quiz = await this.quizzService.findOne(quizId);
    const company = await this.companyService.findOne(quiz.company.id);

    return { quiz, correctAnswers, user, company };
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
