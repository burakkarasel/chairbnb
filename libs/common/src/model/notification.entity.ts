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
export class Notification extends AbstractEntity<Notification> {
  @Column()
  @Field()
  to: string;
  @Column()
  @Field()
  text: string;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.notifications)
  @Field(() => User)
  user: User;
  @Column()
  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  timestamp: Date;
  @Field()
  @Column()
  type: string;
  @Field()
  @Column()
  subject: string;
}
