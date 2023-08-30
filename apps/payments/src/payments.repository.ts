import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Invoice } from "@app/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PaymentsRepository extends AbstractRepository<Invoice> {
  protected readonly logger = new Logger();
  constructor(
    @InjectRepository(Invoice) paymentRepository: Repository<Invoice>,
    entityManager: EntityManager,
  ) {
    super(paymentRepository, entityManager);
  }
}
