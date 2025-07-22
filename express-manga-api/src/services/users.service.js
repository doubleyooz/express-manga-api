import * as _repository from "../database/abstract.repository.js";
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
    const newUser = await _repository.create(User, {
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
  const user = await _repository.findOne(User, {
    filter,
  }, select);

  if (!user && throwNotFound) {
    throw new NotFoundException();
  }
  return user;
}

async function updateTokenVersion(_id) {
  const document = await _repository.findOneAndUpdate(User, _id, { $inc: { tokenVersion: 1 } });
  if (!document) {
    throw new NotFoundException();
  }
  return document;
}

async function deleteById(userId, throwNotFound = true) {
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);

    // 1. Delete user from database
    const document = await _repository.findByIdAndDelete(User, userId, null, session);
    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }
    console.log("User deleted:", document ? document.name : "Not found");

    // 2. Delete all reviews
    const reviews = await _repository.deleteMany(Review, { userId }, null, session);
    console.log("Reviews deleted:", reviews.length);

    // 3. Commit transaction first
    await _repository.commitTransaction(session);

    return { deletedUser: document, deletedReviews: reviews.length };
  }
  catch (error) {
    console.error("Error:", error);
    await _repository.abortTransaction(session);
    throw error;
  }
  finally {
    _repository.endSession(session);
  }
}

export default {
  create,
  findById: id => _repository.findById(User, id),
  findAll: (filter, populate = null) => _repository.findAll(User, filter, populate),
  update: (filter, data) => _repository.update(User, filter, data),
  getUser,
  updateTokenVersion,
  deleteById,
};
