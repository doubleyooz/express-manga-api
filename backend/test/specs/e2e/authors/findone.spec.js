import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import { scanToken } from '../../../mocks/jwt.mock.js';
import { createAuthor, findAuthor } from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;
describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    describeif(!runAll)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);

        findAuthor(writer, mockToken, 200);
    });

    describeif(!runAll)('should reject', () => {
        describeif(!runAll)('invalid arguments', () => {
            describeif(!runAll)('invalid type', () => {
                findAuthor({ _id: 23 }, mockToken, 400);
                findAuthor({ _id: true }, mockToken, 400);
                findAuthor({ _id: false }, mockToken, 400);
                findAuthor({ _id: ['dfsdf'] }, mockToken, 400);
                findAuthor({ _id: [32, 14] }, mockToken, 400);
                findAuthor({ _id: [true, false] }, mockToken, 400);
                findAuthor({}, mockToken, 400);
            });

            describeif(!runAll)('invalid format', () => {
                findAuthor({ _id: 'kKucLRLt9Npgxcep6iWH' }, mockToken, 400);
                findAuthor({ _id: 'QauOFWloK8pnnliczC4r' }, mockToken, 400);
                findAuthor({ _id: 'XhQcXH4sk2mWgGyRurQI' }, mockToken, 400);
                findAuthor({ _id: 'X2O1eZAGsezi8iYlkhmK' }, mockToken, 400);
                findAuthor({ _id: '2HakCJ3w9GfHdTU2AKF4' }, mockToken, 400);
                findAuthor({ _id: '8zWdnQrnN7629FBGVEeK' }, mockToken, 400);
                findAuthor({ _id: 'QWslENGzfhkylBgoAJWx' }, mockToken, 400);
            });

            //prettier-ignore
            describeif(!runAll)('no registered _id', () => {
                findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken, 404);
                findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken, 404);
             
                
            });
        });
    });
});
