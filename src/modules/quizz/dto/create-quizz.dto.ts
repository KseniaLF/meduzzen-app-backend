import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsOneCorrectAnswer } from './answer.validator';

export class CreateQuizzDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @Length(1, 200)
  description: string;

  @IsArray()
  @ArrayMinSize(2, {
    message: 'Each quizz must contain at least two questions',
  })
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class CreateQuizzDataDto extends CreateQuizzDto {
  @IsUUID()
  companyId: string;

  @IsEmail()
  ownerEmail: string;
}

export class QuestionDto {
  @Length(1, 100)
  question: string;

  @IsArray()
  @ArrayMinSize(2, {
    message: 'Each question must contain at least two answers',
  })
  @Validate(IsOneCorrectAnswer) // to add option to select multiple answers - remove this validator
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class AnswerDto {
  @Length(1, 100)
  answerText: string;

  @IsBoolean()
  @IsOptional()
  isCorrect: boolean = false;
}
