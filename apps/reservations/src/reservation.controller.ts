import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationDocument } from "./models";

@Controller("api/v1/reservations")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  async findAll(): Promise<object[]> {
    return this.reservationService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<object> {
    return this.reservationService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<object> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.reservationService.remove(id);
  }
}
