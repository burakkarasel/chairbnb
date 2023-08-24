import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaymentCreateChargeDto } from "@app/common";

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern("createCharge")
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
