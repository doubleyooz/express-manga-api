import fs from "fs";
import CryptoJs from "crypto-js";

import Author from "../models/Author.js";
import Chapter from "../models/Chapter.js";
import Manga from "../models/Manga.js";
import User from "../models/User.js";

import { getMessage } from "../common/messages.js";
import { writer } from "repl";

const list_projection = {
	0: {
		title: 1,
		genre: 1,
		synopsis: 1,
		n_chapters: 1,
		status: 1,
		nsfw: 1,
		rating: 1,
		cover: 1,
		type: 1,
		likes: 1,
		writer_id: 1,
		artist_id: 1,
		_id: 0,
	},
	1: {
		updatedAt: 1,
		createdAt: 1,
		title: 1,
		genre: 1,

		type: 1,
		synopsis: 1,
		n_chapters: 1,

		language: 1,
		nsfw: 1,
		status: 1,
		writer_id: 1,
		artist_id: 1,
		scan_id: 1,
		rating: 1,
		likes: 1,
		__v: 1,
		cover: 1,
	},
	2: {
		title: 1,
		genre: 1,
		synopsis: 1,
		n_chapters: 1,
		cover: 1,
		rating: 1,
		writer_id: 1,
		artist_id: 1,
		type: 1,
		nsfw: 1,
		status: 1,
		likes: 1,
	},
};

const read_projection = {
	0: {
		title: 1,
		genre: 1,
		synopsis: 1,
		n_chapters: 1,
		chapters: 1,
		status: 1,
		writer_id: 1,
		artist_id: 1,
		type: 1,
		rating: 1,
		nsfw: 1,
		cover: 1,
		likes: 1,
	},
	1: {
		updatedAt: 1,
		createdAt: 1,
		type: 1,
		title: 1,
		genre: 1,
		synopsis: 1,
		n_chapters: 1,
		chapters: 1,
		language: 1,
		nsfw: 1,
		artist_id: 1,
		writer_id: 1,
		status: 1,
		rating: 1,
		scan_id: 1,
		likes: 1,
		__v: 1,
		cover: 1,
	},
	2: {
		title: 1,
		genre: 1,
		synopsis: 1,
		n_chapters: 1,
		chapters: 1,
		type: 1,
		cover: 1,
		rating: 1,
		writer_id: 1,
		artist_id: 1,
		nsfw: 1,
		status: 1,
		likes: 1,
	},
};

async function store(req, res) {
	const {
		title,
		genre,
		synopsis,
		writer_id,
		artist_id,
		type,
		genres,
		themes,
		n_chapters,
		status,
		language,
		nsfw,
	} = req.body;

	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	let scan_id = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);

	req.auth = null;

	const scan = await User.findById(scan_id);

	if (!scan) {
		fs.unlinkSync(
			"uploads/" +
				language +
				"/" +
				email +
				"/" +
				title +
				"/" +
				req.file.filename
		);
		return res.jsonNotFound(null, getMessage("manga.error.scan_id"), null);
	}

	const doesMangaExist = await Manga.exists({ title: title });

	if (doesMangaExist) {
		fs.unlinkSync(
			"uploads/mangas/" +
				language +
				"/" +
				scan_id +
				"/" +
				title +
				"/" +
				req.file.filename
		);
		return res.jsonBadRequest(
			null,
			getMessage("manga.error.duplicate"),
			new_token
		);
	}

	const artist = await Author.findById(artist_id);

	if (!artist) {
		fs.unlinkSync(
			"uploads/mangas/" +
				language +
				"/" +
				scan_id +
				"/" +
				title +
				"/" +
				req.file.filename
		);
		return res.jsonNotFound(null, getMessage("manga.error.artist"), null);
	}

	const writer = await Author.findById(writer_id);

	if (!writer) {
		fs.unlinkSync(
			"uploads/mangas/" +
				language +
				"/" +
				scan_id +
				"/" +
				title +
				"/" +
				req.file.filename
		);
		return res.jsonNotFound(null, getMessage("manga.error.writer"), null);
	}

	const manga = new Manga({
		cover: req.file.filename,
		title: title,
		genre: genre,
		synopsis: synopsis,
		n_chapters: n_chapters,
		status: status,
		language: language,
		genres: genres,
		themes: themes,
		nsfw: nsfw,
		type: type,
		scan_id: scan_id,
		writer_id: writer_id,
		artist_id: artist_id,
		//comments?
	});

	manga
		.save()
		.then((result) => {
			scan.mangas.push(manga._id);
			artist.works.push(manga._id);
			writer.works.push(manga._id);
			artist
				.save()
				.then(() => {})
				.catch((err) => {});
			writer
				.save()
				.then(() => {})
				.catch((err) => {});
			scan
				.save()
				.then(() => {
					return res.jsonOK(
						result,
						getMessage("manga.save.success"),
						new_token
					);
				})
				.catch((err) => {
					console.log(err);
					return res.jsonServerError(null, null, err);
				});
		})
		.catch((err) => {
			console.log(err);
			fs.unlinkSync(
				"uploads/mangas/" +
					language +
					"/" +
					scan_id +
					"/" +
					title +
					"/" +
					req.file.filename
			);
			return res.jsonServerError(null, null, err);
		});
}

async function read(req, res) {
	const { title, manga_id } = req.query;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	let role;

	if (req.role) {
		role = CryptoJs.AES.decrypt(
			req.role,
			`${process.env.SHUFFLE_SECRET}`
		).toString(CryptoJs.enc.Utf8);
		req.role = null;
	} else {
		role = 0;
	}

	if (manga_id) {
		const manga = await Manga.findById(manga_id)
			.select(read_projection[role])
			.exec();
		return res.jsonOK(manga, getMessage("manga.read.success"), new_token);
	} else if (title) {
		const manga = await Manga.find({ title: { $regex: title, $options: "i" } })
			.select(read_projection[role])
			.exec();
		return res.jsonOK(manga, getMessage("manga.read.success"), new_token);
	} else {
		return res.jsonBadRequest(null, null, null);
	}
}

async function list(req, res) {
	const { genre, scan_id, title, type, writer_id, artist_id, recent } =
		req.query;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	let role;

	if (req.role) {
		role = CryptoJs.AES.decrypt(
			req.role,
			`${process.env.SHUFFLE_SECRET}`
		).toString(CryptoJs.enc.Utf8);
		req.role = null;
	} else {
		role = 0;
	}

	let docs = [];
	if (recent) {
		const search = type ? { type: type } : {};
		(
			await Manga.find(search)
				.sort("updatedAt")
				.select({ cover: 1, title: 1, updatedAt: 1 })
		).forEach(function (doc) {
			let temp = {
				_id: doc._id,
				cover: doc.cover,
				title: doc.title,
				updatedAt: doc.updatedAt,
				chapters: [],
			};
			console.log(doc);
			Chapter.find({ manga_id: doc._id })
				.sort("updatedAt")
				.select({ number: 1, _id: 0 })
				.then((chapters) => {
					if (chapters.length !== 0) {
						chapters.forEach(function (chap) {
							temp.chapters.push({ number: chap.number });
						});
					}
				})
				.catch((err) => {
					return res.jsonServerError(null, null, err);
				});
			docs.push(temp);
		});

		console.log(docs);
	} else {
		const search = genre
			? { genre: genre }
			: writer_id
			? { writer_id: writer_id }
			: type
			? { type: type }
			: artist_id
			? { artist_id: artist_id }
			: title
			? { title: { $regex: title, $options: "i" } }
			: scan_id
			? { scan_id: scan_id }
			: {};
		(
			await Manga.find(search).sort("updatedAt").select(list_projection[role])
		).forEach(function (doc) {
			docs.push(doc);
		});
	}

	if (docs.length === 0) {
		return res.jsonNotFound(docs, getMessage("manga.list.empty"), new_token);
	} else {
		docs.forEach(function (doc) {
			doc.user = undefined;
		});
		return res.jsonOK(
			docs,
			getMessage("manga.list.success") + docs.length,
			new_token
		);
	}
}

async function update(req, res) {
	const { writer_id, artist_id, manga_id } = req.body;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	req.body.updatedAt = Date.now();
	let scan_id = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);
	Manga.updateOne({ _id: manga_id, scan_id: scan_id }, req.body)
		.then((manga) => {
			if (writer_id) {
				Author.findById(writer_id)
					.then((author) => {
						cloneData = author.works.filter(function (work_id) {
							return manga_id.toString() !== work_id.toString();
						});
						//update author document
						author.works = cloneData;
						author.updatedAt = Date.now();
						author
							.save()
							.then((answer) => {
								console.log(answer);
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.catch((err) => {
						console.log(err);
					});
			}

			if (artist_id) {
				Author.findById(artist_id)
					.then((author) => {
						cloneData = author.works.filter(function (work_id) {
							return manga_id.toString() !== work_id.toString();
						});
						//update author document
						author.works = cloneData;
						author.updatedAt = Date.now();
						author
							.save()
							.then((answer) => {
								console.log(answer);
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.catch((err) => {
						console.log(err);
					});
			}

			return res.jsonOK(null, getMessage("manga.update.success"), new_token);
		})
		.catch((err) => {
			return res.jsonServerError(null, null, err);
		});
}

async function remove(req, res) {
	const { manga_id } = req.query;
	const manga = await Manga.findById(manga_id);

	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	const scan_id = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);
	req.auth = null;

	if (manga) {
		if (manga.scan_id.toString() === scan_id) {
			const mangas = await Manga.deleteMany({ _id: manga_id });
			//console.log(mangas)

			// update writer and artist documents
			if (mangas.n === 0)
				return res.jsonNotFound(
					mangas,
					getMessage("manga.notfound"),
					new_token
				);

			const scan = await User.findById(scan_id);

			scan.mangas = scan.mangas.filter(function (_id) {
				return _id.toString() !== manga_id.toString();
			});

			scan.save(function (err) {
				// yet another err object to deal with
				if (err) {
					return res.jsonServerError(null, null, err);
				}
			});

			/*(await Chapter.find({manga_id: manga_id})).forEach(function (doc){
                doc.imgCollection.forEach(function (page){                            
                    fs.unlinkSync('uploads/' + manga.title + "/"+ page.filename)  
                })                      
            });
            */
			const chapters = await Chapter.deleteMany({ manga_id: manga_id });

			let dir = "uploads/" + manga.language + "/" + scan_id + "/" + manga.title;

			fs.rmdir(dir, { recursive: true }, (err) => {
				if (err) {
					console.log(err);
				}
			});

			fs.rmdirSync(dir, { recursive: true });

			return res.jsonOK(
				{
					"mangas affected": mangas.deletedCount,
					"chapters affected": chapters.deletedCount,
				},
				null,
				new_token
			);
		}

		return res.jsonUnauthorized(null, null, null);
	}

	return res.jsonBadRequest(null, getMessage("manga.notfound"), new_token);
}

export default { store, read, list, update, remove };
