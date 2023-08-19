import { NestFactory } from "@nestjs/core";
import { ReservationModule } from "./reservation.module";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(ReservationModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  await app.listen(8000);
}
bootstrap();
