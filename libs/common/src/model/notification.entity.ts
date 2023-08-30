import { AbstractEntity, User } from "@app/common";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  to: string;
  @Column()
  text: string;
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
  @Column()
  @CreateDateColumn({ type: "timestamptz" })
  timestamp: Date;
  @Column()
  type: string;
  @Column()
  subject: string;
}
