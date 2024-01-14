import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof QueryFailedError) {
      return response.status(500).json({
        status_code: 500,
        detail: {
          message: 'Internal Server Error',
          error: exception.message,
        },
        result: 'error',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      response.status(status).json({
        status_code: status,
        detail: {
          message: res?.['message'] || 'Internal Server Error',
          error: res?.['error'],
        },
        result: 'error',
      });
    }
  }
}
