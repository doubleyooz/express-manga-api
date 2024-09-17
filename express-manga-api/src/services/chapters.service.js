import Chapter from "../models/chapter.model.js";
import Manga from "../models/manga.model.js";
import { getMessage } from "../utils/message.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";

async function createChapter(data) {
  try {

    const doesMangaExist = await Manga.exists({ _id: data.mangaId });
    if (!doesMangaExist) throw new NotFoundException();

    console.log({ body: data });
    const newChapter = await Chapter.create({
      ...data,
    });

    return newChapter;
  } catch (err) {

    if (err.name === NotFoundException.name)
      throw new NotFoundException(getMessage("manga.notfound"))

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
async function findAll(filter, populate = false) {
  let queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions.where = { ...filter };
  }
  console.log({ filter, queryOptions })
  const result = await Chapter.find(queryOptions).populate(populate ? "mangaId" : null);

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
