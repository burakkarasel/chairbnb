import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../guard";
import { CurrentUser } from "@app/common";

@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserById(@CurrentUser("_id") id: string) {
    return this.userService.findById(id);
  }
}
