import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
