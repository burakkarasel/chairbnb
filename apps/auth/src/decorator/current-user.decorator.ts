import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "../user/model/user.model";

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | UserDocument => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.user[data];
    }
    return req.user;
  },
);
