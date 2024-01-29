import { IsEmail, IsUUID } from 'class-validator';

export class CreateParticipantDto {
  @IsEmail()
  email: string;

  @IsUUID()
  companyId: string;
}
