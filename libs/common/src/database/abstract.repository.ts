import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const created = new this.model({ ...document, _id: new Types.ObjectId() });
    return (await created.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<object> {
    const doc = await this.model.findOne(
      filterQuery,
      {},
      {
        // lean makes the mongoose return plain object instead of casting the document into mongoose model
        // it's more performant
        lean: true,
      },
    );

    if (!doc) {
      this.logger.warn("Document not found with filterQuery ", filterQuery);
      throw new NotFoundException("Document not found!");
    }
    return doc;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    updateQuery: UpdateQuery<TDocument>,
  ): Promise<object> {
    const doc = await this.model.findOneAndUpdate(filterQuery, updateQuery, {
      lean: true,
      // so it returns the newly updated doc
      new: true,
    });

    if (!doc) {
      this.logger.warn("Document not found with filterQuery ", filterQuery);
      throw new NotFoundException("Document not found!");
    }
    return doc;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<object[]> {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<void> {
    const doc = await this.model.findOneAndDelete(filterQuery, { lean: true });

    if (!doc) {
      this.logger.warn("Document not found with filterQuery ", filterQuery);
      throw new NotFoundException("Document not found!");
    }

    return;
  }
}
