import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDto } from "../dto";

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserDto | string => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.user[data];
    }
    return req.user;
  },
);
