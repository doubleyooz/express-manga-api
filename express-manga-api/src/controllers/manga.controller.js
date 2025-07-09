import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import mangaService from "../services/manga.service.js";

export default {
  create: (req, res, next) => create(mangaService, req, res, next),
  findOneById: (req, res, next) => findOneById(mangaService, req, res, next),
  find: (req, res, next) => find(mangaService, req, res, next),
  update: (req, res, next) => update(mangaService, req, res, next),
  deleteById: (req, res, next) => deleteById(mangaService, req, res, next),
};
