import { IsEmail, IsOptional, Length } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  invitedUserEmail: string;

  @Length(1, 200)
  @IsOptional()
  message?: string;
}

// maybe do this as dto?
export interface SendInvitationParams extends CreateInvitationDto {
  ownerEmail: string;
  companyId: string;
}

export const INVITATION_RELATIONS = ['user.user', 'owner', 'company'];
