const artist = {
    name: 'Kentarou Kishima',
    types: ['artist'],
    birthDate: '1998-05-22',   
    socialMedia: ['https://www.orkut.com/user', 'https://twitter.com/usesdsa'],
    biography: 'A nice and sexy person',
    _id: '',
};

//the tests depend on this deathDate being set the way it is
const writer = {
    name: 'Abe Yamamoto',
    types: ['writer'],
    birthDate: '1990-08-02',
    deathDate: '2020-12-10',
    socialMedia: ['https://reddit.com/dsd', 'https://twitter.com/usessdadsa'],
    biography: 'A tough and gloom person',
    _id: '',
};

const bad_artist = {
    name: 'Ken',
    types: ['artist'],
    birthDate: '2021-05-22',
    deathDate: '2000-05-22',
    socialMedia: ['orkut', 'reddit'],
    biography: 'A strange guy, he likes chocolate with coconuts',
    _id: '',
    trash: 'sadadasd',
};

const bad_writer = {
    name: 'Dan',
    types: ['writer'],
    birthDate: '2000-05-22',
    deathDate: '2000-05-22',
    socialMedia: ['twitter', 'facebook', 'reddit'],
    biography: 'He has a nice mustache',
    _id: '',
    trash: 'dsa2adadasd',
};

export { artist, writer, bad_artist, bad_writer };
