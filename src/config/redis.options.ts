import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async () => ({
    isGlobal: true,
    store: await redisStore({
      socket: {
        host: 'localhost',
        port: 6379,
      },
      ttl: 10, // seconds
    }),
  }),
  inject: [ConfigService],
};
