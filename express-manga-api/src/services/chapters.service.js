import * as _repository from "../database/abstract.repository.js";
import Chapter from "../models/chapter.model.js";
import Manga from "../models/manga.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  console.log("Creating chapter with data:", data);
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);
    const doesMangaExist = await _repository.exists(Manga, { _id: data.mangaId });
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newChapter = await _repository.create(Chapter, data, session);
    await _repository.findByIdAndUpdate(
      Manga,
      data.mangaId,
      { $push: { chapters: newChapter[0]._id } },
      session,
    );
    await _repository.commitTransaction(session);
    return newChapter[0];
  }
  catch (err) {
    await _repository.abortTransaction(session);
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("chapter.error.twinned"),
      );
    }
    throw new InternalServerErrorException("Error while creating chapter");
  }
  finally {
    _repository.endSession(session);
  }
}

async function deleteById(_id, throwNotFound = true) {
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);
    const document = await _repository.findByIdAndDelete(Chapter, _id, null, session);

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await _repository.findByIdAndUpdate(
      Manga,
      document.mangaId,
      { $pull: { chapters: document._id } },
      session,
    );

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
    throw new InternalServerErrorException("Error while deleting chapter");
  }
  finally {
    _repository.endSession(session);
  }
}

export default {
  create,
  findById: id => _repository.findById(Chapter, id),
  findAll: (filter, populate = null) => _repository.findAll(Chapter, filter, populate),
  update: (filter, data) => _repository.update(Chapter, filter, data),
  deleteById,
};
