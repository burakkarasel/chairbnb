import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CreateChargeDto } from "@app/common";
import { PaymentsRepository } from "./payments.repository";
import { InvoiceDocument } from "./model";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
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
  }: CreateChargeDto): Promise<InvoiceDocument> {
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

    return invoice;
  }
}
