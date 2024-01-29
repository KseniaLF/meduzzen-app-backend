import { CONNECTION } from './config/db.connection';
import { Logger, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
