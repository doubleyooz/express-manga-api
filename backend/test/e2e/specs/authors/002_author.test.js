import mongoose from 'mongoose';

import jwt from '../../../../src/utils/jwt.util.js';
import { artist, writer } from '../../../mocks/author.mock.js';
import {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    findAuthor,
    listAuthor,
} from '../../../helpers/author.helper.js';

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

    listAuthor([artist, writer], 2);
    findAuthor(writer);

    updateAuthor({ _id: 1, name: 'George Masara' }, mockToken, 'update name');
    updateAuthor({ _id: 1, types: ['artist'] }, mockToken, 'update type');

    deleteAuthor({ author_id: 1 }, mockToken);
});
