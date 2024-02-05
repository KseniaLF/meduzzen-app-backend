import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SetCacheI } from '../interfaces';

@Injectable()
export class InvitationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache({ key, value, ttl = 1000 }: SetCacheI) {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
  }

  async resetCache() {
    await this.cacheManager.reset();
  }
}
