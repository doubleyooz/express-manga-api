import Manga from "../models/manga.model.js";

import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function createManga(data) {
  try {
    const newManga = await Manga.create({
      ...data,
    });

    return newManga;
  }
  catch (err) {
    console.log(err);
    if (err.code === "11000") {
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

async function findAll(filter, populate = false) {
  let queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions = { ...filter };
  }

  const result = await Manga.find(queryOptions).populate(populate ? "chapter" : null);

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

async function deleteById(_id, throwNotFound = true) {
  const document = await Manga.findByIdAndDelete({ _id }).exec();
  console.log({ document, _id });
  if (document === null && throwNotFound) {
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
