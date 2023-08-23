import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InvoiceDocument } from "./model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PaymentsRepository extends AbstractRepository<InvoiceDocument> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(InvoiceDocument.name) invoiceModel: Model<InvoiceDocument>,
  ) {
    super(invoiceModel);
  }
}
