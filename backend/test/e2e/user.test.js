import dotenv from "dotenv";
import supertest from "supertest";
import setupDB from "./test-setup.js";
import { app } from "../../src/config/express.js";

const payload = {
	email_true: `${process.env.TEST_GMAIL}`,
	email_false: `25 + ${process.env.TEST_GMAIL}`,
	password_true: `${process.env.TEST_GMAIL_PASS_2}`,
	password_false: `${process.env.TEST_GMAIL_PASS}`,
	name: "Jojo",
	role_scan: "Scan",
	role_user: "User",
	fake_role1: "dasas",
	fake_role2: "scan",
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
		.send({ email: payload.email_false, password: payload.password_false })
		.expect(401)
		.then((response) => {
			// Check type and length
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

test("POST /sign-up", async () => {
	await supertest(app)
		.get("/sign-up")
		.send({
			email: payload.email_true,
			password: payload.password_true,
			name: payload.name,
			role: payload.role_scan,
		})
		.expect(200)
		.then((response) => {
			// Check type and length
			console.log(response.body);
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();

		

			expect(response.body.data).toEqual(	
				{
					message: "Successful resgistration. Please log in to your account to proceed.",
					data: null,
					metadata: null,
					status: 200,
				}
						
			);
		});
});

test("GET /sign-in", async () => {
	await supertest(app)
		.get("/sign-in")
		.send({ payload })
		.expect(200)
		.then((response) => {
			// Check type and length
			console.log(response.body);
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();

			expect(response.body.message).toEqual("Successful login");
			expect(response.body.data).toBeDefined();
			expect(response.body.metadata.token).toBeDefined();
			expect(response.body.status).toEqual(200);

			expect(response.body.data).toEqual({
				role: "Scan",
				token_version: 0,
				_id: "617c0d84e58a4922c0101b15",
			});
		});
});
