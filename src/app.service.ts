
import { Injectable, HttpStatus } from '@nestjs/common';
import { IRes } from './common/interfaces';

@Injectable()
export class AppService {
  async healthCheck(): Promise<IRes> {
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
