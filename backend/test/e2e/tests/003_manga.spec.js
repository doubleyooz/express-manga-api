import supertest from 'supertest';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { artist, writer } from '../mocks/author.mock.js';
import { manga, photo } from '../mocks/manga.mock.js';
import { user, scan } from '../mocks/user.mock.js';
import { schema } from '../schemas/manga.schema.js';
import { createAuthor } from '../schemas/author.schema.js';
import { createScan } from '../schemas/user.schema.js';



describe('Manga', () => {
    createScan();

    createAuthor(artist);
    createAuthor(writer);

    it('POST /mangas', async () => {
        manga.scan_id = scan._id;
        manga.writer_id = writer._id;
        manga.artist_id = artist._id;

        await supertest(app)
            .post('/mangas')
            .field(manga)
            .set('Authorization', 'Bearer ' + scan.token)

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
            .set('Authorization', 'Bearer ' + scan.token)
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
        console.log(manga)
        await supertest(app)
            .put('/mangas')
            .send(manga)
            .set('Authorization', 'Bearer ' + scan.token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();
                console.log(response.body.metadata)
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
