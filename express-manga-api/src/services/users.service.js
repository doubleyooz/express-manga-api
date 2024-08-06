import User from "../models/user.model.js";
import { hashPassword } from "../utils/password.util.js";

import { getMessage } from "../utils/message.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";

async function createUser(data) {
  try {
    const newUser = await User.create({
      ...data,
      role: data.role || "User",
      password: await hashPassword(data.password),
    });

    delete newUser.password;
    return newUser;
  } catch (err) {
    console.log(err);
    if (err.code == "11000") {
      throw new UnprocessableEntityException(
        getMessage("user.error.sign_up.twinned")
      );
    }
    throw new InternalServerErrorException({
      code: err.code,
      msg: "Error while creating user",
    });
  }
}

async function getUser(filter, select = {}, throwNotFound = true) {
  const user = await User.findOne(
    {
      ...filter,
    },
    select
  );

  if (!user && throwNotFound) {
    throw new NotFoundException(getMessage("user.notfound"));
  }
  return user;
}

async function findById(id) {
  const document = await User.findById(id).exec();
  if (!document) {
    throw new NotFoundException(getMessage("user.notfound"));
  }
  return document;
}

async function findAll(filter) {
  const result = await User.find({
    where: filter,
  });
  console.log({ filter, result });
  if (result.length === 0) {
    throw new NotFoundException(getMessage("user.list.notfound"));
  }

  return result;
}

async function updateTokenVersion(_id) {
  const document = await User.findOneAndUpdate(
    { _id },
    { $inc: { tokenVersion: 1 } }
  );
  if (!document) {
    throw new NotFoundException(getMessage("user.notfound"));
  }
  return document;
}

async function updateUser(filter, data) {
  const document = await User.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException(getMessage("user.notfound"));
  }
  return document;
}

async function deleteById(_id) {
  const document = await User.deleteOne({ _id }).exec();
  if (!document) {
    throw new NotFoundException(getMessage("user.notfound"));
  }
  return document;
}

export default {
  createUser,
  findById,
  findAll,
  updateUser,
  getUser,
  updateTokenVersion,
  deleteById,
};
