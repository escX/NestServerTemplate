import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((data) => {
        if (data instanceof Promise) {
          return from(data).pipe(map((resolvedData) => this.resolvePromises(resolvedData)));
        }
        return of(this.resolvePromises(data));
      })
    );
  }

  private resolvePromises(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.resolvePromises(item));
    } else if (data && typeof data === 'object') {
      return Object.keys(data).reduce((acc: any, key) => {
        acc[key] = this.resolvePromises(data[key]);
        return acc;
      }, {});
    }
    return data;
  }
}
