import yup from "yup";
import mongoose from "mongoose";

import { getMessage } from "../common/messages.js";

const rules = {
	manga_title: yup
		.string("manga title must be a string.")
		.strict()
		.max(60, getMessage("manga.invalid.title.long")),
	chapter_title: yup
		.string("title must be a string.")
		.strict()
		.max(40, getMessage("chapter.invalid.title.long")),
	number: yup
		.number("Must to be a valid number")
		.min(1, "Must be a positive number"),
	mongo_id_req: yup
		.string()
		.strict()
		.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
			isValidMongoIdRequired(value)
		),
	mongo_id: yup
		.string()
		.strict()
		.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
			isValidMongoId(value)
		),
};

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
		manga_title: rules.manga_title.required(),
		chapter_title: rules.chapter_title.required(),
		number: rules.number.required(),
	});
	try {
		await schema
			.validate(req.body)
			.then(() => {
				if (req.files.length) next();
				else return res.jsonBadRequest(null, null, null);
			})
			.catch(function (e) {
				return res.jsonBadRequest(null, null, e);
			});
	} catch (err) {
		return res.jsonBadRequest(null, null, err);
	}
}

async function valid_findOne(req, res, next) {
	let schema = yup.object().shape({
		chapter_id: rules.mongo_id_req.required(),
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
		manga_id: rules.mongo_id_req.required(),
	});
	schema
		.validate(req.query)
		.then(() => {
			next();
		})
		.catch((err) => {
			return res.jsonBadRequest(null, null, err.errors);
		});
}

async function valid_update(req, res, next) {
	let schema = yup.object().shape({
		chapter_title: rules.chapter_title,
		number: rules.number,
		chapter_id: rules.mongo_id_req.required(),
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
		chapter_id: rules.mongo_id_req.required(),
		manga_id: rules.mongo_id_req.required(),
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
	valid_findOne,
	valid_list,
	valid_update,
	valid_remove,
};
