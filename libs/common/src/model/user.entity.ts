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
import { Directive, Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
@Directive("@shareable")
export class User extends AbstractEntity<User> {
  @Column()
  @Field()
  email: string;
  @Column()
  @Field()
  password: string;
  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
  @Column({ name: "created_at", type: "timestamptz" })
  @CreateDateColumn()
  @Field()
  createdAt: Date;
  @Column({ name: "updated_at", type: "timestamptz" })
  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  @Field(() => [Invoice], { nullable: true })
  invoices: Invoice[];
  @OneToMany(() => Notification, (notication) => notication.user, {
    cascade: true,
  })
  @Field(() => [Notification], { nullable: true })
  notifications: Notification[];
  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  @Field(() => [Reservation], { nullable: true })
  reservations: Reservation[];
}
