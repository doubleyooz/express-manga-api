import yup from "yup";
import mongoose from "mongoose";

import { getMessage } from "../common/messages.js";

async function valid_store(req, res, next) {
	let schema = yup.object().shape({
		title: yup
			.string("title must be a string.")
			.strict()
			.min(2, getMessage("manga.invalid.title.short"))
			.max(60, getMessage("manga.invalid.title.long"))
			.required(),

		genre: yup
			.array(yup.string())
			.min(3, "")
			.max(5, "")
			.compact(function (v) {
				return v == null;
			}),

		writer_id: yup
			.string()
			.strict()
			.required()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				(value) =>
					mongoose.Types.ObjectId.isValid(value) &&
					String(new mongoose.Types.ObjectId(value)) === value
			),
		artist_id: yup
			.string()
			.strict()
			.required()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				(value) =>
					mongoose.Types.ObjectId.isValid(value) &&
					String(new mongoose.Types.ObjectId(value)) === value
			),
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

	[
		"Action",
		"Adventure",
		"Boys' Love",
		"Comedy",
		"Crime",
		"Drama",
		"Fantasy",
		"Girls' Love",
		"Historical",
		"Horror",
		"Isekai",
		"Magical Girls",
		"Mecha",
		"Medical",
		"Mystery",
		"Philosophical",
		"Psychological",
		"Romance",
		"Sci-fi",
		"Slice of Life",
		"Sports",
		"Superhero",
		"Thriller",
		"Tragedy",
		"Wuxia",
	][
		("Aliens",
		"Animals",
		"Cooking",
		"Crossdressing",
		"Deliquents",
		"Demons",
		"Genderswap",
		"Ghosts",
		"Gyaru",
		"Harem",
		"Incest",
		"Loli",
		"Mafia",
		"Magic",
		"Martial Arts",
		"Military",
		"MonsterGirls",
		"Monsters",
		"Music",
		"Ninja",
		"Office Workers",
		"Police",
		"Post-Apocalyptic",
		"Reincarnation",
		"Reverse Harem",
		"Samurai",
		"School life",
		"Shota",
		"Supernatural",
		"Survival",
		"Time Travel",
		"Traditional Games",
		"Vampires",
		"Video Games",
		"Villainess",
		"Virtual Reality",
		"Zombies")
	];

	schema
		.validate(req.body)
		.then(() => {
			if (req.file) {
				req.nsfw = req.nsfw === "true";
				next();
			} else {
				return res.jsonBadRequest(null, null, null);
			}
		})
		.catch(function (e) {
			console.log(e);
			return res.jsonBadRequest(null, null, e.path + " : " + e.message);
		});
}

async function valid_read(req, res, next) {
	let schema = yup.object().shape(
		{
			title: yup.string("title must be a string.").when(["manga_id"], {
				is: (manga_id) => !manga_id,
				then: yup.required(),
			}),
			manga_id: yup
				.string()
				.test(
					"isValidMongoId",
					getMessage("invalid.object.id"),
					function (value) {
						if (!!value) {
							mongoose.Types.ObjectId.isValid(value) &&
								String(new mongoose.Types.ObjectId(value)) === value;
						}
						return true;
					}
				)
				.when(["title"], {
					is: (title) => !title,
					then: yup.required(),
				}),
		},
		[["title", "manga_id"]]
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

async function valid_list(req, res, next) {
	let schema = yup.object().shape({
		title: yup.string("title must be a string.").strict(),
		genre: yup.string("genre must be a string.").strict(),
		scan_id: yup
			.string()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				function (value) {
					if (!!value) {
						return mongoose.Types.ObjectId.isValid(value) &&
							String(new mongoose.Types.ObjectId(value)) === value;
					}
					return true;
				}
			),
		recent: yup.boolean(),
	});

	try {
		schema
			.validate(req.query)
			.then(() => {
				next();
			})
			.catch((e) => {
				return res.jsonBadRequest(null, null, e.path + " : " + e.message);
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
		writer_id: yup
			.string()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				function (value) {
					if (!!value) {
						return mongoose.Types.ObjectId.isValid(value) &&
							String(new mongoose.Types.ObjectId(value)) === value;
					}
					return true;
				}
			),
		artist_id: yup
			.string()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				function (value) {
					if (!!value) {
						return mongoose.Types.ObjectId.isValid(value) &&
							String(new mongoose.Types.ObjectId(value)) === value;
					}
					return true;
				}
			),
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
		manga_id: yup
			.string()
			.strict()
			.required()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				(value) =>
					mongoose.Types.ObjectId.isValid(value) &&
					String(new mongoose.Types.ObjectId(value)) === value
			),
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
		manga_id: yup
			.string()
			.strict()
			.required()
			.test(
				"isValidMongoId",
				getMessage("invalid.object.id"),
				(value) =>
					mongoose.Types.ObjectId.isValid(value) &&
					String(new mongoose.Types.ObjectId(value)) === value
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
