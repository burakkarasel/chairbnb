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
import { ReservationDocument } from "./models";
import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { CurrentUser, Roles, UserDto } from "@app/common";
import { Observable } from "rxjs";

@Controller("api/v1/reservations")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() dto: UserDto,
  ): Promise<Observable<Promise<ReservationDocument>>> {
    return this.reservationService.create(createReservationDto, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser("_id") userId: string): Promise<object[]> {
    return this.reservationService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @CurrentUser("_id") userId: string,
  ): Promise<object> {
    return this.reservationService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser("_id") userId: string,
  ): Promise<object> {
    return this.reservationService.update(id, updateReservationDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles("admin")
  async remove(
    @Param("id") id: string,
    @CurrentUser("_id") userId: string,
  ): Promise<void> {
    await this.reservationService.remove(id, userId);
  }
}
