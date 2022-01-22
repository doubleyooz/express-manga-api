import CryptoJs from 'crypto-js';
import supertest from 'supertest';


import { app } from '../../../src/config/express.config.js';
import { getMessage } from '../../../src/utils/message.util.js';
import jwt from '../../../src/utils/jwt.util.js';
import { user, scan, fake_user } from '../mocks/user.mock.js';

const createScan = () => {
    it('POST /sign-up Scan', async () => {
        await supertest(app)
            .post('/sign-up')
            .send(scan)
            .expect(200)
            .then(response => {
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toEqual({
                    message: getMessage('user.activation.account.activate'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
    });

    it('GET /users', async () => {
        await supertest(app)
            .get('/users')
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
                        getMessage('user.list.success'),
                    ),
                ).toBeTruthy();
                
                expect(response.body).toMatchObject({
                    message: getMessage('user.list.success') + '1',
                    data: [schema(scan)],
                    metadata: {},
                    status: 200,
                });
                scan._id = response.body.data[0]._id;
            });
    });

    it('POST /authentication/activate/:tky', async () => {       
        const tkn = jwt.generateJwt(
            {   
                id: CryptoJs.AES.encrypt(
                    scan._id,
                    `${process.env.SHUFFLE_SECRET}`,
                ).toString(),
            },
            3,
        );
        await supertest(app)
            .post('/authentication/activate/' + tkn)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();

                expect(response.body).toEqual({
                    message: getMessage('user.valid.sign_up.success'),
                    data: null,
                    metadata: {},
                    status: 200,
                });
            });
        scan.active = true;
    });

    it('GET /sign-in', async () => {
        await supertest(app)
            .get('/sign-in')
            .auth(scan.email, scan.password)
            .expect(200)
            .then(response => {
                // Check type and length
                expect(
                    typeof response.body === 'object' &&
                        !Array.isArray(response.body) &&
                        response.body !== null,
                ).toBeTruthy();                
                expect(response.body).toMatchObject({
                    message: getMessage('user.valid.sign_in.success'),
                    data: sign_in(scan),
                    metadata: {},
                    status: 200,
                });
                scan.token = response.body.metadata.token;
            });
    });
};

const schema = payload => {
    return {
        role: payload.role,
        mangas: [],
        manga_alert: [],
        likes: [],
        reviews: [],
        token_version: 0,
        active: payload.active,
        resetLink: '',
        email: payload.email,
        name: payload.name,

        __v: 0,
    };
};

const sign_in = payload => {
    return {
        role: payload.role,
        token_version: 0,
        _id: payload._id,
    };
};

export { createScan, schema, sign_in };
