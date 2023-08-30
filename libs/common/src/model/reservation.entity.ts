import { AbstractEntity } from "@app/common/database";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Invoice, User } from "@app/common";

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  @CreateDateColumn()
  timestamp: Date;
  @Column({ name: "start_date", type: "timestamptz" })
  startDate: Date;
  @Column({ name: "end_date", type: "timestamptz" })
  endDate: Date;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
  @Column({ name: "place_id" })
  placeId: string;
  @OneToOne(() => Invoice, { cascade: true })
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice;
}
