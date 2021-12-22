import dotenv from "dotenv";
import supertest from "supertest";
import jwt from "../../../src/common/jwt.js";
import CryptoJs from "crypto-js";

import { app } from "../../../src/config/express.js";
import { user, scan, fake_user } from "../mocks/User.js";
import { schema, sign_in } from "../schemas/User.js"
import { wrapper } from "../helpers/Wrapper.js"
import { getMessage } from "../../../src/common/messages.js";

dotenv.config({ path: '.env.test' });


const itif = (condition) => condition ? it : it.skip;

export const sessionTests = () => {
	itif(wrapper.runAll)("GET /", async () => {
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
					data: null,
					metadata: {},
					status: 200,
				});
			}).catch(err => {
				wrapper.status = false;
				throw new Error(err);
			});
	}
	)

	itif(wrapper.status)("GET /sign-in Must Fail", async () => {
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
			}).catch(err => {
				wrapper.status = false;
				throw new Error(err);
			});;
	});

	itif(wrapper.status)("POST /sign-up Scan", async () => {
		const response =
			await supertest(app)
				.post("/sign-up")
				.send(scan);

		try {
			// Check type and length				
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
		} catch(err) {			
			wrapper.status = false;
			throw new Error(err);
		};
		
		console.log("here")
		
		
		

	});


	itif(wrapper.status)("GET /users", async () => {

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
			}).catch(err => {
				wrapper.status = false;
				throw new Error(err);
			});
		
		console.log(wrapper.status)

	});

	itif(wrapper.status)("POST /authentication/activate/:tky", async () => {
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
			}).catch(err => {
				wrapper.status = false;
				throw new Error(err);
			});;
	});

	itif(wrapper.status)("GET /sign-in", async () => {
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
			}).catch(err => {
				wrapper.status = false;
				throw new Error(err);
			});;
	});
};
