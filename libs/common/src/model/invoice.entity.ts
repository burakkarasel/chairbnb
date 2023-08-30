import { AbstractEntity, Reservation, User } from "@app/common";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column({ name: "last_four" })
  lastFour: string;
  @Column()
  amount: number;
  @Column({ type: "timestamptz" })
  @CreateDateColumn()
  timestamp: Date;
  @Column()
  stripeId: string;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.invoices)
  user: User;
  @OneToOne(() => Reservation, { cascade: true })
  @JoinColumn({ name: "reservation_id" })
  reservation: Reservation;
}
