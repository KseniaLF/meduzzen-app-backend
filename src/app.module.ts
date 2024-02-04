import { CONNECTION } from './config/db.connection';
import { Logger, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AppLoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { CompanyModule } from './modules/company/company.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { RequestModule } from './modules/request/request.module';
import { ActionsModule } from './modules/actions/actions.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { Company } from './modules/company/entities';
import { QuizzModule } from './modules/quizz/quizz.module';
import { QuizResultModule } from './modules/quiz-result/quiz-result.module';

import {
  CacheInterceptor,
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
  CacheStoreFactory,
} from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';
import { redisStore } from 'cache-manager-redis-store';

// export interface CacheManagerOptions {
//   store?: string | CacheStoreFactory | CacheStore;
//   ttl?: number;
//   max?: number;
//   isCacheableValue?: (value: any) => boolean;
// }
export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: 'localhost',
        port: 6379,
      },
      ttl: 20, // seconds
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),

    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...CONNECTION,

      synchronize: false,
      autoLoadEntities: true,
    }),

    UserModule,
    CompanyModule,
    InvitationModule,
    RequestModule,
    ActionsModule,
    ParticipantModule,
    QuizzModule,
    QuizResultModule,

    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // { // this is for caching every get-request in app
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
