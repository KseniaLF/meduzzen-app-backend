import { Length } from 'class-validator';

export class CreateCompanyDto {
  @Length(1, 20)
  name: string;

  @Length(1, 200)
  description: string;
}
