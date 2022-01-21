const payload = {
    title: 'Berserk',
    genres: ['action', 'horror', 'fantasy', 'psychological'],
    synopsis: 'A sad manga following a story of guy seeking revenge',
    artist_id: '',
    writer_id: '',
    scan_id: '',
    type: 'manga',
    themes: ['demons', 'ghosts', 'magic', 'supernatural'],
    n_chapters: 354,
    status: 2,
    languages: ['en', 'pt'],
    nsfw: 'true',
    manga_id: '',
    __v: 0,
};

const photo = {
    dir: `${process.env.DIR_PATH}`,
    name: 'abc.jpg',
    size: 63595,
};

export { payload, photo };
