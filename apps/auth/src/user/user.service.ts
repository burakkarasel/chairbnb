import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcryptjs";
import { Logger } from "@nestjs/common";
import { FlattenMaps } from "mongoose";
import { UserDocument } from "@app/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    await this.validateUserCreateDto(createUserDto);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    delete user.password;
    return user;
  }

  private async validateUserCreateDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException("Credentials are already taken");
  }

  async verifyUser(
    email: string,
    password: string,
  ): Promise<FlattenMaps<UserDocument>> {
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

  async findById(_id: string): Promise<FlattenMaps<UserDocument>> {
    const user = this.userRepository.findOne({ _id });
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }
}
