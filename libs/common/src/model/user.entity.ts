import { AbstractEntity } from "@app/common/database";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./role.entity";

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
}
