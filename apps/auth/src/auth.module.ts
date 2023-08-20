import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "./user/user.module";
import { LoggerModule } from "@app/common/logger";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { JwtStrategy, LocalStrategy } from "./strategy";

@Module({
  imports: [
    UserModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        EXPIRES_IN: Joi.number().required(),
        PORT: Joi.number().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("SECRET_KEY"),
        signOptions: {
          expiresIn: `${configService.getOrThrow("EXPIRES_IN")}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
