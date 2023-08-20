import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard, LocalAuthGuard } from "./guard";
import { CurrentUser } from "@app/common";
import { UserDocument } from "./user/model/user.model";
import { Response } from "express";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(user, res);
    res.send(user);
  }

  // this is only for checking if the received RPC is an authorized request
  // it listens to the authenticate message
  @UseGuards(JwtAuthGuard)
  @MessagePattern("authenticate")
  async authenticate(@Payload() data: any) {
    return data;
  }
}
