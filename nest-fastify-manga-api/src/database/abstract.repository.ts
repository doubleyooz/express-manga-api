import { NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  UpdateQuery,
  SaveOptions,
  Connection,
  ClientSession,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { PinoLogger } from 'nestjs-pino';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
    private readonly logger: PinoLogger,
  ) {
    // Set logger context to the concrete class name
    this.logger.setContext(this.constructor.name);
  }

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    selection?: FilterQuery<TDocument>,
    populate: string | string[] | null = null,
  ): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery, selection, {
        lean: true,
      })
      .populate(populate);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options: { session?: ClientSession; new?: boolean } = {
      new: true,
      session: undefined,
    },
    populate: string | string[] | null = null,
  ) {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        lean: true,
        new: options.new,
        session: options.session,
      })
      .populate(populate);

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
    options?: { session?: ClientSession },
    populate: string | string[] | null = null,
  ) {
    const document = await this.model
      .findOneAndDelete(filterQuery, {
        lean: true,
        session: options?.session,
      })
      .populate(populate);

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
    options?: { session?: ClientSession },
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
      session: options?.session,
    });
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    selection?: FilterQuery<TDocument>,
    populate: string | string[] | null = null,
  ) {
    return this.model
      .find(filterQuery, selection, { lean: true })
      .populate(populate);
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async commitTransaction(session: ClientSession): Promise<void> {
    await session.commitTransaction();
  }

  async abortTransaction(session: ClientSession): Promise<void> {
    await session.abortTransaction();
  }

  async endSession(session: ClientSession): Promise<void> {
    await session.endSession();
  }

  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
    options?: { session?: ClientSession },
  ): Promise<ReturnType<typeof this.model.deleteMany>> {
    this.logger.info('Deleting documents with filterQuery', filterQuery);
    const result = await this.model.deleteMany(filterQuery, {
      session: options?.session,
    });
    return result;
  }
}
