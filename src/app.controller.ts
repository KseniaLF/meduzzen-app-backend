import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor) // this route will caching
  @CacheKey('health_check') // example of caching
  async healthCheck(): Promise<string> {
    console.log('Not from cache');
    return this.appService.healthCheck();
  }
}
