import supertest from "supertest";
import { app } from "../../src/config/express.js";

const payload = {
	name: "Kentarou Kishima",
	type: "artist",
	birthDate: "2008-05-22",
	socialMedia: ["orkut", "twitter"],
	biography: "A nice and sexy person",
};

const payload2 = {
	name: "Abe Yamamoto",
	type: "writer",
	birthDate: "1990-08-02",
	socialMedia: ["reddit", "twitter"],
	biography: "A tough and gloom person",
};

export const authorTests = () => {
	it("POST /author", async () => {
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

				expect(response.body.message).toEqual("Successful request.");
				expect(response.body.data).toBeDefined();
				expect(response.body.metadata).toBeDefined();
				expect(response.body.status).toEqual(200);

				global.navigator.artist = response.body.data._id;
				expect(response.body).toMatchObject({
					message: "Successful request.",
					data: {
						type: ["artist"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["orkut", "twitter"],
						//_id: '617f58e87ab874251ce7cd58',
						name: "Kentarou Kishima",
						birthDate: "2008-05-22T03:00:00.000Z",
						deathDate: null,
						biography: "A nice and sexy person",
						//createdAt: '2021-11-01T03:03:04.290Z',
						//updatedAt: '2021-11-01T03:03:04.290Z',
						__v: 0,
					},
					metadata: {},
					status: 200,
				});
			});
	});

	it("POST /author", async () => {
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

				expect(response.body.message).toEqual("Successful request.");
				expect(response.body.data).toBeDefined();
				expect(response.body.metadata).toBeDefined();
				expect(response.body.status).toEqual(200);

				global.navigator.writer = response.body.data._id;
				expect(response.body).toMatchObject({
					message: "Successful request.",
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						//_id: '617f58e87ab874251ce7cd5c',
						name: "Abe Yamamoto",
						birthDate: "1990-08-02T03:00:00.000Z",
						deathDate: null,
						biography: "A tough and gloom person",
						//createdAt: '2021-11-01T03:03:04.482Z',
						//updatedAt: '2021-11-01T03:03:04.482Z',
						__v: 0,
					},
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /author/list", async () => {
		await supertest(app)
			.get("/author/list")
			.send({})
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				expect(
					response.body.message.startsWith("Author list retrieved successfully")
				).toBeTruthy();
				expect(response.body.status).toEqual(200);
				expect(response.body).toMatchObject({
					message: "Author list retrieved successfully: 2",
					data: [
						{
							type: ["artist"],
							photos: [
								{
									originalname: "__tiger_the_great.jpg",
									size: 103280,
								},
							],
							works: [],
							socialMedia: ["orkut", "twitter"],

							name: "Kentarou Kishima",
							birthDate: "2008-05-22T03:00:00.000Z",
							deathDate: null,
							biography: "A nice and sexy person",

							__v: 0,
						},
						{
							type: ["writer"],
							photos: [
								{
									originalname: "__tiger_the_great.jpg",
									size: 103280,
								},
							],
							works: [],
							socialMedia: ["reddit", "twitter"],
							name: "Abe Yamamoto",
							birthDate: "1990-08-02T03:00:00.000Z",
							deathDate: null,
							biography: "A tough and gloom person",

							__v: 0,
						},
					],
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /author/read", async () => {
		await supertest(app)
			.get("/author/read")
			.send({ author_id: global.navigator.writer })
			.expect(400)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);
				expect(
					response.body.message.startsWith("Author list retrieved successfully")
				).toBeTruthy();
				expect(response.body.status).toEqual(200);
				expect(response.body).toMatchObject({
					message: "Author retrieved successfully!",
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						name: "Abe Yamamoto",
						birthDate: "1990-08-02T03:00:00.000Z",
						deathDate: null,
						biography: "A tough and gloom person",

						__v: 0,
					},

					metadata: {},
					status: 200,
				}).catch (e => {
					console.log(e)
				});
			});
	});
};
