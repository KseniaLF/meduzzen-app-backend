import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateQuizResultDto {
  @IsInt()
  @Min(0)
  correctAnswers: number;
}

export class CreateQuizResultDataDto extends CreateQuizResultDto {
  @IsEmail()
  email: string;

  @IsUUID()
  quizId: string;
}
export class CreateQuizResultDataDtoI {
  @IsEmail()
  email: string;

  @IsUUID()
  quizId: string;

  @IsArray()
  answers: UserAnswerDTO[];
}

export class UserAnswerDTO {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsBoolean()
  isCorrectAnswer: boolean;
}
