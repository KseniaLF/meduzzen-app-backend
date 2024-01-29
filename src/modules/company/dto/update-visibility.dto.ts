import { IsEnum } from 'class-validator';
import { Status } from 'src/common/enum';

export class UpdateVisibilityDto {
  @IsEnum(Status)
  status: Status;
}
