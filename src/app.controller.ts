import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CacheTTL(10) // not work
  @CacheKey('health_check0') // example of caching
  @UseInterceptors(CacheInterceptor) // this route will caching
  async healthCheck(): Promise<string> {
    console.log('Not from cache');
    return this.appService.healthCheck();
  }
}
