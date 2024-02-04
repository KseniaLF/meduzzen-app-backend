import { IsEmail, IsInt, IsUUID, Min } from 'class-validator';

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
