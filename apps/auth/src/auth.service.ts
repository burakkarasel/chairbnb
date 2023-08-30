import { Injectable } from "@nestjs/common";
import { User } from "@app/common";
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
  async signIn(user: User, res: Response): Promise<string> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = await this.signToken(payload);
    // providing expiration for cookie
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow("EXPIRES_IN"),
    );
    // put the token in cookie
    res.cookie("Authentication", token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  async signToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow("SECRET_KEY"),
      expiresIn: `${this.configService.getOrThrow("EXPIRES_IN")}s`,
    });
  }
}
