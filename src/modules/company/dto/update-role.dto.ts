import { IsEnum, IsUUID } from 'class-validator';
import { Role } from 'src/common/enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}

export class UpdateRoleDataDto extends UpdateRoleDto {
  @IsUUID()
  id: string;
}
