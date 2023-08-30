import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "../dto";

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): User | string => {
    const req = ctx.switchToHttp().getRequest();
    // if field is provided we return the specified field, otherwise we return the whole object
    return data ? req.user[data] : req.user;
  },
);
