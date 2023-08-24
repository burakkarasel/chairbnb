import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import {
  DatabaseModule,
  LoggerModule,
  NOTIFICATION_SERVICE,
} from "@app/common";
import { InvoiceDocument, InvoiceSchema } from "./model";
import { PaymentsRepository } from "./payments.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: InvoiceDocument.name,
        schema: InvoiceSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow("NOTIFICATIONS_HOST"),
            port: configService.getOrThrow("NOTIFICATIONS_PORT"),
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
