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
	manga.rating += rating;

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
	const { review_id, text, rating } = req.body;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	req.body.updatedAt = Date.now();
	let user_id = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);

	const doesUserExists = await User.exists({ _id: user_id });

	if (doesUserExists) {
		Review.findById({ _id: review_id })
			.then((review) => {
				let temp = -review.rating + rating;
				review.rating = rating;
				review.text = text;

				Manga.findById({ _id: review.manga_id })
					.then((manga) => {
						manga.rating += temp;
						manga
							.save()
							.then(() => {
								review.save().then(() => {
									return res.jsonOK(
										null,
										getMessage("review.update.success"),
										new_token
									);
								}).catch((err) => {
									return res.jsonServerError(null, null, err);
								})
							
							})
							.catch((err) => {
								return res.jsonServerError(null, null, err);
							});
					})
					.catch((err) => {
						return res.jsonServerError(null, null, err);
					});
			})
			.catch((err) => {
				console.log(err)
				return res.jsonNotFound(err, getMessage("review.notfound"), new_token);
			});
	} else {
		return res.jsonBadRequest(null, null, new_token);
	}
}

async function remove(req, res) {
	const { review_id } = req.query;
	const review = await Review.findById(review_id);

	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	const user_id = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);

	req.auth = null;

	if (review) {
		if (review.user_id.toString() === user_id) {
			const response = await Review.deleteOne({ _id: review_id });

			// `1` if MongoDB deleted a doc, `0` if no docs matched the filter `{ name: ... }`
			if (response.n === 0)
				return res.jsonNotFound(
					response,
					getMessage("review.notfound"),
					new_token
				);

			const user = await User.findById(user_id);

			user.reviews = user.reviews.filter(function (_id) {
				return _id.toString() !== review_id.toString();
			});

			const manga = await Manga.findById(review.manga_id);
			manga.rating -= review.rating;
			manga.reviews = manga.reviews.filter(function (_id) {
				return _id.toString() !== review_id.toString();
			});

			user.save(function (err) {
				// yet another err object to deal with
				if (err) {
					return res.jsonServerError(null, null, err);
				}
			});

			manga.save(function (err) {
				// yet another err object to deal with
				if (err) {
					return res.jsonServerError(null, null, err);
				}
			});

			return res.jsonOK(null, getMessage("review.deleted"), new_token);
		} else return res.jsonUnauthorized(null, null, null);
	} else
		return res.jsonNotFound(null, getMessage("review.notfound"), new_token);
}

export default { store, read, list, update, remove };
