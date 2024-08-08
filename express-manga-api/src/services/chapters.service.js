import Chapter from "../models/chapter.model.js";

import { getMessage } from "../utils/message.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";

async function createChapter(data) {
  try {
    const newChapter = await Chapter.create({
      ...data,
    });

    return newChapter;
  } catch (err) {
    console.log(err);
    if (err.code == "11000") {
      throw new UnprocessableEntityException(
        getMessage("chapter.error.twinned")
      );
    }
    throw new InternalServerErrorException({
      code: err.code,
      msg: "Error while creating chapter",
    });
  }
}

async function findById(id) {
  const document = await Chapter.findById(id).exec();
  if (!document) {
    throw new NotFoundException(getMessage("chapter.notfound"));
  }
  return document;
}

async function findAll(filter) {
  const result = await Chapter.find({
    where: filter,
  });
  console.log({ filter, result });
  if (result.length === 0) {
    throw new NotFoundException(getMessage("chapter.list.empty"));
  }

  return result;
}

async function updateChapter(filter, data) {
  const document = await Chapter.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException(getMessage("chapter.notfound"));
  }
  return document;
}

async function deleteById(_id) {
  const document = await Chapter.deleteOne({ _id }).exec();
  if (!document) {
    throw new NotFoundException(getMessage("chapter.notfound"));
  }
  return document;
}

export default {
  createChapter,
  findById,
  findAll,
  updateChapter,

  deleteById,
};
