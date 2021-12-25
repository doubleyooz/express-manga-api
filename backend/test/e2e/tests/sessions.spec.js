import dotenv from "dotenv";
import supertest from "supertest";
import jwt from "../../../src/common/jwt.js";
import CryptoJs from "crypto-js";

import { app } from "../../../src/config/express.js";
import { user, scan, fake_user } from "../mocks/User.js";
import { schema, sign_in } from "../schemas/User.js";
import { getMessage } from "../../../src/common/messages.js";

dotenv.config({ path: '.env.test' });


const itif = (condition) => condition ? it : it.skip;

describe("Session", () => {
	let state = true;
	it("GET /", async () => {
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
					message: getMessage("default.return"),
					data: 2,
					metadata: {},
					status: 200,
				});
			}).catch(err => {
				state = false;
				throw new Error(err)
			})
	})

	console.log(state)

	itif(state)("GET /sign-in Must Fail", async () => {
		await supertest(app)
			.get("/sign-in")
			.send({
				email: fake_user.email,
				password: fake_user.false,
			})
			.expect(401)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
				).toBeTruthy();

				expect(response.body).toEqual({
					message: getMessage("default.unauthorized"),
					data: null,
					metadata: {},
					status: 401,
				});
			})
	});

	itif(state)("POST /sign-up Scan", async () => {

		await supertest(app)
			.post("/sign-up")
			.send(scan)
			.expect(200)
			.then((response) => {
				expect(
					typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
				).toBeTruthy();

				expect(response.body).toEqual({
					message: getMessage("user.activation.account.activate"),
					data: 2,
					metadata: {},
					status: 200,
				});
			})
	});


	itif(state)("GET /users", async () => {

		await supertest(app)
			.get("/users")
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
						getMessage("user.list.success")
					)
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: getMessage("user.list.success") + "1",
					data: [
						schema(scan),
					],
					metadata: {},
					status: 200,
				});
				scan._id = response.body.data[0]._id;
			})


	});

	itif(state)("POST /authentication/activate/:tky", async () => {
		console.log(`${process.env.SHUFFLE_SECRET}`)
		const tkn = jwt.generateJwt(
			{
				id: CryptoJs.AES.encrypt(
					scan._id.toString(),
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
					message: getMessage("user.valid.sign_up.success"),
					data: null,
					metadata: {},
					status: 200,
				});
			})
	});

	itif(state)("GET /sign-in", async () => {
		await supertest(app)
			.get("/sign-in")
			.auth(scan.email, scan.password)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
					!Array.isArray(response.body) &&
					response.body !== null
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: getMessage("user.valid.sign_in.success"),
					data: sign_in(scan),
					metadata: {},
					status: 200,
				});

				global.navigator = {
					token: response.body.metadata.token,
					scan_id: scan._id
				};
			})
	});

});
