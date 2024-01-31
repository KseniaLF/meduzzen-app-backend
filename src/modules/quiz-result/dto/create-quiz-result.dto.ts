import { IsEmail, IsInt, IsUUID } from 'class-validator';

export class CreateQuizResultDto {
  @IsInt()
  correctAnswers: number;
}

export class CreateQuizResultDataDto extends CreateQuizResultDto {
  @IsEmail()
  email: string;

  @IsUUID()
  quizId: string;
}
