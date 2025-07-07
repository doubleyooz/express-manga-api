import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import { getMessage } from "../../src/services/message.util.js";
import { request } from "../config/connection.config.js";
import { artist, writer } from "../mocks/author.mock.js";
import { photo } from "../mocks/image.mock.js";

const itif = condition => (condition ? it : it.skip);
function createAuthor(payload, token, statusCode) {
  it("POST /authors", async () => {
    request
      .post("/authors")
      .field(payload)
      .set("Authorization", `Bearer ${token}`)
      .attach("imgCollection", photo.dir + photo.name)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();
        switch (statusCode) {
          case 200:
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(
              response.body.data.birthDate.startsWith(payload.birthDate),
            ).toBeTruthy();
            response.body.data.imgCollection.forEach((element) => {
              expect(element.filename.endsWith(photo.name)).toBeTruthy();
            });

            expect(response.body).toMatchObject({
              message: getMessage("author.save.success"),
              data: schema(payload, photo),
              metadata: {},
              status: HttpStatusCodes.OK,
            });

            if (payload.types.includes("writer") || payload.types === "writer")
              writer._id = response.body.data._id;
            else artist._id = response.body.data._id;
            break;

          case 400:
            expect(response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
              message: HttpStatusMessages.BAD_REQUEST,
              data: null,
              metadata: expect.any(String),
              status: HttpStatusCodes.BAD_REQUEST,
            });
            break;

          case 401:
            expect(response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
            break;

          default:
            expect(2).toBe(3);
            break;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });

  it("GET /authors/findOne", async () => {
    request.get(`/authors/findOne?_id=${payload._id}`).then((response) => {
      // Check type and length
      expect(
        typeof response.body === "object"
        && !Array.isArray(response.body)
        && response.body !== null,
      ).toBeTruthy();

      switch (response.statusCode) {
        case 200:
          expect(response.status).toEqual(HttpStatusCodes.OK);
          expect(response.body).toMatchObject({
            message: getMessage("author.findone.success"),
            data: schema(payload, photo),
            metadata: {},
            status: HttpStatusCodes.OK,
          });
          break;
        case 400:
        case 401:
          expect(response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
          expect(response.body).toMatchObject({
            message: HttpStatusMessages.BAD_REQUEST,
            data: null,
            metadata: expect.any(String),
            status: HttpStatusCodes.BAD_REQUEST,
          });
          break;

        case 404:
          expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
          expect(response.body).toMatchObject({
            message: HttpStatusMessages.NOT_FOUND,
            data: null,
            metadata: expect.any(String),
            status: HttpStatusCodes.NOT_FOUND,
          });
          break;
        default:
          expect(2).toBe(3);
          break;
      }
    });
  });
}

function findAuthor(payload, token, statusCode) {
  it("GET /authors/findOne", async () => {
    request
      .get(`/authors/findOne?_id=${payload._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        switch (statusCode) {
          case 200:
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(response.body).toMatchObject({
              message: getMessage("author.findone.success"),
              data: schema(payload, photo),
              metadata: {},
              status: HttpStatusCodes.OK,
            });
            break;
          case 400:
            expect(response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(response.body).toMatchObject({
              message: HttpStatusMessages.BAD_REQUEST,
              data: null,
              metadata: {},
              status: HttpStatusCodes.BAD_REQUEST,
            });
            break;
          case 404:
            expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(response.body).toMatchObject({
              message: HttpStatusMessages.NOT_FOUND,
              data: null,
              metadata: {},
              status: HttpStatusCodes.NOT_FOUND,
            });
            break;
          default:
            expect(3).toBe(2);
            break;
        }
      });
  });
}

function listAuthor(payload, documents, token, statusCode) {
  it(`GET /authors ${documents.length} documents`, async () => {
    let path = "/authors";
    let temp = payload.types ? payload.types.length : 0;
    switch (temp) {
      case 0:
        path = payload.name
          ? Array.isArray(payload.name)
            ? `${path}?name=${payload.name[0]}&name=${payload.name[1]}`
            : `${path}?name=${payload.name}`
          : path;
        break;
      case 1:
        path = payload.name
          ? `${path}?name=${payload.name}&types=${payload.types[0]}`
          : `${path}?types=${payload.types[0]}`;
        break;
      case 2:
        path = payload.name
          ? `${path
          }?name=${payload.name}&types=${payload.types[0]}&types=${payload.types[1]}`
          : `${path}?types=${payload.types[0]}&types=${payload.types[1]}`;
      default:
        break;
    }

    request
      .get(path)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();
        console.log("list", response.body);
        switch (statusCode) {
          case 200:
            expect(response.body.status).toEqual(HttpStatusCodes.OK);
            expect(response.body).toMatchObject({
              message:
                `${getMessage("author.list.success")}: ${documents.length}`,
              data: documents.map((x) => {
                return schema(x, photo);
              }),
              metadata: {},
              status: HttpStatusCodes.OK,
            });
            break;
          case 400:
            expect(response.body.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
              message: HttpStatusMessages.BAD_REQUEST,
              data: null,
              metadata: {},
              status: HttpStatusCodes.BAD_REQUEST,
            });
            break;
          case 404:
            expect(response.body.status).toEqual(HttpStatusCodes.NOT_FOUND);
            expect(response.body).toMatchObject({
              message: getMessage("author.list.empty"),
              data: [],
              metadata: {},
              status: HttpStatusCodes.NOT_FOUND,
            });
            break;
          default:
            expect(3).toBe(2);
            break;
        }
      });
  });
}

function deleteAuthor(payload, token) {
  it("DELETE /authors", async () => {
    payload._id = payload._id === 1 ? writer._id : artist._id;
    request
      .delete(`/authors?_id=${payload._id}`)

      .set("Authorization", `Bearer ${token}`)
      .expect(HttpStatusCodes.OK)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body.data.mangas).toBeDefined();
        expect(response.body.data.removed).toBeTruthy();
        expect(
          response.body.message.startsWith(getMessage("author.delete.success")),
        ).toBeTruthy();
      });
  });

  it("GET /authors/findOne", async () => {
    request
      .get(`/authors/findOne?_id=${payload._id}`)
      .expect(HttpStatusCodes.NOT_FOUND)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: HttpStatusMessages.NOT_FOUND,
          data: null,
          metadata: {},
          status: HttpStatusCodes.NOT_FOUND,
        });
      });
  });
}

function updateAuthor(payload, token, message, statusCode) {
  it(`PUT /authors ${message}`, async () => {
    payload._id = payload._id === 1 ? writer._id : artist._id;

    request
      .put("/authors")
      .send(payload)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        switch (statusCode) {
          case 200:
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(response.body).toMatchObject({
              message: getMessage("author.update.success"),
              data: null,
              metadata: {},
              status: HttpStatusCodes.OK,
            });

            break;

          case 400:
            expect(response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
              message: HttpStatusMessages.BAD_REQUEST,
              data: null,
              metadata: {},
              status: HttpStatusCodes.BAD_REQUEST,
            });
            break;

          case 401:
            expect(response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
            break;

          default:
            expect(2).toBe(3);
            break;
        }
      });
  });

  it("GET check previous PUT operation", async () => {
    request.get(`/authors/findOne?_id=${payload._id}`).then((response) => {
      // Check type and length
      expect(
        typeof response.body === "object"
        && !Array.isArray(response.body)
        && response.body !== null,
      ).toBeTruthy();

      switch (statusCode) {
        case 200:
          expect(response.status).toEqual(HttpStatusCodes.OK);
          if (payload.birthDate)
            payload.birthDate = `${payload.birthDate}T03:00:00.000Z`;
          if (payload.deathDate)
            payload.deathDate = `${payload.deathDate}T03:00:00.000Z`;
          expect(response.body).toMatchObject({
            message: getMessage("author.findone.success"),
            data: payload,
            metadata: {},
            status: HttpStatusCodes.OK,
          });
          break;
        case 400:
          expect(response.status).toEqual(HttpStatusCodes.OK);

          if (!(payload._id && Object.keys(payload).length === 1))
            expect(response.body.data).not.toMatchObject(payload);
          expect(response.body).toMatchObject({
            message: getMessage("author.findone.success"),
            metadata: {},
            status: HttpStatusCodes.OK,
          });
          break;
        case 401:
          expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
          expect(response.body).toMatchObject({
            message: HttpStatusMessages.NOT_FOUND,
            data: null,
            metadata: expect.any(String),
            status: HttpStatusCodes.NOT_FOUND,
          });
          break;

        case 404:
          expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
          expect(response.body).toMatchObject({
            message: HttpStatusMessages.NOT_FOUND,
            data: null,
            metadata: expect.any(String),
            status: HttpStatusCodes.NOT_FOUND,
          });
          break;
        default:
          expect(2).toBe(3);
          break;
      }
    });
  });
}

function schema(payload, photo) {
  return {
    types:
      typeof payload.types === "string" || payload.types instanceof String
        ? [payload.types]
        : payload.types,
    imgCollection: [
      {
        mimetype: photo.mimetype,
        size: photo.size,
      },
    ],
    works: [],
    socialMedia: payload.socialMedia,
    // _id: '617f58e87ab874251ce7cd58',
    name: payload.name,
    biography: payload.biography,
    __v: 0,
  };
}

function updateSchema(payload) {
  return {
    type: [payload.type],
    _id: payload._id,
    name: payload.name,
  };
}

export { createAuthor, deleteAuthor, findAuthor, listAuthor, updateAuthor };
