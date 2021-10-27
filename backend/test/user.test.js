import dotenv from "dotenv";
import supertest from "supertest";
import setupDB from "./test-setup.js";
import { app } from "../src/config/express.js";

const payload = {
	email: `${process.env.TEST_GMAIL}`,
	password: `${process.env.TEST_GMAIL_PASS}`,
};

setupDB("test");

test("GET /", async () => {
	await supertest(app)
		.get("/")
		.expect(200)
		.then((response) => {
			// Check type and length

			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();

			expect(response.body).toEqual({
				message: "Hello World",
				data: null,
				metadata: {},
				status: 200,
			});
		});
});

test("GET /sign-in", async () => {
	await supertest(app)
		.get("/sign-in")
		.send({ payload })
		.expect(401)
		.then((response) => {
			// Check type and length
			console.log(response.body);
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();

			expect(response.body).toEqual({
				message: "Unauthorized.",
				data: null,
				metadata: {},
				status: 401,
			});
		});
});
