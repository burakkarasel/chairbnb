import { Inject, Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationRepository } from "./reservation.repository";
import { Reservation } from "./models";
import { PAYMENT_SERVICE, UserDto } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, map } from "rxjs";

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ): Promise<Observable<Promise<Reservation>>> {
    const payload = { ...createReservationDto.charge, email, userId };
    return this.paymentService.send("createCharge", payload).pipe(
      map(async (res) => {
        const reservationToCreate = new Reservation({
          ...createReservationDto,
          timestamp: new Date(),
          userId,
          invoiceId: res._id,
        });
        return this.reservationRepository.create(reservationToCreate);
      }),
    );
  }

  async findAll(userId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({ userId });
  }

  async findOne(id: string, userId: string): Promise<Reservation> {
    return this.reservationRepository.findOne({ id, userId });
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    return this.reservationRepository.findOneAndUpdate(
      { id, userId },
      updateReservationDto,
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    return this.reservationRepository.findOneAndDelete({ id, userId });
  }
}
