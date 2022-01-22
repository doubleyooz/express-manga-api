import supertest from 'supertest';
import fs from 'fs';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { payload, photo } from '../mocks/manga.mock.js';
import { schema } from '../schemas/manga.schema.js';

const describeif = condition => (condition ? describe : describe.skip);
const temp = JSON.parse(fs.readFileSync('test/e2e/tests/temp.json'));

describe('Manga', () => {
    it('POST /mangas', async () => {
        payload.scan_id = global.navigator.scan_id;
        payload.writer_id = global.navigator.writer;
        payload.artist_id = global.navigator.artist;

        await supertest(app)
            .post('/mangas')
            .field(payload)
            .set('Authorization', 'Bearer ' + temp.token)

            .attach('cover', photo.dir + photo.name)
            .expect(200)
            .then(response => {
                // Check type and length

                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();
                expect(response.body).toMatchObject({
                    data: schema(payload),
                    message: getMessage('manga.save.success'),
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /mangas ', async () => {
        await supertest(app)
            .get('/mangas')
            .send({})
            .set('Authorization', 'Bearer ' + temp.token)
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
                    data: [schema(payload)],
                    metadata: {},
                    status: 200,
                });
                payload.manga_id = response.body.data[0]._id;
            });
    });

    it('PUT /manga title', async () => {
        payload.title = 'Gantz';
        await supertest(app)
            .put('/mangas')
            .send(payload)
            .set('Authorization', 'Bearer ' + temp.token)
            .expect(400)
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
});

//fs.unlinkSync('./test/e2e/tests/temp.json');
