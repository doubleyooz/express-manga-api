import { getMessage } from "../../src/services/message.util.js";
import { request } from "../config/connection.config.js";
import { review } from "../mocks/review.mock.js";

function createReview(payload, token) {
  it("POST /reviews", async () => {
    await request
      .post("/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
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
          message: getMessage("review.save.success"),
          data: schema(payload),
          metadata: {},
          status: 200,
        });

        payload._id = response.body.data._id;
      });
  });

  it("GET /reviews/findOne ", async () => {
    await request
      .get(`/reviews/findOne?_id=${payload._id}`)
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
          message: getMessage("review.findone.success"),
          data: schema(payload),
          metadata: {},
          status: 200,
        });
      });
  });
}

function updateReview(payload, token, message) {
  it(`PUT /reviews ${message}`, async () => {
    payload._id = payload._id === 1 ? review._id : review2._id;
    await request
      .put("/reviews")
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
        let bool = payload._id === review._id;
        Object.keys(payload).forEach((value) => {
          if (bool)
            review[value] = payload[value];
          else review2[value] = payload[value];
        });
        expect(response.body).toMatchObject({
          message: getMessage("review.update.success"),
          data: payload,
          metadata: {},
          status: 200,
        });
      });
  });

  it("GET check previous PUT operation", async () => {
    await request
      .get(`/reviews/findOne?_id=${payload._id}`)
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
          message: getMessage("review.findone.success"),
          data: payload,
          metadata: {},
          status: 200,
        });
      });
  });
}

function findReview(payload) {
  it("GET /reviews/findOne", async () => {
    await request
      .get(`/reviews/findOne?_id=${payload._id}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("review.findone.success"),
          data: schema(payload),
          metadata: {},
          status: 200,
        });
      });
  });
}

function listReview(payload, selection, number) {
  it(`GET /reviews ${number} documents`, async () => {
    const path = selection.user_id
      ? `/reviews?user_id=${selection.user_id}`
      : selection.mangaId
        ? `/reviews??mangaId=${selection.mangaId}`
        : `/reviews`;
    await request
      .get(path)
      .send()
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        payload.sort((a, b) => (a.text > b.text ? 1 : -1));
        response.body.data.sort((a, b) => (a.text > b.text ? 1 : -1));

        expect(response.body).toMatchObject({
          message: getMessage("review.list.success") + number,
          data: payload.map((x) => {
            return schema(x);
          }),
          metadata: {},
          status: 200,
        });
      });
  });
}

function deleteReview(payload, token) {
  it("DELETE /reviews", async () => {
    await request
      .delete(`/reviews?_id=${payload._id}`)

      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(
          response.body.message.startsWith(getMessage("review.delete.success")),
        ).toBeTruthy();
      });
  });

  it("GET /reviews/findOne", async () => {
    await request
      .get(`/reviews/findOne?_id=${payload._id}`)
      .expect(404)
      .then((response) => {
        // Check type and length
        expect(
          typeof response.body === "object"
          && !Array.isArray(response.body)
          && response.body !== null,
        ).toBeTruthy();

        expect(response.body).toMatchObject({
          message: getMessage("review.notfound"),
          data: null,
          metadata: {},
          status: 404,
        });
      });
  });
}

function schema(payload) {
  return {
    text: payload.text,
    rating: payload.rating,
    mangaId: payload.mangaId,
  };
}

export { createReview, deleteReview, findReview, listReview, updateReview };
