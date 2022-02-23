import mongoose from 'mongoose';

import { manga, manga2 } from '../../../mocks/manga.mock.js';
import { chapter, chapter2 } from '../../../mocks/chapter.mock.js';
import { userToken, scanToken } from '../../../mocks/jwt.mock.js';

import {
    createChapter,
  
} from '../../../helpers/chapter.helper.js';
import {
    createManga,
  
} from '../../../helpers/manga.helper.js';


describe('Chapter', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    createManga(manga, mockToken)
    chapter.manga_id = manga.title;
    createChapter(chapter, mockToken);
    //createChapter(chapter2, mockToken);

   
});
