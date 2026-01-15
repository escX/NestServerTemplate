// timestamp.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimestampInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 递归函数将对象中的 Date 转换为时间戳
        const convertDatesToTimestamps = (obj: any): any => {
          if (obj === null || obj === undefined) {
            return obj;
          }

          if (obj instanceof Date) {
            return obj.getTime();
          }

          if (Array.isArray(obj)) {
            return obj.map(convertDatesToTimestamps);
          }

          if (typeof obj === 'object') {
            const convertedObj: any = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                convertedObj[key] = convertDatesToTimestamps(obj[key]);
              }
            }
            return convertedObj;
          }

          return obj;
        };

        return convertDatesToTimestamps(data);
      })
    );
  }
}
