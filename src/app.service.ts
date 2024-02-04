import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly logger = new Logger(AppService.name);

  async healthCheck(): Promise<string> {
    // await this.cacheManager.set('cached_item', { key: 32 }, 10);
    // await this.cacheManager.del('cached_item');

    // const cachedItem = await this.cacheManager.get('cached_item');
    // console.log(cachedItem);

    this.logger.log('testing health check');
    return 'ok';
  }
}
