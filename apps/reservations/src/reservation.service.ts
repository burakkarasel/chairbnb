import { Inject, Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationRepository } from "./reservation.repository";
import { ReservationDocument } from "./models";
import { PAYMENT_SERVICE, UserDto } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, map } from "rxjs";
import { FlattenMaps } from "mongoose";

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ): Promise<Observable<Promise<ReservationDocument>>> {
    const payload = { ...createReservationDto.charge, email, userId };
    return this.paymentService.send("createCharge", payload).pipe(
      map(async (res) => {
        return this.reservationRepository.create({
          ...createReservationDto,
          timestamp: new Date(),
          userId,
          invoiceId: res._id,
        });
      }),
    );
  }

  async findAll(userId: string): Promise<FlattenMaps<ReservationDocument>[]> {
    return this.reservationRepository.find({ userId });
  }

  async findOne(
    _id: string,
    userId: string,
  ): Promise<FlattenMaps<ReservationDocument>> {
    return this.reservationRepository.findOne({ _id, userId });
  }

  async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
    userId: string,
  ): Promise<FlattenMaps<ReservationDocument>> {
    return this.reservationRepository.findOneAndUpdate(
      { _id, userId },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string, userId: string): Promise<void> {
    return this.reservationRepository.findOneAndDelete({ _id, userId });
  }
}
