import { CurrentUser, Reservation, User } from "@app/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto";
import { Query } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Mutation(() => Reservation)
  async createReservation(
    @Args("createReservationInput")
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: User,
  ): Promise<Observable<Promise<Reservation>>> {
    return this.reservationService.create(createReservationInput, user);
  }

  @Query(() => [Reservation], { name: "reservations" })
  async list(@CurrentUser() user: User): Promise<Reservation[]> {
    return this.reservationService.findAll(user);
  }

  @Query(() => Reservation, { name: "reservation" })
  async findOne(
    @Args("id", { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    return this.reservationService.findOne(id, user);
  }

  @Mutation(() => Reservation)
  async deleteReservation(
    @Args("id", { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.reservationService.remove(id, user);
  }
}
