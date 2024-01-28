import { Length } from 'class-validator';

export class UpdateRequestDto {
  @Length(1, 200)
  message: string;
}
