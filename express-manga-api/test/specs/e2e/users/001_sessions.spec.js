import supertest from "supertest";

import { app } from "../../../../src/config/express.config.js";
import { user, scan, fake_user } from "../../../mocks/user.mock.js";
import { createUser, schema, sign_in } from "../../../helpers/user.helper.js";
import { getMessage } from "../../../../src/services/message.util.js";

const itif = (condition) => (condition ? it : it.skip);
const describeif = (condition) => (condition ? describe : describe.skip);
const runAll = true;

describe("Session createUser", () => {
  describeif(runAll)("should accept", () => {
    createUser(scan);
    createUser(user);
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
            data: null,
            metadata: {},
            status: 200,
          });
        });
    });
    it("GET /users", async () => {
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
            response.body.message.startsWith(getMessage("user.list.success"))
          ).toBeTruthy();

          expect(response.body).toMatchObject({
            message: getMessage("user.list.success") + "2",
            data: [schema(scan), schema(user)],
            metadata: {},
            status: 200,
          });
        });
    });

    itif(state)("GET /sign-in Fake Email", async () => {
      await supertest(app)
        .get("/sign-in")
        .send({
          email: fake_user.email,
          password: user.false,
        })
        .expect(401)
        .then((response) => {
          // Check type and length
          expect(
            typeof response.body === "object" &&
              !Array.isArray(response.body) &&
              response.body !== null
          ).toBeTruthy();
          console.log(response.body);
          expect(response.body).toEqual({
            message: getMessage("default.unauthorized"),
            data: null,
            metadata: {},
            status: 401,
          });
        });
    });

    itif(state)("GET /sign-in Weak Password", async () => {
      await supertest(app)
        .get("/sign-in")
        .send({
          email: user.email,
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
        });
    });
  });
});
