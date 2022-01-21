const payload = {
    name: 'Kentarou Kishima',
    type: 'artist',
    birthDate: '2008-05-22T03:00:00.000Z',
    socialMedia: ['orkut', 'twitter'],
    biography: 'A nice and sexy person',
    author_id: '',
};
const payload2 = {
    name: 'Abe Yamamoto',
    type: 'writer',
    birthDate: '1990-08-02T03:00:00.000Z',
    socialMedia: ['reddit', 'twitter'],
    biography: 'A tough and gloom person',
    author_id: '',
};

const photo = {
    dir: `${process.env.DIR_PATH}`,
    name: 'abc.jpg',
    size: 63595,
};

export { payload, payload2, photo };
