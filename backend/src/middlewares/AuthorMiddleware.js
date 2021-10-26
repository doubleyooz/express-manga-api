import yup from "yup";
import mongoose from "mongoose";
import { differenceInCalendarDays } from "date-fns";

import { getMessage } from "../common/messages.js";
function isValidMongoIdRequired(value) {
	return (
		mongoose.Types.ObjectId.isValid(value) &&
		String(new mongoose.Types.ObjectId(value)) === value
	);
}

function isValidMongoId(value) {
	if (!!value) {
		mongoose.Types.ObjectId.isValid(value) &&
			String(new mongoose.Types.ObjectId(value)) === value;
	}
	return true;
}

async function valid_store(req, res, next) {
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

async function valid_read(req, res, next) {
	let schema = yup.object().shape({
		title: yup.string("title must be a string.").when(["manga_id"], {
			is: (manga_id) => !manga_id,
			then: yup.string().required(),
		}),
		manga_id: yup
			.string("manga_id must be a string.")
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoId(value)
			)
			.when(["title"], {
				is: (title) => !title,
				then: yup.string().required(),
			}),
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

async function valid_list(req, res, next) {
	let schema = yup.object().shape({
		type: yup.string("title must be a string.").strict(),
		nake: yup.string("genre must be a string.").strict(),
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

async function valid_update(req, res, next) {
	let currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() - 10);

	const schema = yup
		.object()
		.shape({
			author_id: yup
				.string("author_id must be a string.")
				.strict()
				.required()
				.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
					isValidMongoIdRequired(value)
				),
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
		);

	try {
		schema
			.validate(req.body)
			.then(() => {
				schema.cast(req.body, { stripUnknown: true });
				next();
			})
			.catch((err) => {
				return res.jsonBadRequest(null, null, err.errors);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err.errors);
	}
}

async function valid_remove(req, res, next) {
	let schema = yup.object().shape({
		author_id: yup
			.string()
			.strict()
			.required()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
			),
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

export default {
	valid_store,
	valid_read,
	valid_list,
	valid_update,
	valid_remove,
};
