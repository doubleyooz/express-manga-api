import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import coversService from "../services/covers.service.js";

export default {
  create: (req, res, next) => create(coversService, req, res, next),
  findOneById: (req, res, next) => findOneById(coversService, req, res, next),
  find: (req, res, next) => find(coversService, req, res, next),
  update: (req, res, next) => update(coversService, req, res, next),
  deleteById: (req, res, next) => deleteById(coversService, req, res, next),
};
