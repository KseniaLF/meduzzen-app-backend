import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IRes } from './common/interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async healthCheck(): Promise<IRes> {
    return this.appService.healthCheck();
  }
}
