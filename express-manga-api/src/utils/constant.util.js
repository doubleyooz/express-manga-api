export const MANGA_PROJECTION = {
  0: {
    title: 1,
    genre: 1,
    synopsis: 1,
    nChapters: 1,
    status: 1,
    nsfw: 1,
    rating: 1,
    imgCollection: 1,
    type: 1,
    likes: 1,
    themes: 1,
    genres: 1,
    languages: 1,
    writerId: 1,
    artistId: 1,
    _id: 0,
  },
  1: {
    updatedAt: 1,
    createdAt: 1,
    title: 1,
    genre: 1,

    type: 1,
    synopsis: 1,
    nChapters: 1,
    _id: 1,
    languages: 1,
    nsfw: 1,
    status: 1,
    writerId: 1,
    artistId: 1,
    owner: 1,
    rating: 1,
    themes: 1,
    genres: 1,
    likes: 1,

    imgCollection: 1,
  },
  2: {
    _id: 1,
    __v: 1,
    title: 1,
    genre: 1,
    synopsis: 1,
    nChapters: 1,
    imgCollection: 1,
    rating: 1,
    writerId: 1,
    artistId: 1,
    type: 1,
    themes: 1,
    genres: 1,
    nsfw: 1,
    status: 1,
    languages: 1,
    likes: 1,
  },
};

export const CHAPTER_PROJECTION = {
  0: {
    title: 1,
    imgCollection: 1,
    views: 1,
    _id: 1,
  },
  1: {
    title: 1,
    imgCollection: 1,
    views: 1,
    number: 1,
    mangaId: 1,
    language: 1,
    updatedAt: 1,
    createdAt: 1,
    _id: 1,
  },
  2: {
    title: 1,
    imgCollection: 1,
    views: 1,
    language: 1,
    _id: 1,
  },
};

export const AUTHOR = "Author";
export const USER = "User";
export const READER = "Reader";
export const SCAN = "Scan";
export const MANGA = "Manga";
export const CHAPTER = "Chapter";
export const REVIEW = "Review";
