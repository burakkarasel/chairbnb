import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import {
  DatabaseModule,
  LoggerModule,
  NOTIFICATION_SERVICE,
  Invoice,
  User,
  Role,
  Reservation,
  Notification,
} from "@app/common";
import { PaymentsRepository } from "./payments.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { PaymentsResolver } from "./payments.resolver";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([Invoice, User, Role, Notification, Reservation]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "notifications",
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PaymentsResolver],
})
export class PaymentsModule {}
