import { AbstractEntity } from "./abstract.entity";
import { Logger, NotFoundException } from "@nestjs/common";
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;
  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });
    if (!entity) {
      this.logger.warn(`Entity not found with filter:\n${where}`);
      throw new NotFoundException("Entity not found!");
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateRes = await this.entityRepository.update(where, partialEntity);
    if (!updateRes.affected) {
      this.logger.warn(`Entity not found with filter:\n${where}`);
      throw new NotFoundException("Entity not found!");
    }

    return this.findOne(where);
  }

  async find(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T[]> {
    return this.entityRepository.find({ where, relations });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<void> {
    const deleteRes = await this.entityRepository.delete(where);
    if (!deleteRes.affected) {
      this.logger.warn("Entity not found with filter:\n", where);
      throw new NotFoundException("Entity not found!");
    }
    return;
  }
}
