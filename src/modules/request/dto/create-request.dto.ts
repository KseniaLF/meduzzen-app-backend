import { IsOptional, IsUUID, Length } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  companyId: string;

  @Length(1, 200)
  @IsOptional()
  message?: string;
}

export interface SendRequestParams extends CreateRequestDto {
  userEmail: string;
}
