import * as _repository from "../database/abstract.repository.js";
import Manga from "../models/manga.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  console.log("Creating review with data:", data);
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);
    const doesMangaExist = await _repository.exists(Manga, data.mangaId);
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newReview = await _repository.create(Review, data, session);
    await _repository.findByIdAndUpdate(Manga, data.mangaId, { $push: { reviews: newReview[0]._id } }, session);
    await _repository.commitTransaction(session);
    return newReview[0];
  }
  catch (err) {
    await _repository.abortTransaction(session);
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("review.error.twinned"),
      );
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while creating review",
    });
  }
  finally {
    _repository.endSession(session);
  }
}

async function deleteById(_id, throwNotFound = true) {
  const session = await _repository.getSession();
  try {
    _repository.startTransaction(session);
    const document = await _repository.findByIdAndDelete(Review, _id, session);

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await _repository.findByIdAndUpdate(Manga, document.mangaId, { $pull: { reviews: document._id } }, session);

    await _repository.findByIdAndUpdate(User, document.userId, { $pull: { reviews: document._id } }, session);

    await _repository.commitTransaction(session);

    return document;
  }
  catch (err) {
    await _repository.abortTransaction(session);
    if (err.name === NotFoundException.name && throwNotFound) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while deleting review",
    });
  }
  finally {
    _repository.endSession(session);
  }
}

export default {
  create,
  findById: id => _repository.findById(Review, id),
  findAll: (filter, populate = null) => _repository.findAll(Review, filter, populate),
  update: (filter, data) => _repository.update(Review, filter, data),
  deleteById,
};
