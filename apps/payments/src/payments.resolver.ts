import { CurrentUser, Invoice, User } from "@app/common";
import { Query, Resolver } from "@nestjs/graphql";
import { PaymentsService } from "./payments.service";

@Resolver(() => Invoice)
export class PaymentsResolver {
  constructor(private readonly paymentService: PaymentsService) {}

  @Query(() => [Invoice], { name: "payments" })
  listInvoices(@CurrentUser() user: User) {
    return this.paymentService.listInvoices(user);
  }
}
