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
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  @CreateDateColumn()
  @Field()
  timestamp: Date;
  @Column({ name: "start_date", type: "timestamptz" })
  @Field()
  startDate: Date;
  @Column({ name: "end_date", type: "timestamptz" })
  @Field()
  endDate: Date;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.reservations)
  @Field(() => User, { nullable: true })
  user: User;
  @Column({ name: "place_id" })
  @Field()
  placeId: string;
  @OneToOne(() => Invoice, { cascade: true })
  @JoinColumn({ name: "invoice_id" })
  @Field(() => Invoice, { nullable: true })
  invoice: Invoice;
}
