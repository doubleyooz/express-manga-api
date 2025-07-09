import { create, deleteById, find, findOneById, update } from "../database/abstract.controller.js";
import reviewService from "../services/reviews.service.js";

export default {
  create: (req, res, next) => create(reviewService, req, res, next),
  findOneById: (req, res, next) => findOneById(reviewService, req, res, next),
  find: (req, res, next) => find(reviewService, req, res, next),
  update: (req, res, next) => update(reviewService, req, res, next),
  deleteById: (req, res, next) => deleteById(reviewService, req, res, next),
};
