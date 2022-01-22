import supertest from 'supertest';
import fs from 'fs';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { payload, payload2, photo } from '../mocks/author.mock.js';
import { createScan } from '../schemas/user.schema.js';
import { schema } from '../schemas/author.schema.js';


const temp = JSON.parse(fs.readFileSync('test/e2e/tests/temp.json'));

describe('Author', () => {      
    createScan();
    it('POST /authors', async () => {
        await supertest(app)
            .post('/authors')
            .field(payload)
            .set('Authorization', 'Bearer ' + temp.token)

            .attach('photos', photo.dir + photo.name)
            .expect(401)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body.data).toBeDefined();
                expect(response.body.metadata).toBeDefined();
                //expect(response.body.status).toEqual(200);

                expect(response.body).toMatchObject({
                    message: getMessage('author.save.success'),
                    data: schema(payload, photo),
                    metadata: {},
                    status: 200,
                });

                let data = JSON.stringify({
                    artist_id: response.body.data._id,
                });
                fs.writeFileSync('test/e2e/tests/temp.json', data);
            });
    });

    it('POST /authors', async () => {
        await supertest(app)
            .post('/authors')
            .field(payload2)
            .set('Authorization', 'Bearer ' + temp.token)

            .attach('photos', photo.dir + photo.name)
            .expect(200)
            .then(response => {
                // Check type and length

                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body.data).toBeDefined();
                expect(response.body.metadata).toBeDefined();
                expect(response.body.status).toEqual(200);

                global.navigator.writer = response.body.data._id;
                expect(response.body).toMatchObject({
                    message: getMessage('author.save.success'),
                    data: schema(payload2, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /authors 2 documents', async () => {
        await supertest(app)
            .get('/authors')
            .send({})
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.message.startsWith(
                        getMessage('author.list.success'),
                    ),
                ).toBeTruthy();
                expect(response.body.status).toEqual(200);
                expect(response.body).toMatchObject({
                    message: 'Author list retrieved successfully: 2',
                    data: [schema(payload, photo), schema(payload2, photo)],
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?author_id=${global.navigator.writer}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(payload2.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(payload2, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('PUT /authors name', async () => {
        payload2.name = 'Iito Tachibana';
        payload2.author_id = global.navigator.writer;
        await supertest(app)
            .put('/authors')
            .send(payload2)
            .set('Authorization', 'Bearer ' + temp.token)
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

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?author_id=${global.navigator.writer}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(payload2.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(payload2, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('PUT /authors type', async () => {
        payload2.type = 'artist';
        payload2.author_id = global.navigator.writer;

        await supertest(app)
            .put('/authors')
            .send(payload2)
            .set('Authorization', 'Bearer ' + temp.token)
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

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?author_id=${global.navigator.writer}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(payload2.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(payload2, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('DELETE /authors', async () => {
        payload2.type = 'writer';

        await supertest(app)
            .delete(`/authors?author_id=${payload2.author_id}`)

            .set('Authorization', 'Bearer ' + temp.token)
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

    it('GET /authors 1 documents', async () => {
        await supertest(app)
            .get('/authors')
            .send({})
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.message.startsWith(
                        getMessage('author.list.success'),
                    ),
                ).toBeTruthy();
                expect(response.body.status).toEqual(200);
                expect(response.body).toMatchObject({
                    message: 'Author list retrieved successfully: 1',
                    data: [schema(payload, photo)],
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('POST /authors', async () => {
        await supertest(app)
            .post('/authors')
            .field(payload2)
            .set('Authorization', 'Bearer ' + temp.token)

            .attach('photos', photo.dir + photo.name)
            .expect(200)
            .then(response => {
                // Check type and length

                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body.data).toBeDefined();
                expect(response.body.metadata).toBeDefined();
                expect(response.body.status).toEqual(200);

                global.navigator.writer = response.body.data._id;
                expect(response.body).toMatchObject({
                    message: getMessage('author.save.success'),
                    data: schema(payload2, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });
});
