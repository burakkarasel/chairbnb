import { Module } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import {
  DatabaseModule,
  Invoice,
  PAYMENT_SERVICE,
  Reservation,
  Role,
  User,
  Notification,
} from "@app/common";
import { ReservationRepository } from "./reservation.repository";
import { LoggerModule } from "@app/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE } from "@app/common";
import { HealthModule } from "@app/common/health/health.module";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { ReservationsResolver } from "./reservations.resolver";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation, User, Role, Invoice, Notification]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "auth",
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "payments",
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository, ReservationsResolver],
})
export class ReservationModule {}
