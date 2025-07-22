import mongoose from "mongoose";
import {
  NotFoundException,
} from "../utils/exception.util.js";

async function getSession() {
  return await mongoose.startSession();
}

function startTransaction(session) {
  session.startTransaction();
}

async function abortTransaction(session) {
  await session.abortTransaction();
}

async function commitTransaction(session) {
  await session.commitTransaction();
  console.log("Transaction committed successfully");
}

function endSession(session) {
  session.endSession();
}

async function create(model, data, session = null) {
  return await model.create({ ...data }).session(session);
}

async function findByIdAndUpdate(model, id, data, session = null) {
  return await model.findByIdAndUpdate(id, data, { session });
}

async function findByIdAndDelete(model, id, populate, session = null) {
  return await model.findByIdAndDelete(id, populate, { session });
}

async function findOne(model, filter, select) {
  return await model.findOne(
    {
      ...filter,
    },
    select,
  );
}

async function findById(model, id, throwNotFound = true) {
  const document = await model.findById(id).exec();
  if (!document && throwNotFound) {
    throw new NotFoundException();
  }
  return document;
}
async function findAll(model, filter, populate = null) {
  const queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions.where = { ...filter };
  }
  console.log({ filter, queryOptions });
  const result = await model.find(queryOptions).populate(populate || null);

  if (result.length === 0) {
    throw new NotFoundException();
  }

  return result;
}
async function update(model, filter, data, throwNotFound = true) {
  const document = await model.findOneAndUpdate({ ...filter }, data);
  if (!document && throwNotFound) {
    throw new NotFoundException();
  }
  return document;
}

async function exists(model, filter) {
  return await model.exists(filter);
}

async function deleteMany(model, filter, populate = null, session = null) {
  return await model.deleteMany(filter, populate).session(session);
}

export {
  abortTransaction,
  commitTransaction,
  create,
  deleteMany,
  endSession,
  exists,
  findAll,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOne,
  getSession,
  startTransaction,
  update,
};
