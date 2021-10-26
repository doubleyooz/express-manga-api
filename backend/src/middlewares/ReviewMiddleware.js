import yup from "yup";
import mongoose from "mongoose";

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
	let schema = yup.object().shape({
		text: yup
			.string("text must be a string.")
			.strict()
			.min(2, getMessage("text.invalid.text.short"))
			.max(500, getMessage("text.invalid.text.long"))
			.required(),
		manga_id: yup
			.string("must be a string")
			.strict()
			.required()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
			),
		rating: yup
			.number("rating must be a number.")
			.min(0, "The minimum limit is 0.")
			.max(5, "The maximum limit is 5.")
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
		review_id: yup
			.string("review_id must be a string.")
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

async function valid_list(req, res, next) {
	let schema = yup
		.object()
		.shape({
			manga_id: yup
				.string("manga_id must be a string.")
				.strict()
				.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
					isValidMongoId(value)
				),
			user_id: yup
				.string("user_id must be a string.")
				.strict()
				.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
					isValidMongoId(value)
				),
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
		text: yup
			.string("text must be a string.")
			.strict()
			.min(2, getMessage("text.invalid.text.short"))
			.max(500, getMessage("text.invalid.text.long"))
			.required(),
		review_id: yup
			.string("must be a string")
			.strict()
			.required()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
			),
		rating: yup
			.number("rating must be a number.")
			.min(0, "The minimum limit is 0.")
			.max(5, "The maximum limit is 5.")
			.required(),
	});

	try {
		schema
			.validate(req.body)
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

async function valid_remove(req, res, next) {
	let schema = yup.object().shape({
		review_id: yup
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
