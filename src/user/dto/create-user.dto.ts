import { IsEmail, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @Length(1, 20)
  name: string;
}
