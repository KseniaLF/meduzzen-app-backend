import { IsEnum } from 'class-validator';
import { Status } from '../entities';

export class UpdateVisibilityDto {
  @IsEnum(Status)
  status: Status;
}
