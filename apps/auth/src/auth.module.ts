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
import { HealthModule } from "@app/common/health/health.module";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";

@Module({
  imports: [
    UserModule,
    LoggerModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SECRET_KEY: Joi.string().required(),
        EXPIRES_IN: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
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
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
