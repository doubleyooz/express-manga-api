import supertest from 'supertest';

import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import { artist, writer, photo } from '../mocks/author.mock.js';
import { user, scan } from '../mocks/user.mock.js';
import { createUser } from '../schemas/user.schema.js';
import { createAuthor, schema, updateSchema} from '../schemas/author.schema.js';


describe('Author', () => {
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
    createUser(scan);

    createAuthor(artist);
    createAuthor(writer);
    updateAuthor({author_id: 1, name: "George Higashitaka"}, "update name");
   
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
                    data: [schema(artist, photo), schema(writer, photo)],
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /authors/findOne', async () => {
        await supertest(app)
            .get(`/authors/findOne?author_id=${writer._id}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(writer.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(writer, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });

   

    

   


    it('PUT /authors type', async () => {
        writer.type = 'artist';
        writer.author_id = writer._id;

        await supertest(app)
            .put('/authors')
            .send(writer)
            .set('Authorization', 'Bearer ' + scan.token)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();
                console.log(response.body)
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
            .get(`/authors/findOne?author_id=${writer._id}`)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(
                    response.body.data.birthDate.startsWith(writer.birthDate),
                ).toBeTruthy();

                expect(response.body).toMatchObject({
                    message: getMessage('author.findone.success'),
                    data: schema(writer, photo),
                    metadata: {},
                    status: 200,
                });
            });
    });
  
    it('DELETE /authors', async () => {
        writer.type = 'writer';

        await supertest(app)
            .delete(`/authors?author_id=${writer.author_id}`)

            .set('Authorization', 'Bearer ' + scan.token)
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
                    data: [schema(artist, photo)],
                    metadata: {},
                    status: 200,
                });
            });
    });

    createAuthor(writer);
});
