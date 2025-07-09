import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import chapterService from "../services/chapters.service.js";

export default {
  create: (req, res, next) => create(chapterService, req, res, next),
  findOneById: (req, res, next) => findOneById(chapterService, req, res, next),
  find: (req, res, next) => find(chapterService, req, res, next),
  update: (req, res, next) => update(chapterService, req, res, next),
  deleteById: (req, res, next) => deleteById(chapterService, req, res, next),
};
