import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateBooleanPipe implements PipeTransform<any, boolean> {
  transform(value: any): boolean {
    if (value === 1 || value === '1' || value === true || value === 'true') {
      return true;
    }

    if (value === 0 || value === '0' || value === false || value === 'false') {
      return false;
    }

    throw new BadRequestException('参数格式错误');
  }
}
