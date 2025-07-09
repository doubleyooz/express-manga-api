import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import mangaService from "../services/manga.service.js";

async function likeManga(req, res, next) {
  try {
    const { _id: mangaId } = req.params;
    const document = await mangaService.likeManga(req.auth, mangaId);

    return res.status(HttpStatusCodes.CREATED).json({
      message: HttpStatusMessages.CREATED,
      data: document,
    });
  }
  catch (err) {
    next(err);
  }
}

export default {
  create: (req, res, next) => create(mangaService, req, res, next),
  findOneById: (req, res, next) => findOneById(mangaService, req, res, next),
  find: (req, res, next) => find(mangaService, req, res, next),
  update: (req, res, next) => update(mangaService, req, res, next),
  deleteById: (req, res, next) => deleteById(mangaService, req, res, next),
  likeManga,
};
