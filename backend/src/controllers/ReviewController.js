import fs from "fs";
import CryptoJs from "crypto-js";

import Manga from "../models/Manga.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

import { getMessage } from "../common/messages.js";

async function store(req, res) {
	const { manga_id, text, rating } = req.body;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	const current_user = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);
	req.auth = null;

	const user = await User.findById(current_user);

	const manga = await Manga.findById(manga_id);

	const doesReviewExist = await Review.exists({
		user_id: current_user,
		manga_id: manga_id,
	});

	if (doesReviewExist) {
		return res.jsonNotFound(
			null,
			getMessage("review.error.duplicate"),
			new_token
		);
	}

	const review = new Review({
		text: text,
		rating: rating,
		user_id: current_user,
		manga_id: manga_id,
	});

	manga.reviews.push(review._id);
	user.reviews.push(review._id);

	manga.updatedAt = Date.now();
	user.updatedAt = Date.now();

	manga
		.save()
		.then(() => {
			user
				.save()
				.then(() => {
					review
						.save()
						.then(() => {
							return res.jsonOK(
								null,
								getMessage("review.save.success"),
								new_token
							);
						})
						.catch((err) => {
							console.log(err);
							return res.jsonServerError(null, null, err.toString());
						});
				})
				.catch((err) => {
					console.log(err);
					return res.jsonServerError(null, null, err.toString());
				});
		})
		.catch((err) => {
			console.log(err);
			return res.jsonServerError(null, null, err.toString());
		});
}

async function read(req, res) {
	const { review_id } = req.query;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	Review.findById(review_id)
		.then((review) => {
			if (review)
				return res.jsonOK(review, getMessage("review.read.success"), new_token);
			return res.jsonNotFound(null, getMessage("review.notfound"), new_token);
		})
		.catch((err) => {
			return res.jsonServerError(null, null, new_token);
		});
}

async function list(req, res) {
	const { user_id, manga_id } = req.query;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	if (user_id) {
		Review.find({ user_id: user_id })
			.then((docs) => {
				return res.jsonOK(docs, getMessage("review.list.success"), new_token);
			})
			.catch((err) => {
				return res.jsonNotFound(null, getMessage("review.notfound"), new_token);
			});
	} else {
		Review.find({ manga_id: manga_id })
			.then((docs) => {
				return res.jsonOK(docs, getMessage("review.list.success"), new_token);
			})
			.catch((err) => {
				return res.jsonNotFound(null, getMessage("review.notfound"), new_token);
			});
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
					.then((writer) => {
						cloneData = writer.works.filter(function (work_id) {
							return manga_id.toString() !== work_id.toString();
						});
						//update writer document
						writer.works = cloneData;
						writer.updatedAt = Date.now();
						writer
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
					.then((artist) => {
						cloneData = artist.works.filter(function (work_id) {
							return manga_id.toString() !== work_id.toString();
						});
						//update artist document
						artist.works = cloneData;
						artist.updatedAt = Date.now();
						artist
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

			let dir = "uploads/" + manga.title;

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
