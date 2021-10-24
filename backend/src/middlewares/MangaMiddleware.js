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
	const { writer_id, artist_id } = req.body;

	let schema = yup.object().shape({
		title: yup
			.string("title must be a string.")
			.strict()
			.min(2, getMessage("manga.invalid.title.short"))
			.max(60, getMessage("manga.invalid.title.long"))
			.required(),
		genre: yup.string("genre must be a string.").strict().required(),
		writer_id: yup.string("must be a string").strict().required(),
		artist_id: yup.string("must be a string").strict().required(),
		synopsis: yup
			.string("synopsis must be a string.")
			.strict()
			.min(10, getMessage("manga.invalid.synopsis.short"))
			.max(400, getMessage("manga.invalid.synopsis.long"))
			.required(),
		n_chapters: yup
			.number("chapters must be a number.")
			.min(1, "There must be at least one chapter.")
			.required(),
		status: yup
			.number("status must be a number.")
			.min(1, getMessage("manga.invalid.code"))
			.max(6, getMessage("manga.invalid.code"))
			.required(),
		nsfw: yup
			.string("nsfw must be a string.")
			.strict()
			.matches(/(true|false)/, null)
			.required(),
		type: yup
			.string("type must be a string.")
			.strict()
			.matches(/^manga$|^manhwa$|^manhua$/, null)
			.default({ type: "manga" })
			.required(),
		language: yup
			.string("language must be a string.")
			.strict()
			.matches(
				/^da$|^nl$|^en$|^fi$|^fr$|^de$|^hu$|^it$|^nb$|^pt$|^ro$|^ru$|^tr$|^es$/,
				null
			)
			.default({ language: "pt" })
			.required(),
	});

	schema
		.validate(req.body)
		.then(() => {
			let valid_genre = true;

			if (valid_genre && req.file) {
				if (isValidMongoId(writer_id)) {
					if (isValidMongoId(artist_id)) {
						req.nsfw = req.nsfw === "true";
						console.log(req.body.language);
						next();
					} else {
						return res.jsonBadRequest(null, null, null);
					}
				} else {
					return res.jsonBadRequest(null, null, null);
				}
			} else {
				return res.jsonBadRequest(null, null, null);
			}
		})
		.catch(function (e) {
			console.log(e);
			return res.jsonBadRequest(null, null, e);
		});
}

async function valid_read(req, res, next) {
	const { manga_id } = req.query;

	let schema = yup.object().shape(
		{
			title: yup.string("title must be a string.").when(["manga_id"], {
				is: (manga_id) => !manga_id,
				then: yup.string().required(),
			}),
			manga_id: yup.string("manga_id must be a string.").when(["title"], {
				is: (title) => !title,
				then: yup.string().required(),
			}),
		},
		[["title", "manga_id"]]
	);

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
							getMessage("invalid.object.id"),
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

async function valid_list(req, res, next) {
	const { scan_id } = req.body;
	let schema = yup.object().shape({
		title: yup.string("title must be a string.").strict(),
		genre: yup.string("genre must be a string.").strict(),
		scan_id: yup.string("scan must be a string.").strict(),
		recent: yup.boolean(),
	});

	try {
		schema
			.validate(req.query)
			.then(() => {
				if (scan_id) {
					if (!isValidMongoId(scan_id)) {
						return res.jsonBadRequest(
							null,
							getMessage("invalid.object.id"),
							null
						);
					}
				}
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
	const { manga_id, writer_id, artist_id } = req.body;
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
		type: yup
			.string("type must be a string.")
			.strict()
			.matches(/^manga$|^manhwa$|^manhua$/, null)
			.default({ type: "manga" }),
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
					if (writer_id) {
						if (!isValidMongoId(writer_id))
							return res.jsonBadRequest(
								null,
								getMessage("invalid.object.id"),
								null
							);
					}

					if (artist_id) {
						if (!isValidMongoId(artist_id))
							return res.jsonBadRequest(
								null,
								getMessage("invalid.object.id"),
								null
							);
					}

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

async function valid_remove(req, res, next) {
	const { manga_id } = req.query;

	if (mongoose.Types.ObjectId.isValid(manga_id)) {
		if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {
			next();
		} else {
			return res.jsonBadRequest(null, getMessage("invalid.object.id"), null);
		}
	} else {
		return res.jsonBadRequest(null, getMessage("invalid.object.id"), null);
	}
}

export default {
	valid_store,
	valid_read,
	valid_list,
	valid_update,
	valid_remove,
};
