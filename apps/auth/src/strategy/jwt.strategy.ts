import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
import { Request } from "express";
import { JwtPayload } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies.Authentication,
      ]),
      secretOrKey: configService.getOrThrow("SECRET_KEY"),
    });
  }

  async validate({ userId }: JwtPayload) {
    return this.userService.findById(userId);
  }
}
