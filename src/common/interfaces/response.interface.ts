import { HttpStatus } from '@nestjs/common';

export interface IRes<T = string> {
  status_code: HttpStatus;
  detail: T;
  result: string;
}
