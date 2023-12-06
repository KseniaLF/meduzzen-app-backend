import { CONNECTION } from './config/db.connection';
import { Logger, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppLoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './common/interceptor/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...CONNECTION,

      synchronize: false,
      autoLoadEntities: true,
    }),

    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
