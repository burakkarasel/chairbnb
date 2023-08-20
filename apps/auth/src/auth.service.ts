import { Injectable } from "@nestjs/common";
import { UserDocument } from "./user/model/user.model";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, res: Response) {
    const payload: JwtPayload = {
      userId: user._id.toHexString(),
      email: user.email,
    };

    const token = await this.signToken(payload);
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow("EXPIRES_IN"),
    );
    // put the token in cookie
    res.cookie("Authentication", token, {
      httpOnly: true,
      expires,
    });
  }

  async signToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow("SECRET_KEY"),
      expiresIn: `${this.configService.getOrThrow("EXPIRES_IN")}s`,
    });
  }
}
