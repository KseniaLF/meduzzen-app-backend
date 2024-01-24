import { IsEmail, IsUUID } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email: string;
}

export class DeleteUSerDto extends EmailDto {
  @IsUUID()
  id: string;
}
