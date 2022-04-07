const artist = {
    name: 'Kentarou Kishima',
    types: ['artist'],
    birthDate: '2008-05-22',
    //deathDate: '2018-05-22',
    socialMedia: ['orkut', 'twitter'],
    biography: 'A nice and sexy person',
    _id: '',    
};

const writer = {
    name: 'Abe Yamamoto',
    types: ['writer'],
    birthDate: '1990-08-02',
    socialMedia: ['reddit', 'twitter'],
    biography: 'A tough and gloom person',
    _id: '',
};

const bad_artist = {
    name: 'Ken',
    types: ['artist'],
    birthDate: '2001-05-22',
    deathDate: '2000-05-22',
    socialMedia: ['orkut', 'reddit'],
    biography: 'A strange guy',
    _id: '',
    trash: 'sadadasd',
}

const bad_writer = {
    name: 'Dan',
    types: ['writer'],
    birthDate: '2005-05-22',
    deathDate: '2000-05-22',
    socialMedia: ['twitter', 'facebook', 'reddit'],
    biography: 'He has a nice mustache',
    _id: '',
    trash: 'dsa2adadasd',
}

export { artist, writer, bad_artist, bad_writer };
