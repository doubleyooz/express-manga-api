import mongoose from 'mongoose';

import { getMessage } from '../../../../src/utils/message.util.js';
import { request } from '../../../config/connection.config.js';
import { artist, writer } from '../../../mocks/author.mock.js';
import { photo } from '../../../mocks/image.mock.js';
import { scanToken } from '../../../mocks/jwt.mock.js';
import { createAuthor } from '../../../helpers/author.helper.js';

describe('test', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());
    let payload = writer;
    console.log(photo);
    it('POST /authors', async () => {
        request
            .post('/authors')
            .field(writer)
            .set('Authorization', 'Bearer ' + mockToken)
            .attach('imgCollection', photo.dir + photo.name)
            .then(response => {
                console.log(response.body);
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                switch (statusCode) {
                    case 200:
                        expect(response.status).toEqual(200);
                        expect(response.body.data).toBeDefined();
                        expect(response.body.metadata).toBeDefined();

                        expect(
                            response.body.data.birthDate.startsWith(
                                payload.birthDate,
                            ),
                        ).toBeTruthy();
                        response.body.data.imgCollection.forEach(element => {
                            expect(
                                element.filename.endsWith(photo.name),
                            ).toBeTruthy();
                        });

                        expect(response.body).toMatchObject({
                            message: getMessage('author.save.success'),
                            data: schema(payload, photo),
                            metadata: {},
                            status: 200,
                        });

                        if (
                            payload.types.includes('writer') ||
                            payload.types === 'writer'
                        )
                            writer._id = response.body.data._id;
                        else artist._id = response.body.data._id;
                        break;

                    case 400:
                        expect(response.status).toEqual(400);
                        expect(response.body).toMatchObject({
                            message: getMessage('default.badRequest'),
                            data: null,
                            metadata: expect.any(String),
                            status: 400,
                        });
                        break;

                    case 401:
                        expect(response.status).toEqual(401);
                        break;

                    default:
                        expect(2).toBe(3);
                        break;
                }
            });
    });
    //createAuthor(artist, mockToken, 200);
    //createAuthor(writer, mockToken, 200);
});
