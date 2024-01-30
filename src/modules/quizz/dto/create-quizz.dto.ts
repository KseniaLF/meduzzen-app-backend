import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateQuizzDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @Length(1, 200)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class AnswerDto {
  @Length(1, 100)
  answerText: string;

  @IsBoolean()
  @IsOptional()
  isCorrect: boolean;
}

export class QuestionDto {
  @Length(1, 100)
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class CreateQuizzDataDto extends CreateQuizzDto {
  @IsUUID()
  companyId: string;

  @IsEmail()
  ownerEmail: string;
}
