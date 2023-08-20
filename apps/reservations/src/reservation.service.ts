import { Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationRepository } from "./reservation.repository";
import { ReservationDocument } from "./models";

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: "123",
    });
  }

  async findAll(): Promise<object[]> {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string): Promise<object> {
    return this.reservationRepository.findOne({ _id });
  }

  async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<object> {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string): Promise<void> {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
