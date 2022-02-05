import supertest from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../../src/config/express.config.js';
import { getMessage } from '../../../../src/utils/message.util.js';
import { artist, writer, photo } from '../../../mocks/author.mock.js';
import { user, scan } from '../../../mocks/user.mock.js';
import { createUser } from '../../../helpers/user.helper.js';
import {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    schema,
    updateSchema,
} from '../../../helpers/author.helper.js';
import jwt from '../../../../src/utils/jwt.util.js';

describe('Author', () => {
    let mockToken = jwt.generateJwt(
        {
            _id: mongoose.Types.ObjectId(),
            role: 'Scan',
            token_version: 0,
        },
        1,
    );

    createAuthor(artist, mockToken);
    
    createAuthor(writer, mockToken);

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
            .get(`/authors/findOne?_id=${writer._id}`)
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

    updateAuthor(
        { _id: 1, name: "George Masara" },
        mockToken,
        'update name',
    );
    updateAuthor({ _id: 1, types: ['artist'] }, mockToken, 'update type');

    deleteAuthor({ author_id: 1 }, mockToken);
});
