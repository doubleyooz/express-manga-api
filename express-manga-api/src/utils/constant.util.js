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
    userId: 1,
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
export const ROLES = {
  SCAN: "Scan",
  READER: "Reader",
};
export const MANGA = "Manga";
export const CHAPTER = "Chapter";
export const COVER = "Cover";
export const REVIEW = "Review";
export const IMAGE = "Image";

export const genres = [
  "action",
  "adventure",
  "boys' love",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "girls' love",
  "historical",
  "horror",
  "isekai",
  "magical girls",
  "mecha",
  "medical",
  "mystery",
  "philosophical",
  "psychological",
  "romance",
  "sci-fi",
  "slice of life",
  "sports",
  "superhero",
  "thriller",
  "tragedy",
  "wuxia",
];

export const themes = [
  "aliens",
  "animals",
  "cooking",
  "crossdressing",
  "deliquents",
  "demons",
  "genderswap",
  "ghosts",
  "gyaru",
  "harem",
  "incest",
  "loli",
  "mafia",
  "magic",
  "martial arts",
  "military",
  "monster girls",
  "monsters",
  "music",
  "ninja",
  "office workers",
  "police",
  "post-apocalyptic",
  "reincarnation",
  "reverse harem",
  "samurai",
  "school life",
  "shota",
  "supernatural",
  "survival",
  "time travel",
  "traditional games",
  "vampires",
  "video games",
  "villainess",
  "virtual reality",
  "zombies",
];

export const mangaType = ["manga", "manhwa", "manhua"];

export const languages = [
  "pt",
  "da",
  "nl",
  "en",
  "fi",
  "fr",
  "de",
  "hu",
  "it",
  "nb",

  "ro",
  "ru",
  "tr",
  "es",
];
