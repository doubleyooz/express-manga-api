import { abortTransaction, commitTransaction, endSession, findAll, findById, getSession, startTransaction, update } from "../database/abstract.repository.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import { ROLES } from "../utils/constant.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";

import { getMessage } from "../utils/message.util.js";
import { hashPassword } from "../utils/password.util.js";

async function create(data) {
  try {
    const newUser = await User.create({
      ...data,
      role: data.role || ROLES.READER,
      password: await hashPassword(data.password),
    });

    delete newUser.password;
    return newUser;
  }
  catch (err) {
    console.log(err);
    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("user.error.sign_up.twinned"),
      );
    }
    throw new InternalServerErrorException(
      "Error while creating user",
    );
  }
}

async function getUser(filter, select = {}, throwNotFound = true) {
  const user = await User.findOne(
    {
      ...filter,
    },
    select,
  );

  if (!user && throwNotFound) {
    throw new NotFoundException();
  }
  return user;
}

async function updateTokenVersion(_id) {
  const document = await User.findOneAndUpdate(
    { _id },
    { $inc: { tokenVersion: 1 } },
  );
  if (!document) {
    throw new NotFoundException();
  }
  return document;
}

async function deleteById(userId, throwNotFound = true) {
  const session = await getSession();

  try {
    startTransaction(session);

    // 1. Delete yser from database
    const document = await User.findByIdAndDelete(userId).session(session);
    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }
    console.log("User deleted:", document ? document.name : "Not found");

    // 2. Delete all reviews
    const reviews = await Review.deleteMany({ userId }).session(session);
    console.log("Reviews deleted:", reviews.length);

    // 3. Commit transaction first
    await commitTransaction(session);

    return { deletedUser: document, deletedReviews: reviews.length };
  }
  catch (error) {
    console.error("Error:", error);
    await abortTransaction(session);
    throw error;
  }
  finally {
    endSession(session);
  }
}

export default {
  create,
  findById: id => findById(User, id),
  findAll: (filter, populate = null) => findAll(User, filter, populate),
  update: (filter, data) => update(User, filter, data),
  getUser,
  updateTokenVersion,
  deleteById,
};
