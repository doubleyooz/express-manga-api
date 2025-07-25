import { getMessage } from "../../src/services/message.util.js";
import { request } from "../config/connection.config.js";
import { photo } from "../mocks/image.mock.js";
import { manga } from "../mocks/manga.mock.js";

function createManga(payload, token) {
  it("POST /mangas", async () => {
    await request
      .post("/mangas")
      .set("Authorization", `Bearer ${token}`)
      .field(payload)
      .attach("imgCollection", photo.dir + photo.name)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body.data).toBeDefined();
        expect(response.body.metadata).toBeDefined();

        expect(response.body).toMatchObject({
          message: getMessage("manga.save.success"),
          data: schema(payload, photo),
          metadata: {},
          status: 200,
        });

        payload._id = response.body.data._id;
      });
  });

  it("GET /mangas/findOne ", async () => {
    await request
      .get(`/mangas/findOne?_id=${payload._id}`)

      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("manga.findone.success"),
          data: schema(payload),
          metadata: {},
          status: 200,
        });
      });
  });
}

function updateManga(payload, token, message) {
  it(`PUT /mangas ${message}`, async () => {
    payload._id = payload._id === 1 ? manga._id : manga2._id;
    await request
      .put("/mangas")
      .send(payload)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("manga.update.success"),
          data: null,
          metadata: {},
          status: 200,
        });
        let bool = payload._id === manga._id;
        Object.keys(payload).forEach((value) => {
          if (bool)
            manga[value] = payload[value];
          else manga2[value] = payload[value];
        });
      });
  });

  it("GET check previous PUT operation", async () => {
    await request
      .get(`/mangas/findOne?_id=${payload._id}`)
      .send({})
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("manga.findone.success"),
          data: payload,
          metadata: {},
          status: 200,
        });
      });
  });
}

function findManga(payload, byId) {
  it(`GET /mangas/findOne?${byId ? "_id=" : "title="}`, async () => {
    const path = byId
      ? `/mangas/findOne?_id=${payload._id}`
      : `/mangas/findOne?title=${payload.title}`;
    await request
      .get(path)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("manga.findone.success"),
          data: schema(payload, photo),
          metadata: {},
          status: 200,
        });
      });
  });
}

function listManga(payload, number) {
  it(`GET /mangas ${number} documents`, async () => {
    await request
      .get("/mangas")
      .send({})
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        payload.sort((a, b) => (a.synopsis > b.synopsis ? 1 : -1));
        response.body.data.sort((a, b) => (a.synopsis > b.synopsis ? 1 : -1));

        expect(response.body).toMatchObject({
          message: getMessage("manga.list.success") + number,
          data: payload.map((x) => {
            return schema(x, photo);
          }),
          metadata: {},
          status: 200,
        });
      });
  });
}

function deleteManga(payload, token) {
  it("DELETE /mangas", async () => {
    await request
      .delete(`/mangas?_id=${payload._id}&sas=asas`)

      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body.data["mangas affected"]).toEqual(1);
        expect(response.body.data["chapters affected"]).toEqual(
          expect.any(Number),
        );
        expect(
          response.body.message.startsWith(getMessage("manga.delete.success")),
        ).toBeTruthy();
      });
  });

  it("GET /mangas/findOne", async () => {
    await request
      .get(`/mangas/findOne?_id=${payload._id}`)
      .expect(404)
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
          status: 404,
        });
      });
  });
}

function schema(payload) {
  return {
    genres: payload.genres,
    languages: payload.languages,
    n_chapters: payload.n_chapters,
    nsfw: payload.nsfw === "true",
    rating: 0,
    status: 2,
    synopsis: payload.synopsis,
    themes: payload.themes,
    title: payload.title,
    type: payload.type,
  };
}

export { createManga, deleteManga, findManga, listManga, updateManga };
