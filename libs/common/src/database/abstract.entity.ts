import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType({ isAbstract: true })
export class AbstractEntity<T> {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
