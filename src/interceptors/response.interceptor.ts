import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

const STATUS_TO_IGNORE = [
  HttpStatus.UNAUTHORIZED,
  HttpStatus.NOT_FOUND,
  HttpStatus.BAD_REQUEST,
];

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> | Promise<Observable<any>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    if (STATUS_TO_IGNORE.includes(statusCode)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
