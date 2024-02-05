import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { LoggerModule } from 'src/common/module';

export const RedisOptions: CacheModuleAsyncOptions = {
  imports: [LoggerModule],
  useFactory: async () => {
    const logger = new Logger('Redis');

    try {
      const store = await redisStore({
        socket: {
          host: 'localhost',
          port: 6379,
        },
        ttl: 10, // seconds
      });

      logger.log('Successful connection to Redis👍🎉');

      return {
        isGlobal: true,
        store: store || {},
      };
    } catch (e) {
      logger.error(e);
      logger.error(
        'Failed to connect to Redis. Application will continue without using Redis.',
      );
      return {};
    }
  },
  inject: [Logger],
};
