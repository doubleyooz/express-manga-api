import yup from "yup";
import mongoose from "mongoose";
import { differenceInCalendarDays } from "date-fns";

import { getMessage } from "../common/messages.js";

const rules = {
	type: yup
		.string("type must be a string.")
		.strict()
		.matches(/(writer|artist)/, null),
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
	name: yup.string("name must be a string.").strict(),
	birthDate: yup.date(),
	deathDate: yup
		.date()
		.min(
			yup.ref("birthDate") + 3650,
			"death date must be at least 10 years longer than birthDate"
		),
	socialMedia: yup
		.array(yup.string("socialMedia must be a string."))
		.min(1, "")
		.max(5, ""),
	biography: yup
		.string("biography")
		.strict()
		.min(15, getMessage("author.invalid.biography.short")),
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
	let currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() - 10);

	const schema = yup.object().shape({
		type: rules.type.required(),
		name: rules.name.required(),
		birthDate: rules.birthDate.max(currentDate).required(),
		deathDate: rules.deathDate,
		socialMedia: rules.socialMedia.required(),
		biography: rules.biography.required(),
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

async function valid_findOne(req, res, next) {
	let schema = yup.object().shape({
		author_id: rules.mongo_id_req,
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
		type: rules.type,
		name: rules.name,
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
			author_id: rules.mongo_id_req,
			type: rules.type,
			name: rules.name,
			birthDate: rules.birthDate.max(currentDate),
			deathDate: rules.deathDate,
			socialMedia: rules.socialMedia,
			biography: rules.biography,
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
		author_id: mongo_id_req.required(),
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
