import supertest from 'supertest';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { artist, writer, photo } from '../mocks/author.mock.js';

const createAuthor = (payload) => {
    it('POST /authors', async () => {
        console.log(scan);
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
}

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

export { createAuthor, schema };
