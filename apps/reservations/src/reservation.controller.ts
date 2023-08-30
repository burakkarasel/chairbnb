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
  UseGuards,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { CurrentUser, Roles, User, Reservation } from "@app/common";
import { Observable } from "rxjs";

@Controller("api/v1/reservations")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() dto: User,
  ): Promise<Observable<Promise<Reservation>>> {
    return this.reservationService.create(createReservationDto, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: User): Promise<Reservation[]> {
    return this.reservationService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    return this.reservationService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    return this.reservationService.update(id, updateReservationDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles("admin")
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.reservationService.remove(id, user);
  }
}
