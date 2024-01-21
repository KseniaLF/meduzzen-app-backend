import { IsEmail, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  invitedUserEmail: string;

  @IsUUID()
  companyId: string;

  @Length(1, 200)
  @IsOptional()
  message?: string;
}

export interface SendInvitationParams extends CreateInvitationDto {
  ownerEmail: string;
}
