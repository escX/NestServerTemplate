import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateNullPipe implements PipeTransform<any, any> {
  transform(value: any): any {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    return value;
  }
}
