import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard, LocalAuthGuard } from "./guard";
import { CurrentUser } from "@app/common";
import { UserDocument } from "@app/common";
import { Response } from "express";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async signIn(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(user, res);
    delete user.password;
    res.send(user);
  }

  // this is only for checking if the received RPC is an authorized request
  // it listens to the authenticate message and returns the payload
  @UseGuards(JwtAuthGuard)
  @MessagePattern("authenticate")
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
