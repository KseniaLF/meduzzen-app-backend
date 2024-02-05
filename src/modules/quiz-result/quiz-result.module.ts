import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { imports, providers } from 'src/common/constants/module.const';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'src/config/redis.options';

@Module({
  imports: [...imports, CacheModule.registerAsync(RedisOptions)],
  controllers: [QuizResultController],
  providers,
})
export class QuizResultModule {}
