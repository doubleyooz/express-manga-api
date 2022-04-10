import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import {
    userToken,
    scanToken,
    corruptedToken,
} from '../../../mocks/jwt.mock.js';
import {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    findAuthor,
    listAuthor,
} from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);
const runAll = false;
describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());
    let mockToken2 = corruptedToken('');

    describeif(!runAll)('should reject', () => {
        
        describeif(!runAll)('invalid token', () => {
            createAuthor(artist, mockToken2, 401);
            createAuthor(writer, mockToken2, 401);
    
            
        });
    });
});
