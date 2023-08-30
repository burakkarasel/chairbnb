import { Inject, Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationRepository } from "./reservation.repository";
import { Reservation } from "@app/common";
import { PAYMENT_SERVICE, User } from "@app/common";
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
    user: User,
  ): Promise<Observable<Promise<Reservation>>> {
    const payload = {
      ...createReservationDto.charge,
      email: user.email,
      user,
    };
    return this.paymentService.send("createCharge", payload).pipe(
      map(async (res) => {
        const reservationToCreate = new Reservation({
          ...createReservationDto,
          timestamp: new Date(),
          user,
          invoice: res,
        });
        return this.reservationRepository.create(reservationToCreate);
      }),
    );
  }

  async findAll(user: User): Promise<Reservation[]> {
    return this.reservationRepository.find(
      { user: { id: user.id } },
      { user: true },
    );
  }

  async findOne(id: string, user: User): Promise<Reservation> {
    return this.reservationRepository.findOne(
      { id, user: { id: user.id } },
      { user: true, invoice: true },
    );
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
    user: User,
  ): Promise<Reservation> {
    return this.reservationRepository.findOneAndUpdate(
      { id, user: { id: user.id } },
      updateReservationDto,
    );
  }

  async remove(id: string, user: User): Promise<void> {
    return this.reservationRepository.findOneAndDelete({
      id,
      user: { id: user.id },
    });
  }
}
