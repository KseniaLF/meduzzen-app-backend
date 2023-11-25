import { HttpStatus } from '@nestjs/common';

export interface IRes {
  status_code: HttpStatus;
  detail: string;
  result: string;
}
