import supertest from "supertest";
import { app } from "../../src/config/express.js";

const payload = {
	title: "Berserk",
	genres: ["action", "horror", "fantasy", "psychological"],
	synopsis: "A sad manga following a story of guy seeking revenge",

	type: "manga",
	themes: ["demons", "ghosts", "magic", "supernatural"],
	n_chapters: 354,
	status: 2,
	language: "en",
	nsfw: "true",
};

export const mangaTests = () => {
	it("POST /mangas", async () => {
		console.log(global.navigator);
		payload.scan_id = global.navigator.scan_id;
		payload.writer_id = global.navigator.writer;
		payload.artist_id = global.navigator.artist;

		await supertest(app)
			.post("/manga")
			.field(payload)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("cover", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				expect(response.body).toMatchObject({
					data: {
						__v: 0,

						genres: ["action", "horror", "fantasy", "psychological"],
						language: "en",

						n_chapters: 354,
						nsfw: true,
						rating: 0,

						status: 2,
						synopsis: "A sad manga following a story of guy seeking revenge",
						themes: ["demons", "ghosts", "magic", "supernatural"],
						title: "Berserk",
						type: "manga",
					},
					message: "Manga added!",
					metadata: {},
					status: 200,
				});
			});
	});
};
