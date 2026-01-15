import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Mine = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user[data];
});
