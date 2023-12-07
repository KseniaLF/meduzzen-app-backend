import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { IRes } from './common/interfaces';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async healthCheck(): Promise<IRes> {
    this.logger.log('testing health check');

    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
