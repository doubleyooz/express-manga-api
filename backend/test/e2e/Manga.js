import supertest from "supertest";
import { app } from "../../src/config/express.js";
import { getMessage } from "../../src/common/messages.js";
import { payload, photo } from "./mocks/Manga.js";
import { manga } from "./schemas/Manga.js";


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

			.attach("cover", photo.dir + photo.name)
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
				).toBeTruthy();
				expect(response.body).toMatchObject({
					data: manga(payload),
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
			.set("Authorization", "Bearer " + global.navigator.token)
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
						manga(payload),
					],
					metadata: {},
					status: 200,
				});
				payload.manga_id = response.body.data[0]._id				
			});
	});

	it("PUT /manga title", async () => {
		payload.title = "Gantz";
		console.log(payload)
		await supertest(app)
			.put("/mangas")
			.send(payload)
			.set("Authorization", "Bearer " + global.navigator.token)
			.expect(400)
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
