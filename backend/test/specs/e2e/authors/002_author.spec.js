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

describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());
    let mockToken2 = corruptedToken('');
    describeif(false)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);

        listAuthor([artist, writer], 2);
        findAuthor(writer);

        updateAuthor(
            { _id: 1, name: 'George Masara' },
            mockToken,
            'update name',
        );
        updateAuthor({ _id: 1, types: ['artist'] }, mockToken, 'update type');

        deleteAuthor({ author_id: 1 }, mockToken);
    });

    describeif(true)('should reject', () => {
        describeif(true)('invalid arguments', () => {
            describeif(true)('invalid names', () => {
                let temp = artist;
                temp.name = 2;
                createAuthor(temp, mockToken, 400);

                temp.name = [''];
                createAuthor(temp, mockToken, 400);

                temp.name = {...artist};
                createAuthor(temp, mockToken, 400);

                temp.name = '';
                createAuthor(temp, mockToken, 400);

                temp.name = 'more than 20 characters for sure';
                createAuthor(temp, mockToken, 400);

                delete temp.name;
                createAuthor(temp, mockToken, 400);
            });

            describeif(false)('invalid types', () => {
                let temp = artist;                
                temp.types = 'saas';
                createAuthor(temp, mockToken, 400);

                temp.types = ['saas'];
                createAuthor(temp, mockToken, 400);

                temp.types = 3;
                createAuthor(temp, mockToken, 400);

                temp.types = ['writer', 'dasdas'];
                createAuthor(temp, mockToken, 400);

                temp.types = ['artist', 'dasdas'];
                createAuthor(temp, mockToken, 400);

                temp.types = ['artist', 'writer', 'something'];
                createAuthor(temp, mockToken, 400);
            });
        });

        describeif(false)('invalid token', () => {
            createAuthor(bad_artist, mockToken2, 401);
        });

       
    });
});
