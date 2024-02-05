import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SetCacheI } from '../interfaces';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache({ key, value, ttl = 20 }: SetCacheI): Promise<void> {
    // eslint-disable-next-line
    // @ts-ignore
    await this.cacheManager.set(key, value, { ttl });
  }

  async getCache(key: string): Promise<unknown> {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
