import supertest from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../../src/config/express.config.js';
import { getMessage } from '../../../../src/utils/message.util.js';
import { manga, photo } from '../../../mocks/manga.mock.js';
import { user, scan } from '../../../mocks/user.mock.js';
import { schema } from '../../../helpers/manga.helper.js';
import jwt from '../../../../src/utils/jwt.util.js';

describe('Manga', () => {
    manga.scan_id = mongoose.Types.ObjectId();
    manga.writer_id = mongoose.Types.ObjectId();
    manga.artist_id = mongoose.Types.ObjectId();
    let mockToken = jwt.generateJwt(
        {
            id: manga.scan_id,
            role: 'Scan',
            token_version: 0,
        },
        1,
    );

    it('POST /mangas', async () => {     
        console.log(manga)
        await supertest(app)
            .post('/mangas')
            .field(manga)
            .set('Authorization', 'Bearer ' + mockToken)

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
                    data: schema(manga),
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
            .set('Authorization', 'Bearer ' + mockToken)
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

    it('PUT /manga title', async () => {
        manga.title = 'Gantz';
        await supertest(app)
            .put('/mangas')
            .send(manga)
            .set('Authorization', 'Bearer ' + mockToken)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();
                console.log(response.body.metadata);
                expect(response.body).toMatchObject({
                    message: getMessage('manga.update.success'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
    });
});

//fs.unlinkSync('./test/e2e/tests/scan.json');
