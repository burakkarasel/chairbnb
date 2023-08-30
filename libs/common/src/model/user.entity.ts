import { AbstractEntity } from "@app/common/database";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Role, Reservation, Invoice, Notification } from "@app/common";

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;
  @Column()
  password: string;
  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles?: Role[];
  @Column({ name: "created_at", type: "timestamptz" })
  @CreateDateColumn()
  createdAt: Date;
  @Column({ name: "updated_at", type: "timestamptz" })
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  invoices: Invoice[];
  @OneToMany(() => Notification, (notication) => notication.user, {
    cascade: true,
  })
  notifications: Notification[];
  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservations: Reservation[];
}
