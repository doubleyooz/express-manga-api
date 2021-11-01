import supertest from "supertest";
import { app } from "../../src/config/express.js";

const payload = {
	name: "Kentarou Kishima",
	type: "artist",
	birthday: "2008-05-22",
	socialMedia: ["orkut", "twitter"],
	biography: "A nice and sexy person",
};

const payload2 = {
	name: "Abe Yamamoto",
	type: "writer",
	birthday: "1990-08-02",
	socialMedia: ["reddit", "twitter"],
	biography: "A tough and gloom person",
};

export const authorTests = () => {
	it("POST /author", async () => {
		console.log(global.navigator);
		await supertest(app)
			.post("/author")
			.field(payload)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("photos", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				/*expect(response.body).toEqual({
					message: "Hello World",
					data: null,
					metadata: {},
					status: 200,
				});*/
			});
	});

	it("POST /author", async () => {
		console.log(global.navigator);
		await supertest(app)
			.post("/author")
			.field(payload2)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("photos", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				/*expect(response.body).toEqual({
					message: "Hello World",
					data: null,
					metadata: {},
					status: 200,
				});*/
			});
	});
};
