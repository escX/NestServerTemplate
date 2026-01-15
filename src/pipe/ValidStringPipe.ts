import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateStringPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException('缺少参数');
    }

    return String(value);
  }
}
