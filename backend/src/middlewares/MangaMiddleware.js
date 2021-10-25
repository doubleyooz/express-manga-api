import yup from "yup";
import mongoose from "mongoose";

import { getMessage } from "../common/messages.js";

const genres = [
	"action",
	"adventure",
	"boys' love",
	"comedy",
	"crime",
	"drama",
	"fantasy",
	"girls' love",
	"historical",
	"horror",
	"isekai",
	"magical girls",
	"mecha",
	"medical",
	"mystery",
	"philosophical",
	"psychological",
	"romance",
	"sci-fi",
	"slice of life",
	"sports",
	"superhero",
	"thriller",
	"tragedy",
	"wuxia",
];

const themes = [
	"aliens",
	"animals",
	"cooking",
	"crossdressing",
	"deliquents",
	"demons",
	"genderswap",
	"ghosts",
	"gyaru",
	"harem",
	"incest",
	"loli",
	"mafia",
	"magic",
	"martial arts",
	"military",
	"monster girls",
	"monsters",
	"music",
	"ninja",
	"office workers",
	"police",
	"post-apocalyptic",
	"reincarnation",
	"reverse harem",
	"samurai",
	"school life",
	"shota",
	"supernatural",
	"survival",
	"time travel",
	"traditional games",
	"vampires",
	"video games",
	"villainess",
	"virtual reality",
	"zombies",
];

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
		title: yup
			.string("title must be a string.")
			.strict()
			.min(2, getMessage("manga.invalid.title.short"))
			.max(60, getMessage("manga.invalid.title.long"))
			.required(),

		genres: yup
			.array(yup.string())
			.min(3, "")
			.max(5, "")
			.required()
			.test(
				"Valid genres",
				"Not all given ${path} are valid options",
				function (items) {
					if (items) {
						return items.every((item) => {
						
							return genres.includes(item.toLowerCase());
						});
					}
					console.log("false");
					return false;
				}
			),
		themes: yup
			.array(yup.string())
			.min(3, "")
			.max(5, "")
			.required()
			.test(
				"Valid themes",
				"Not all given ${path} are valid options",
				function (items) {
					if (items) {
						return items.every((item) => {
							console.log(item.toLowerCase());
							console.log(themes.includes(item.toLowerCase()));
							return genres.includes(item.toLowerCase());
						});
					}
					return false;
				}
			),

		writer_id: yup
			.string()
			.strict()
			.required()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
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
				.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
					isValidMongoId(value)
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
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoId(value)
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
		genres: yup
			.array(yup.string())
			.min(3, "")
			.max(5, "")
			.test(
				"Valid genres",
				"Not all given ${path} are valid options",
				function (items) {
					if (!!items) {
						items.every((item) => {
							return genres.includes(item.toLowerCase());
						});
					}
					return true;
				}
			),
		themes: yup
			.array(yup.string())
			.min(3, "")
			.max(5, "")
			.test(
				"Valid themes",
				"Not all given ${path} are valid options",
				function (items) {
					if (!!items) {
						items.every((item) => {
							return themes.includes(item.toLowerCase());
						});
					}
					return true;
				}
			),
		writer_id: yup
			.string()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
			),
		artist_id: yup
			.string()
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
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
			.test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
				isValidMongoIdRequired(value)
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
