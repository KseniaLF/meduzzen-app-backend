import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizzDataDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Question, Quizz } from './entities';
import { Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { Answer } from './entities/answer.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz)
    private readonly quizzRepository: Repository<Quizz>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    private readonly userService: UserService,

    private readonly companyService: CompanyService,
  ) {}

  async create(createQuizzDto: CreateQuizzDataDto) {
    const { ownerEmail, companyId, description, questions, name } =
      createQuizzDto;

    const owner = await this.userService.findUserByEmail(ownerEmail);
    const company = await this.companyService.findOne(companyId);

    const quizz = await this.quizzRepository.save({
      owner,
      company,
      description,
      name,
      frequencyDays: 1,
    });

    const data = [];

    for (const { question: questionText, answers } of questions) {
      const question = await this.questionRepository.save({
        question: questionText,
        quizz,
      });

      const answerData = await Promise.all(
        answers.map(async ({ answerText, isCorrect = false }) => {
          const answer = await this.answerRepository.save({
            answerText,
            isCorrect,
            question,
          });
          return answer;
        }),
      );

      question.answers = answerData;
      await this.questionRepository.save(question);

      data.push({ ...question, answers: answerData });
    }

    quizz.questions = data;
    const res = await this.quizzRepository.save(quizz);
    console.log(res);

    return 'res';
  }

  async findAll() {
    const data = await this.quizzRepository.find({
      relations: ['questions.answers', 'owner', 'company'],
    });
    return { data };
  }

  findOne(id: number) {
    return `This action returns a #${id} quizz`;
  }

  update(id: number, updateQuizzDto: UpdateQuizzDto) {
    return `This action updates a #${id} quizz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizz`;
  }
}
