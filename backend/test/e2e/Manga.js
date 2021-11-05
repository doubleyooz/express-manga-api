import supertest from "supertest";
import { app } from "../../src/config/express.js";
import { getMessage } from "../../src/common/messages.js";

const payload = {
	title: "Berserk",
	genres: ["action", "horror", "fantasy", "psychological"],
	synopsis: "A sad manga following a story of guy seeking revenge",

	type: "manga",
	themes: ["demons", "ghosts", "magic", "supernatural"],
	n_chapters: 354,
	status: 2,
	languages: ['en', 'pt'],
	nsfw: "true",
	manga_id: ""
};

export const mangaTests = () => {
	it("POST /mangas", async () => {
		console.log(global.navigator);
		payload.scan_id = global.navigator.scan_id;
		payload.writer_id = global.navigator.writer;
		payload.artist_id = global.navigator.artist;

		await supertest(app)
			.post("/mangas")
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
				expect(response.body).toMatchObject({
					data: {
						__v: 0,

						genres: ["action", "horror", "fantasy", "psychological"],
						languages: ['en', 'pt'],
						n_chapters: 354,
						nsfw: true,
						rating: 0,

						status: 2,
						synopsis: "A sad manga following a story of guy seeking revenge",
						themes: ["demons", "ghosts", "magic", "supernatural"],
						title: "Berserk",
						type: "manga",
					},
					message: getMessage("manga.save.success"),
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /mangas ", async () => {
		await supertest(app)
			.get("/mangas")
			.send({})
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.message.startsWith(getMessage("manga.list.success"))
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: getMessage("manga.list.success") + "1",
					data: [
						{
							genres: ["action", "horror", "fantasy", "psychological"],
							languages: ['en', 'pt'],
							n_chapters: 354,
							nsfw: true,
							rating: 0,
							status: 2,
							synopsis: "A sad manga following a story of guy seeking revenge",
							themes: ["demons", "ghosts", "magic", "supernatural"],
							title: "Berserk",
							type: "manga",
						},
					],
					metadata: {},
					status: 200,
				});
				payload.manga_id = response.body.data[0]._id
			});
	});

	it("PUT /manga title", async () => {
		payload.title = "Sentouin Hakenshimasu";	
		await supertest(app)
			.put("/mangas")
			.send(payload)
			.set("Authorization", "Bearer " + global.navigator.token)
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
					message: getMessage("manga.update.success"),
					data: null,
					metadata: {},
					status: 200,
				});
			});
	});
};
