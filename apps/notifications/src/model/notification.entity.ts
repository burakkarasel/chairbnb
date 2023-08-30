import { AbstractEntity, User } from "@app/common";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  to: string;
  @Column()
  text: string;
  @Column({ name: "user_id" })
  @ManyToOne(() => User, { eager: true })
  userId: string;
  @Column()
  @CreateDateColumn({ type: "timestamptz" })
  timestamp: Date;
  @Column()
  type: string;
  @Column()
  subject: string;
}
