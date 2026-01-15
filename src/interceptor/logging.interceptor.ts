import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    this.logger.log(`[${request.method}] ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Response time: ${Date.now() - startTime}ms`);
      })
    );
  }
}
