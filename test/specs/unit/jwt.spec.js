import jwt from '../../../src/utils/jwt.util';
import { fake_user, user } from '../../mocks/user.mock';

const describeif = (condition) => (condition ? describe : describe.skip);

describe('Jwt', () => {
    const data = {
        _id: user._id,
        tokenVersion: 0,
    };

    describe('should work', () => {
        it('retrieve the payload from the token', async () => {
            const token = jwt.generateJwt(data, 1);

            let payload = null;
            try {
                payload = jwt.verifyJwt(token, 1);
            } catch (err) {}
            expect({
                _id: payload._id,
                tokenVersion: payload.tokenVersion,
            }).toEqual(data);
        });
    });

    describe('should fail', () => {
        it('retrieve the payload using the wrong key', async () => {
            const token = jwt.generateJwt(data, 1);

            let payload = null;
            try {
                payload = jwt.verifyJwt(token, 2);
            } catch (err) {}
            expect(payload).toEqual(null);
        });

        it('retrieve the payload using the wrong key', async () => {
            const token = jwt.generateJwt(data, 1);

            let payload = null;
            try {
                payload = jwt.verifyJwt(token, 2);
            } catch (err) {}
            expect(payload).toEqual(null);
        });
    });
});