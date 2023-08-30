import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateUserDto, RoleDto } from "./dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcryptjs";
import { Logger } from "@nestjs/common";
import { Role, User } from "@app/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUser: CreateUserDto): Promise<User> {
    await this.validateUserCreateDto(createUser);
    const userToCreate = new User({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
      roles: createUser.roles?.map((r: RoleDto) => new Role({ ...r })),
    });
    const user = await this.userRepository.create(userToCreate);
    delete user.password;
    return user;
  }

  private async validateUserCreateDto(createUser: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUser.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException("Credentials are already taken");
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      this.logger.warn(`${email} tried to log in to a non-existing account`);
      throw new UnauthorizedException("User not found with given credentials");
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      this.logger.warn(`${email} tried to log in with invalid password`);
      throw new UnauthorizedException("User not found with given credentials");
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.userRepository.findOne({ id }, { roles: true });
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }
}
