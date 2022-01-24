import supertest from 'supertest';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { artist, writer, photo } from '../mocks/author.mock.js';
import { user, scan } from '../mocks/user.mock.js';

const itif = condition => (condition ? it : it.skip);
const createAuthor = payload => {
    it('POST /authors', async () => {
        await supertest(app)
            .post('/authors')
            .field(payload)
            .set('Authorization', 'Bearer ' + scan.token)

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
                //expect(response.body.status).toEqual(200);

                expect(response.body).toMatchObject({
                    message: getMessage('author.save.success'),
                    data: schema(payload, photo),
                    metadata: {},
                    status: 200,
                });

                if (payload.type === 'writer')
                    writer._id = response.body.data._id;
                else artist._id = response.body.data._id;
            });
    });

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?author_id=${payload._id}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(payload.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(payload, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const updateAuthor = async (payload, message) => {

    payload.author_id = payload.author_id === 1 ? writer._id : artist._id;
    it(`PUT /authors ${message}`, async () => {
        await supertest(app)
            .put('/authors')
            .send(payload)
            .set('Authorization', 'Bearer ' + scan.token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();
                console.log(response.body);
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
            .get(`/authors/findOne?author_id=${payload.author_id}`)
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
        type: [payload.type],
        photos: [
            {
                originalname: photo.name,
                size: photo.size,
            },
        ],
        works: [],
        socialMedia: payload.socialMedia,
        //_id: '617f58e87ab874251ce7cd58',
        name: payload.name,
        birthDate: payload.birthDate,
        deathDate: null,
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

export { createAuthor, updateAuthor, updateSchema, schema };
