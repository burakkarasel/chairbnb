import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { NOTIFICATION_SERVICE, PaymentCreateChargeDto } from "@app/common";
import { PaymentsRepository } from "./payments.repository";
import { InvoiceDocument } from "./model";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}
  private readonly stripe = new Stripe(
    this.configService.getOrThrow("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2023-08-16",
    },
  );

  async createCharge({
    card,
    amount,
    email,
  }: PaymentCreateChargeDto): Promise<InvoiceDocument> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: "usd",
      payment_method: "pm_card_visa",
      return_url: "https://www.google.com/",
    });

    const invoice = await this.paymentsRepository.create({
      lastFour: card.number.toString().slice(12),
      amount,
      timestamp: new Date(),
      stripeId: paymentIntent.id,
    });

    const text = `Recevied payment for your newly order.\n We charged you ${amount}$, from your card that ends with "${card.number
      .toString()
      .slice(12)}".`;

    this.notificationService.emit("pushEmailNotification", { email, text });

    return invoice;
  }
}
