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
    userId: string,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
  }

  async findAll(userId: string): Promise<object[]> {
    return this.reservationRepository.find({ userId });
  }

  async findOne(_id: string, userId: string): Promise<object> {
    return this.reservationRepository.findOne({ _id, userId });
  }

  async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
    userId: string,
  ): Promise<object> {
    return this.reservationRepository.findOneAndUpdate(
      { _id, userId },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string, userId: string): Promise<void> {
    return this.reservationRepository.findOneAndDelete({ _id, userId });
  }
}
