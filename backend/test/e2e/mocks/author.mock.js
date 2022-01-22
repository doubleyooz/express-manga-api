const artist = {
    name: 'Kentarou Kishima',
    type: 'artist',
    birthDate: '2008-05-22T03:00:00.000Z',
    socialMedia: ['orkut', 'twitter'],
    biography: 'A nice and sexy person',
    _id: '',
};
const writer = {
    name: 'Abe Yamamoto',
    type: 'writer',
    birthDate: '1990-08-02T03:00:00.000Z',
    socialMedia: ['reddit', 'twitter'],
    biography: 'A tough and gloom person',
    _id: '',
};

const photo = {
    dir: `${process.env.DIR_PATH}`,
    name: 'abc.jpg',
    size: 63595,
};

export { artist, writer, photo };
