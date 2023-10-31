import { Injectable } from '@nestjs/common';
import { IRes } from './common/interfaces';

@Injectable()
export class AppService {
  async healthCheck(): Promise<IRes> {
    return {
      status_code: 200,
      detail: 'ok',
      result: 'working',
    };
  }
}
