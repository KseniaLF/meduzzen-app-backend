import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AnswerDto,
  CreateQuizzDataDto,
  QuestionDto,
} from './dto/create-quizz.dto';
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

    quizz.questions = await this.createQuestions(questions, quizz);
    await this.quizzRepository.save(quizz);

    return { message: 'Quizz successfully created' };
  }

  async findAll(id: string) {
    const data = await this.quizzRepository.find({
      relations: ['questions.answers', 'owner', 'company'],
      where: { company: { id } },
    });
    return { data };
  }

  async findOne(id: string) {
    const data = await this.quizzRepository.findOne({
      relations: ['questions.answers', 'owner', 'company'],
      where: { id },
    });
    if (!data) throw new NotFoundException();
    return data;
  }

  private async createQuestion(
    question: string,
    quizz: Quizz,
  ): Promise<Question> {
    const data = await this.questionRepository.save({
      question,
      quizz,
    });
    return data;
  }

  private async createQuestions(
    questions: QuestionDto[],
    quizz: Quizz,
  ): Promise<Question[]> {
    const data = [];

    for (const { question: questionText, answers } of questions) {
      const question = await this.createQuestion(questionText, quizz);
      const answerData = await this.createAnswers(answers, question);

      question.answers = answerData;
      await this.questionRepository.save(question);

      data.push(question);
    }

    return data;
  }

  private async createAnswer(
    answerText: string,
    isCorrect: boolean,
    question: Question,
  ): Promise<Answer> {
    const answer = await this.answerRepository.save({
      answerText,
      isCorrect,
      question,
    });
    return answer;
  }

  private async createAnswers(
    answers: AnswerDto[],
    question: Question,
  ): Promise<Answer[]> {
    const answerData = await Promise.all(
      answers.map(async ({ answerText, isCorrect = false }) => {
        const answer = await this.createAnswer(answerText, isCorrect, question);
        return answer;
      }),
    );
    return answerData;
  }

  private async deleteQuestions(quizz: Quizz): Promise<void> {
    await Promise.all(
      quizz.questions.map(async (question) => {
        await this.questionRepository.delete(question.id);
      }),
    );
  }

  async update(id: string, updateQuizzDto: UpdateQuizzDto) {
    const { description, questions, name } = updateQuizzDto;
    const quizz = await this.findOne(id);

    if (name) quizz.name = name;
    if (description) quizz.description = description;

    if (questions) {
      await this.deleteQuestions(quizz);
      quizz.questions = await this.createQuestions(questions, quizz);
    }

    await this.quizzRepository.save(quizz);

    return { message: 'Quizz successfully updated' };
  }

  async remove(id: string) {
    const quizz = await this.quizzRepository.findOneBy({ id });
    if (!quizz) throw new NotFoundException();
    await this.quizzRepository.delete(id);
    return { message: 'Quizz successfully deleted' };
  }
}
