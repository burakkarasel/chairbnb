import { AbstractEntity, User } from "@app/common";
import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity()
@ObjectType()
export class Invoice extends AbstractEntity<Invoice> {
  @Column({ name: "last_four" })
  @Field()
  lastFour: string;
  @Column()
  @Field()
  amount: number;
  @Column({ type: "timestamptz" })
  @CreateDateColumn()
  @Field()
  timestamp: Date;
  @Column()
  @Field()
  stripeId: string;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.invoices)
  @Field(() => User)
  user: User;
}
