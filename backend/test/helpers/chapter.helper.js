import supertest from 'supertest';

import { app } from '../../src/config/express.config.js';
import { chapter } from '../mocks/chapter.mock.js';
import { photo } from '../mocks/image.mock.js';
import { getMessage } from '../../src/utils/message.util.js';

const createChapter = (payload, token) => {
    it('POST /chapters', async () => {
        const request = supertest(app);
        let filledArray = new Array(10).fill(photo.dir + photo.name);

        let requestInstance = request
            .post('/chapters')
            .set('Authorization', 'Bearer ' + token)
            .field(payload);

        for (const file of filledArray) {
            // no need to reassign requestInstance because it's same instance
            // requestInstance = requestInstance.attach('file', file);
            requestInstance.attach('imgCollection', file);
        }
        await requestInstance.expect(200).then(response => {
            // Check type and length
            expect(
                typeof response.body === 'object' &&
                    !Array.isArray(response.body) &&
                    response.body !== null,
            ).toBeTruthy();
          
            expect(response.body.data.imgCollection.length).toBe(filledArray.length);
            expect(response.body.data).toBeDefined();
            expect(response.body.metadata).toBeDefined();

            expect(response.body).toMatchObject({
                message: getMessage('chapter.save.success'),
                data: schema(payload),
                metadata: {},
                status: 200,
            });

            payload._id = response.body.data._id;
        });
    });

    it('GET /chapters/findOne ', async () => {
        await supertest(app)
            .get(`/chapters/findOne?_id=${payload._id}`)

            .set('Authorization', 'Bearer ' + token)
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
                    message: getMessage('chapter.findone.success'),
                    data: schema(payload),
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const updateChapter = (payload, token, message) => {
    it(`PUT /chapters ${message}`, async () => {
        payload._id = payload._id === 1 ? chapter._id : chapter2._id;
        await supertest(app)
            .put('/chapters')
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
                    message: getMessage('chapter.update.success'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
                let bool = payload._id === chapter._id;
                Object.keys(payload).forEach(function (value) {
                    if (bool) chapter[value] = payload[value];
                    else chapter2[value] = payload[value];
                });
            });
    });

    it('GET check previous PUT operation', async () => {
        await supertest(app)
            .get(`/chapters/findOne?_id=${payload._id}`)
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

                expect(response.body).toMatchObject({
                    message: getMessage('chapter.findone.success'),
                    data: payload,
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const findChapter = (payload, byId) => {
    it(`GET /chapters/findOne?${byId ? '_id=' : 'title='}`, async () => {
        const path = byId
            ? `/chapters/findOne?_id=${payload._id}`
            : `/chapters/findOne?title=${payload.title}`;
        await supertest(app)
            .get(path)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('manga.findone.success'),
                    data: schema(payload, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const listChapter = (payload, number) => {
    it(`GET /chapters ${number} documents`, async () => {
        await supertest(app)
            .get('/chapters')
            .send({})
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                payload.sort((a, b) => (a.synopsis > b.synopsis ? 1 : -1));
                response.body.data.sort((a, b) =>
                    a.synopsis > b.synopsis ? 1 : -1,
                );

                expect(response.body).toMatchObject({
                    message: getMessage('manga.list.success') + number,
                    data: payload.map(x => {
                        return schema(x, photo);
                    }),
                    metadata: {},
                    status: 200,
                });
            });
    });
};

const deleteChapter = (payload, token) => {
    it('DELETE /chapters', async () => {
        await supertest(app)
            .delete(`/chapters?_id=${payload._id}`)

            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body.data['chapters affected']).toEqual(1);
                expect(response.body.data['chapters affected']).toEqual(
                    expect.any(Number),
                );
                expect(
                    response.body.message.startsWith(
                        getMessage('manga.delete.success'),
                    ),
                ).toBeTruthy();
            });
    });

    it('GET /chapters/findOne', async () => {
        await supertest(app)
            .get(`/chapters/findOne?_id=${payload._id}`)
            .expect(404)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('manga.notfound'),
                    data: null,
                    metadata: {},
                    status: 404,
                });
            });
    });
};

const schema = payload => {
    return {
        manga_id: payload.manga_id,
        title: payload.title,
        number: payload.number,
        language: payload.language,
    };
};

export { createChapter, updateChapter };
