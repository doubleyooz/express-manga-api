import supertest from "supertest";
import { app } from "../../src/config/express.js";

const payload = {
	title: "Berserk",
	genres: ["action", "horror", "fantasy", "psychological"],
	synopsis: "A sad manga following a story of guy seeking revenge",
	writer_id: "",
	artist_id: "",
	type: "manga",
	themes: ["demons", "ghosts", "magic", "supernatural"],
	n_chapters: 354,
	status: 2,
	language: "en",
	nsfw: "true",
};

export const mangaTests = () => {
	it("GET /user/list", async () => {
		await supertest(app)
			.get("/user/list")
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
					response.body.message.startsWith(
						"User list retrieved successfully! Users found:"
					)
				).toBeTruthy();
				expect(response.body.status).toEqual(200);
				console.log(response.body)
			});
	});


	it("POST /manga", async () => {
		console.log(global.navigator)
		await supertest(app)
			.post("/manga")
			.field(payload)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach('cover', 'C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg')
			.expect(200)
			.then((response) => {
				// Check type and length
	
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				expect(response.body).toEqual({
					message: "Hello World",
					data: null,
					metadata: {},
					status: 200,
				});
			});
	});
	
}
