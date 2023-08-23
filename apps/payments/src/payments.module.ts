import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseModule, LoggerModule } from "@app/common";
import { InvoiceDocument, InvoiceSchema } from "./model";
import { PaymentsRepository } from "./payments.repository";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: InvoiceDocument.name,
        schema: InvoiceSchema,
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
