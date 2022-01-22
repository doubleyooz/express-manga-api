import supertest from 'supertest';
import fs from 'fs';
import path from 'path';

import { app } from '../../../src/config/express.config.js';
import { user, scan, fake_user } from '../mocks/user.mock.js';
import { createScan, schema, sign_in } from '../schemas/user.schema.js';
import { getMessage } from '../../../src/utils/message.util.js';

const itif = condition => (condition ? it : it.skip);

describe('Session', () => {
    let state = true;
    it('GET /', async () => {
        await supertest(app)
            .get('/')
            .expect(200)
            .then(response => {
                // Check type and length

                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toEqual({
                    message: getMessage('default.return'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
    });

    itif(state)('GET /sign-in Must Fail', async () => {
        await supertest(app)
            .get('/sign-in')
            .send({
                email: fake_user.email,
                password: fake_user.false,
            })
            .expect(401)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toEqual({
                    message: getMessage('default.unauthorized'),
                    data: null,
                    metadata: {},
                    status: 401,
                });
            });
    });

    createScan();
});
