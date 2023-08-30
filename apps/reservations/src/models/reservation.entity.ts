import { AbstractEntity } from "@app/common/database";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  @CreateDateColumn()
  timestamp: Date;
  @Column({ name: "start_date", type: "timestamptz" })
  startDate: Date;
  @Column({ name: "end_date", type: "timestamptz" })
  endDate: Date;
  @Column({ name: "user_id" })
  userId: string;
  @Column({ name: "place_id" })
  placeId: string;
  @Column({ name: "invoice_id" })
  invoiceId: string;
}
