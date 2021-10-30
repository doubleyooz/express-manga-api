import dotenv from "dotenv";
import supertest from "supertest";
import setupDB from "./test-setup.js";
import jwt from "../../src/common/jwt.js";
import CryptoJs from "crypto-js";

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
	_id: "",
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
		.post("/sign-up")
		.send({
			email: payload.email_true,
			password: payload.password_true,
			name: payload.name,
			role: payload.role_scan,
		})
		.expect(200)
		.then((response) => {
			// Check type and length
			
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();
			/*
			expect(
				response.body.message.startsWith(
					"Please check your email to activate your account."
				)
			).toBeTruthy();
			expect(response.body.status).toEqual(200);
			payload._id = response.body.data
			*/
			expect(response.body).toEqual({
				message: "Please check your email to activate your account.",
				data: null,
				metadata: {},
				status: 200,
			});
		});
});

test("GET /user/list", async () => {
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
			payload._id = response.body.data[0]._id
			
		});
});


test("POST /authentication/activate/:tky", async () => {
	const tkn = jwt.generateJwt(
		{
			id: CryptoJs.AES.encrypt(
				payload._id.toString(),
				`${process.env.SHUFFLE_SECRET}`
			).toString(),
		},
		3
	);
	await supertest(app)
		.post("/authentication/activate/" + tkn)		
		.expect(200)
		.then((response) => {
			// Check type and length			
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();
			
			expect(response.body).toEqual({
				message: "Successful registration. Please log in to your account to proceed.",
				data: null,
				metadata: {},
				status: 200,
			});		

		

		});
});


test("GET /sign-in", async () => {
	await supertest(app)
		.get("/sign-in")
		.auth( payload.email_true,  payload.password_true)
		.expect(200)
		.then((response) => {
			// Check type and length
			console.log(response.body);
			expect(
				typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
			).toBeTruthy();

			expect(response.body.message).toEqual("Successful login.");
			expect(response.body.data).toBeDefined();
			expect(response.body.metadata.token).toBeDefined();
			expect(response.body.status).toEqual(200);

			expect(response.body.data).toEqual({
				role: "Scan",
				token_version: 0,
				_id: payload._id,
			});
		});
});
