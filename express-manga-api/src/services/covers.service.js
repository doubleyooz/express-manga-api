import * as _repository from "../database/abstract.repository.js";
import Cover from "../models/cover.model.js";
import Manga from "../models/manga.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);
    const doesMangaExist = await _repository.exists(Manga, { _id: data.mangaId });
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newCover = await _repository.create(Cover, data, session);
    await _repository.findByIdAndUpdate(Manga, data.mangaId, { $push: { covers: newCover[0]._id } }, session);
    await _repository.commitTransaction(session);
    return newCover[0];
  }
  catch (err) {
    await _repository.abortTransaction(session);
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("cover.error.twinned"),
      );
    }
    throw new InternalServerErrorException(
      "Error while creating cover",
    );
  }
  finally {
    _repository.endSession(session);
  }
}

async function deleteById(_id, throwNotFound = true) {
  const session = await _repository.getSession();
  try {
    _repository.startTransaction(session);
    const document = await _repository.findByIdAndDelete(Cover, { _id }, null, session);

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await _repository.findByIdAndUpdate(Manga, document.mangaId, { $pull: { covers: document._id } }, session);

    await _repository.commitTransaction(session);

    const allImages = document.files;
    // 6. Delete files AFTER successful DB operations
    if (allImages.length > 0) {
      try {
        await deleteFiles(allImages);
      }
      catch (fileError) {
        console.error("File deletion failed:", fileError);
      }
    }

    return document;
  }
  catch (err) {
    await _repository.abortTransaction(session);
    if (err.name === NotFoundException.name && throwNotFound) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while deleting cover",
    });
  }
  finally {
    _repository.endSession(session);
  }
}

export default {
  create,
  findById: id => _repository.findById(Cover, id),
  findAll: (filter, populate = null) => _repository.findAll(Cover, filter, populate),
  update: (filter, data) => _repository.update(Cover, filter, data),
  deleteById,
};
