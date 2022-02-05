import { manga } from '../../../mocks/manga.mock.js';
import { photo } from '../../../mocks/image.mock.js';
import {
    schema,
    createManga,
    updateManga,
} from '../../../helpers/manga.helper.js';
import jwt from '../../../../src/utils/jwt.util.js';

describe('Manga', () => {
    let mockToken = jwt.generateJwt(
        {
            _id: manga.scan_id,
            role: 'Scan',
            token_version: 0,
        },
        1,
    );

    createManga(manga, mockToken);
    updateManga({ title: 'Gantz' }, mockToken, 'update name');
});

//fs.unlinkSync('./test/e2e/tests/scan.json');
