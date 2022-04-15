import supertest from 'supertest';

import { app } from '../../src/config/express.config.js';
import { getMessage } from '../../src/utils/message.util.js';
import { artist, writer } from '../mocks/author.mock.js';
import { photo } from '../mocks/image.mock.js';

const itif = condition => (condition ? it : it.skip);
const createAuthor = (payload, token, statusCode) => {
    it('POST /authors', async () => {
        await supertest(app)
            .post('/authors')
            .field(payload)
            .set('Authorization', 'Bearer ' + token)
            .attach('imgCollection', photo.dir + photo.name)
            .then(response => {
                //console.log(response.body);
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.data).toBeDefined();
                        expect(response.body.metadata).toBeDefined();

                        expect(
                            response.body.data.birthDate.startsWith(
                                payload.birthDate,
                            ),
                        ).toBeTruthy();
                        response.body.data.imgCollection.forEach(element => {
                            expect(
                                element.filename.endsWith(photo.name),
                            ).toBeTruthy();
                        });

                        expect(response.body).toMatchObject({
                            message: getMessage('author.save.success'),
                            data: schema(payload, photo),
                            metadata: {},
                            status: 200,
                        });

                        if (
                            payload.types.includes('writer') ||
                            payload.types === 'writer'
                        )
                            writer._id = response.body.data._id;
                        else artist._id = response.body.data._id;
                        break;

                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: expect.any(String),
                            status: 400,
                        });
                        break;

                    case 401:
                        expect(response.status).toEqual(401);
                        break;

                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?_id=${payload._id}`)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (response.statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body).toMatchObject({
                            message: getMessage('author.findone.success'),
                            data: schema(payload, photo),
                            metadata: {},
                            status: 200,
                        });
                        break;
                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: expect.any(String),
                            status: 400,
                        });
                        break;
                    case 401:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('author.notfound'),
                            data: null,
                            metadata: expect.any(String),
                            status: 404,
                        });
                        break;

                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('author.notfound'),
                            data: null,
                            metadata: expect.any(String),
                            status: 404,
                        });
                        break;
                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
};

const findAuthor = (payload, token, statusCode) => {
    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?_id=${payload._id}`)
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.data).toBeDefined();
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('author.findone.success'),
                            data: schema(payload, photo),
                            metadata: {},
                            status: 200,
                        });
                        break;
                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body.data).toBeDefined();
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: {},
                            status: 400,
                        });
                        break;
                    case 404:
                        expect(response.status).toEqual(404);
                        expect(response.body.data).toBeDefined();
                        expect(response.body.metadata).toBeDefined();

                        expect(response.body).toMatchObject({
                            message: getMessage('author.notfound'),
                            data: null,
                            metadata: {},
                            status: 404,
                        });
                        break;
                    default:
                        expect(3).toBe(2);
                        break;
                }
            });
    });
};

const listAuthor = (payload, documents, token, statusCode) => {
    it(`GET /authors ${documents.length} documents`, async () => {
        let path = '/authors';
        let temp = payload.types ? payload.types.length : 0;
        switch (temp) {
            case 0:
                path = payload.name
                    ? payload.name.length
                        ? path +
                          `?name=${payload.name[0]}&name=${payload.name[1]}`
                        : path + `?name=${payload.name}`
                    : path;
                break;
            case 1:
                path = payload.name
                    ? path + `?name=${payload.name}&types=${payload.types[0]}`
                    : path + `?types=${payload.types[0]}`;
                break;
            case 2:
                path = payload.name
                    ? path +
                      `?name=${payload.name}&types=${payload.types[0]}&types=${payload.types[1]}`
                    : path +
                      `?types=${payload.types[0]}}&types=${payload.types[1]}`;
            default:
                break;
        }

        await supertest(app)
            .get(path)
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.body.status).toEqual(200);
                        expect(response.body).toMatchObject({
                            message:
                                getMessage('author.list.success') +
                                `: ${documents.length}`,
                            data: documents.map(x => {
                                return schema(x, photo);
                            }),
                            metadata: {},
                            status: 200,
                        });
                        break;
                    case 400:
                        expect(response.body.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: {},
                            status: 400,
                        });
                        break;
                    case 404:
                        expect(response.body.status).toEqual(404);
                        expect(response.body).toMatchObject({
                            message: getMessage('author.list.empty'),
                            data: [],
                            metadata: {},
                            status: 404,
                        });
                        break;
                    default:
                        expect(3).toBe(2);
                        break;
                }
            });
    });
};

const deleteAuthor = (payload, token) => {
    it('DELETE /authors', async () => {
        payload._id = payload._id === 1 ? writer._id : artist._id;
        await supertest(app)
            .delete(`/authors?_id=${payload._id}`)

            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body.data.mangas).toBeDefined();
                expect(response.body.data.removed).toBeTruthy();
                expect(
                    response.body.message.startsWith(
                        getMessage('author.delete.success'),
                    ),
                ).toBeTruthy();
            });
    });

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?_id=${payload._id}`)
            .expect(404)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.notfound'),
                    data: null,
                    metadata: {},
                    status: 404,
                });
            });
    });
};

const updateAuthor = (payload, token, message) => {
    it(`PUT /authors ${message}`, async () => {
        payload._id = payload._id === 1 ? writer._id : artist._id;

        await supertest(app)
            .put('/authors')
            .send(payload)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.update.success'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET check previous PUT operation', async () => {
        await supertest(app)
            .get(`/authors/findOne?_id=${payload._id}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: payload,
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const schema = (payload, photo) => {
    return {
        types:
            typeof payload.types === 'string' || payload.types instanceof String
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
        //_id: '617f58e87ab874251ce7cd58',
        name: payload.name,
        biography: payload.biography,
        __v: 0,
    };
};

const updateSchema = payload => {
    return {
        type: [payload.type],
        _id: payload._id,
        name: payload.name,
    };
};

export { createAuthor, updateAuthor, listAuthor, findAuthor, deleteAuthor };
