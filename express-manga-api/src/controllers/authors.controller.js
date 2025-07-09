import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import authorsService from "../services/authors.service.js";

export default {
  create: (req, res, next) => create(authorsService, req, res, next),
  findOneById: (req, res, next) => findOneById(authorsService, req, res, next),
  find: (req, res, next) => find(authorsService, req, res, next),
  update: (req, res, next) => update(authorsService, req, res, next),
  deleteById: (req, res, next) => deleteById(authorsService, req, res, next),
};
