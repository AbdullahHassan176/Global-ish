import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@global-next/types';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext): User | any => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    return data ? user?.[data] : user;
  },
);
