import yup from "yup";
import mongoose from "mongoose";

import { getMessage } from "../common/messages.js";

function isValidMongoId(object_id) {
	try {
		if (mongoose.Types.ObjectId.isValid(object_id)) {
			if (String(new mongoose.Types.ObjectId(object_id)) === object_id) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
}

async function valid_store(req, res, next) {
	const { manga_id } = req.body;

	let schema = yup.object().shape({
		text: yup
			.string("text must be a string.")
			.strict()
			.min(2, getMessage("text.invalid.text.short"))
			.max(500, getMessage("text.invalid.text.long"))
			.required(),
		manga_id: yup.string("must be a string").strict().required(),
		rating: yup
			.number("rating must be a number.")
			.min(0, "The minimum limit is 0.")
			.max(5, "The maximum limit is 5.")
			.required(),
	});

	schema
		.validate(req.body)
		.then(() => {
			if (isValidMongoId(manga_id)) next();
			else return res.jsonBadRequest(null, null, null);
		})
		.catch(function (e) {
			console.log(e);
			return res.jsonBadRequest(null, null, e);
		});
}

async function valid_read(req, res, next) {
	const { review_id } = req.query;

	let schema = yup.object().shape({
		review_id: yup.string("review_id must be a string.").required(),
	});

	try {
		schema
			.validate(req.query)
			.then(() => {
				if (isValidMongoId(review_id)) {
					next();
				} else {
					return res.jsonBadRequest(
						null,
						getMessage("invalid.object.id"),
						null
					);
				}
			})
			.catch((err) => {
				return res.jsonBadRequest(null, null, err.errors);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err.errors);
	}
}

async function valid_list(req, res, next) {
	let schema = yup
		.object()
		.shape({
			manga_id: yup.string("manga_id must be a string.").strict(),
			user_id: yup.string("user_id must be a string.").strict(),
		})
		.test(
			"at-least-one-field",
			"you must provide at least one id",
			(value) => !!(value.manga_id || value.user_id)
		);

	try {
		schema
			.validate(req.query)
			.then(() => {
				next();
			})
			.catch((err) => {
				return res.jsonBadRequest(null, null, err.errors);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err.errors);
	}
}

async function valid_update(req, res, next) {
	let schema = yup.object().shape({
		title: yup
			.string("title must be a string.")
			.strict()
			.min(2, getMessage("manga.invalid.title.short"))
			.max(60, getMessage("manga.invalid.title.long")),
		genre: yup.string("genre must be a string.").strict(),
		writer_id: yup.string("must be a string").strict(),
		artist_id: yup.string("must be a string").strict(),
		synopsis: yup
			.string("synopsis must be a string.")
			.strict()
			.min(10, getMessage("manga.invalid.synopsis.short"))
			.max(400, getMessage("manga.invalid.synopsis.long")),
		n_chapters: yup
			.number("chapters must be a number.")
			.min(1, "There must be at least one chapter."),
		status: yup
			.number("status must be a number.")
			.min(1, getMessage("manga.invalid.code"))
			.max(6, getMessage("manga.invalid.code")),
		nsfw: yup
			.string("nsfw must be a string.")
			.strict()
			.matches(/(true|false)/, null),
		language: yup
			.string("language must be a string.")
			.strict()
			.matches(
				/^da$|^nl$|^en$|^fi$|^fr$|^de$|^hu$|^it$|^nb$|^pt$|^ro$|^ru$|^tr$|^es$/,
				null
			)
			.default({ language: "pt" }),
		manga_id: yup.string("must be a string").strict().required(),
	});

	try {
		schema
			.validate(req.body)
			.then(() => {
				if (isValidMongoId(manga_id)) {
					next();
				} else {
					return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
				}
			})
			.catch((err) => {
				return res.jsonBadRequest(null, null, err.errors);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err.errors);
	}
}

async function valid_remove(req, res, next) {
	const { manga_id } = req.query;

	if (mongoose.Types.ObjectId.isValid(manga_id)) {
		if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {
			next();
		} else {
			return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
		}
	} else {
		return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
	}
}

export default {
	valid_store,
	valid_read,
	valid_list,
	valid_update,
	valid_remove,
};
