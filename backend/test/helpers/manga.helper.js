import supertest from 'supertest';

import { app } from '../../src/config/express.config.js';
import { manga } from '../mocks/manga.mock.js';
import { photo } from '../mocks/image.mock.js';
import { getMessage } from '../../src/utils/message.util.js';

const createManga = (payload, token) => {
    it('POST /mangas', async () => {
        await supertest(app)
            .post('/mangas')
            .set('Authorization', 'Bearer ' + token)
            .field(payload)
            .attach('imgCollection', photo.dir + photo.name)
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
                manga._id = response.body.data._id;
                expect(response.body).toMatchObject({
                    message: getMessage('manga.save.success'),
                    data: schema(payload, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /mangas ', async () => {
        await supertest(app)
            .get('/mangas')
            .send({})
            .set('Authorization', 'Bearer ' + token)
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
                        getMessage('manga.list.success'),
                    ),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('manga.list.success') + '1',
                    data: [schema(manga)],
                    metadata: {},
                    status: 200,
                });
                manga._id = response.body.data[0]._id;
            });
    });
};

const updateManga = (payload, token, message) => {
    it(`PUT /mangas ${message}`, async () => {
        payload._id = manga._id;       
        await supertest(app)
            .put('/mangas')
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
                    message: getMessage('manga.update.success'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET check previous PUT operation', async () => {
        await supertest(app)
            .get('/mangas')
            .send({})
            .set('Authorization', 'Bearer ' + token)
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
                        getMessage('manga.list.success'),
                    ),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('manga.list.success') + '1',
                    data: [schema(manga)],
                    metadata: {},
                    status: 200,
                });
                manga.manga_id = response.body.data[0]._id;
            });
    });
};

const schema = payload => {
    return {
        genres: payload.genres,
        languages: payload.languages,
        n_chapters: payload.n_chapters,
        nsfw: payload.nsfw === 'true',
        rating: 0,
        status: 2,
        synopsis: payload.synopsis,
        themes: payload.themes,
        title: payload.title,
        type: payload.type,
    };
};

export { createManga, updateManga, schema };
