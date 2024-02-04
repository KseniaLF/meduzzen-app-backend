import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('custom_key') //just for example
  // @CacheTTL(20) // this is already by default
  async healthCheck(): Promise<string> {
    console.log(1);
    return this.appService.healthCheck();
  }
}
