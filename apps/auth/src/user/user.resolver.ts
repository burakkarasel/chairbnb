import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CurrentUser, User } from "@app/common";
import { CreateUserDto } from "./dto";
import { Query } from "@nestjs/graphql";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Mutation(() => User)
  createUser(
    @Args("createUserInput")
    createUserInput: CreateUserDto,
  ) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => User)
  findUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }
}
