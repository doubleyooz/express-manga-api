import { manga, manga2 } from '../../../mocks/manga.mock.js';

import {
    createManga,
    updateManga,
    findManga,
    listManga,
    deleteManga,
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
    createManga(manga2, mockToken);

    updateManga({ title: 'Gantz', _id: 1 }, mockToken, 'update name');
    findManga(manga, true);
    findManga(manga2, true);
    findManga(manga);
    listManga([manga2, manga], 2);

    deleteManga(manga, mockToken);
});
