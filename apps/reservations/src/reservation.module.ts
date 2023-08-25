import { Module } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { DatabaseModule, PAYMENT_SERVICE } from "@app/common";
import { ReservationRepository } from "./reservation.repository";
import { ReservationDocument, ReservationSchema } from "./models";
import { LoggerModule } from "@app/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE } from "@app/common";
import { HealthModule } from "@app/common/health/health.module";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
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
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow("AUTH_HOST"),
            port: configService.getOrThrow("AUTH_PORT"),
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow("PAYMENTS_HOST"),
            port: configService.getOrThrow("PAYMENTS_PORT"),
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
