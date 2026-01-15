import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
const { getClientIp } = require('request-ip');

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // 日志记录
    this.logger.error('[ExceptionFilter]', {
      headers: request.headers,
      query: request.query,
      param: request.param,
      body: request.body,
      timestamp: new Date().toISOString(),
      ip: getClientIp(request),
      exception: exception,
    });

    // 响应客户端
    const defaultResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: '服务器出错了！',
      error: exception instanceof Error ? exception.message : 'Internal Server Error',
    };
    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      const body = typeof responseBody === 'string' ? { message: responseBody } : responseBody;

      httpAdapter.reply(
        response,
        {
          ...defaultResponse,
          ...body,
        },
        exception.getStatus()
      );
    } else {
      httpAdapter.reply(response, defaultResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
