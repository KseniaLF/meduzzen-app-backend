import { Length } from 'class-validator';

export class UpdateUserDto {
  @Length(1, 20)
  name: string;
}
