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

    describeif(!runAll)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);
        
        listAuthor({}, [artist, writer], mockToken, 200);
        findAuthor(writer, mockToken, 200);
    
        updateAuthor(
            { _id: 1, name: 'George Masara' },
            mockToken,
            'update name',
        );
        updateAuthor({ _id: 1, types: ['artist'] }, mockToken, 'update type');

        deleteAuthor({ author_id: 1 }, mockToken);
    });

    describeif(runAll)('should reject', () => {
     
    });
});
