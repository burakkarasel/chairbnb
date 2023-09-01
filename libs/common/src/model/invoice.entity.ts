import { AbstractEntity, User } from "@app/common";
import { Directive, Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity()
@ObjectType()
@Directive("@shareable")
export class Invoice extends AbstractEntity<Invoice> {
  @Column({ name: "last_four" })
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
