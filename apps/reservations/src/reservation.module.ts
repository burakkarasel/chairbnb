import { Module } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { DatabaseModule } from "@app/common";
import { ReservationRepository } from "./reservation.repository";
import { ReservationDocument, ReservationSchema } from "./models";
import { LoggerModule } from "@app/common/logger";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
