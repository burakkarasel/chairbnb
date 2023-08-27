import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
import { JwtPayload } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.authentication,
      ]),
      secretOrKey: configService.getOrThrow("SECRET_KEY"),
    });
  }

  async validate({ userId }: JwtPayload) {
    try {
      return this.userService.findById(userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
