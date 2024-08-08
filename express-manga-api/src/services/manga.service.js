import Manga from "../models/manga.model.js";

import { getMessage } from "../utils/message.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";

async function createManga(data) {
  try {
    const newManga = await Manga.create({
      ...data,
    });

    return newManga;
  } catch (err) {
    console.log(err);
    if (err.code == "11000") {
      throw new UnprocessableEntityException(getMessage("manga.error.twinned"));
    }
    throw new InternalServerErrorException({
      code: err.code,
      msg: "Error while creating manga",
    });
  }
}

async function findById(id) {
  const document = await Manga.findById(id).exec();
  if (!document) {
    throw new NotFoundException(getMessage("manga.notfound"));
  }
  return document;
}

async function findAll(filter) {
  const result = await Manga.find({
    where: filter,
  });
  console.log({ filter, result });
  if (result.length === 0) {
    throw new NotFoundException(getMessage("manga.list.empty"));
  }

  return result;
}

async function updateManga(filter, data) {
  const document = await Manga.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException(getMessage("manga.notfound"));
  }
  return document;
}

async function deleteById(_id) {
  const document = await Manga.deleteOne({ _id }).exec();
  if (!document) {
    throw new NotFoundException(getMessage("manga.notfound"));
  }
  return document;
}

export default {
  createManga,
  findById,
  findAll,
  updateManga,

  deleteById,
};
