import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async healthCheck(): Promise<string> {
    this.logger.log('testing health check');
    return 'ok';
  }
}
