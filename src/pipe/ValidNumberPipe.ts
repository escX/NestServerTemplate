import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateNumberPipe implements PipeTransform<any, number> {
  transform(value: any): number {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException('缺少参数');
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException('参数格式错误');
    }

    return parsedValue;
  }
}
