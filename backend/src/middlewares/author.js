import yup from "yup";
import mongoose from "mongoose";
import { differenceInCalendarDays } from "date-fns";

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

async function valid_author_store(req, res, next) {
	let currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() - 10);

	const schema = yup.object().shape({
		type: yup
			.string("type must be a string.")
			.strict()
			.matches(/(writer|artist)/, null)
			.required(),
		name: yup.string("name must be a string.").strict().required(),
		birthDate: yup.date().max(currentDate).required(),
		deathDate: yup
			.date()
			.min(
				yup.ref("birthDate") + 3650,
				"death date must be at least 10 years longer than birthDate"
			),
		socialMedia: yup
			.string("socialMedia must be a string.")
			.strict()
			.required(),
		biography: yup
			.string("biography")
			.strict()
			.min(15, getMessage("author.invalid.biography.short"))
			.required(),
	});

	schema
		.validate(req.body)
		.then(() => {
			next();
		})
		.catch(function (e) {
			console.log(e);
			return res.jsonBadRequest(null, null, e);
		});
}

async function valid_author_read(req, res, next) {
	const { manga_id, title } = req.query;

	let schema = yup.object().shape({
		title: yup.string("title must be a string.").when(["manga_id"], {
			is: (manga_id) => !manga_id,
			then: yup.string().required(),
		}),
		manga_id: yup.string("manga_id must be a string.").when(["title"], {
			is: (title) => !title,
			then: yup.string().required(),
		}),
	});

	try {
		schema
			.validate(req.query)
			.then(() => {
				if (manga_id) {
					if (isValidMongoId(manga_id)) {
						next();
					} else {
						return res.jsonBadRequest(
							null,
							getMessage("manga.invalid.id"),
							null
						);
					}
				} else {
					next();
				}
			})
			.catch((err) => {
				return res.jsonBadRequest(null, null, err.errors);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err.errors);
	}
}

async function valid_author_list(req, res, next) {
	let schema = yup.object().shape({
		title: yup.string("title must be a string.").strict(),
		genre: yup.string("genre must be a string.").strict(),
		scan: yup.string("scan must be a string.").strict(),
		recent: yup.boolean(),
	});

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

async function valid_author_update(req, res, next) {
	let currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() - 10);

	const schema = yup
		.object()
		.shape({
			author_id: yup.string("author_id must be a string.").strict(),
			type: yup
				.string("type must be a string.")
				.strict()
				.matches(/(writer|artist)/, null),
			name: yup.string("name must be a string.").strict(),
			birthDate: yup.date().max(currentDate),
			deathDate: yup
				.date()
				.min(
					yup.ref("birthDate") + 10,
					"death date must be at least 10 years longer than birthDate"
				),
			socialMedia: yup.string("socialMedia must be a string.").strict(),
			biography: yup
				.string("biography")
				.strict()
				.min(15, getMessage("author.invalid.biography.short")),
		})
		.test(
			"at-least-one-field",
			"you must provide at least one field",
			(value) =>
				!!(
					value.type ||
					value.name ||
					value.birthDate ||
					value.deathDate ||
					value.socialMedia ||
					value.biography
				)
		)
      
	try {
		schema
			.validate(req.body)
			.then(() => {
				if (isValidMongoId(req.body.author_id)) {
					schema.cast(req.body, { stripUnknown: true });
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

async function valid_author_remove(req, res, next) {
	const { manga_id } = req.query;

	if (isValidMongoId(manga_id)) {
		next();
	} else {
		return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
	}
}

export default {
	valid_author_store,
	valid_author_read,
	valid_author_list,
	valid_author_update,
	valid_author_remove,
};
