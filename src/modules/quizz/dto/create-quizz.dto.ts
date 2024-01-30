import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateQuizzDto {
  @Length(1, 20)
  name: string;

  @Length(1, 200)
  description: string;

  @IsEmail()
  ownerEmail: string;
}

export class AnswerDto {
  @Length(1, 100)
  answerText: string;

  @IsBoolean()
  @IsOptional()
  isCorrect: string;
}

export class QuestionDto {
  @Length(1, 100)
  question: string;

  answers: AnswerDto[];
}

export class CreateQuizzDataDto extends CreateQuizzDto {
  @IsUUID()
  companyId: string;

  questions: QuestionDto[];
}
