import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import {
    userToken,
    scanToken,
    corruptedToken,
} from '../../../mocks/jwt.mock.js';
import {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    findAuthor,
    listAuthor,
} from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);

describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());
    let mockToken2 = corruptedToken('');
    describeif(false)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);

        listAuthor([artist, writer], 2);
        findAuthor(writer);

        updateAuthor(
            { _id: 1, name: 'George Masara' },
            mockToken,
            'update name',
        );
        updateAuthor({ _id: 1, types: ['artist'] }, mockToken, 'update type');

        deleteAuthor({ author_id: 1 }, mockToken);
    });

    describeif(true)('should reject', () => {
        describeif(true)('invalid arguments', () => {
            describeif(false)('invalid names', () => {
                const wrongName = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['name'] = change;
                    else delete temp.name;

                    return temp;
                };

                describeif(false)('invalid type', () => {
                    createAuthor(wrongName(2), mockToken, 400);

                    //createAuthor(wrongName(true), mockToken, 400);

                    createAuthor(wrongName(false), mockToken, 400);

                    createAuthor(wrongName(['']), mockToken, 400);

                    createAuthor(
                        wrongName(JSON.stringify({ ...artist })),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongName(), mockToken, 400);
                });

                describeif(false)('invalid format', () => {
                    createAuthor(wrongName(''), mockToken, 400);

                    createAuthor(wrongName('sd'), mockToken, 400);

                    createAuthor(wrongName('\n\n\n'), mockToken, 400);

                    createAuthor(wrongName('       '), mockToken, 400);

                    createAuthor(
                        wrongName('more than 20 characters for sure'),
                        mockToken,
                        400,
                    );
                });
            });

            describeif(false)('invalid types', () => {
                const wrongTypes = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['types'] = change;
                    else delete temp.types;

                    return temp;
                };

                describeif(false)('invalid type', () => {
                    createAuthor(wrongTypes(3), mockToken, 400);

                    createAuthor(
                        wrongTypes(JSON.stringify(artist)),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongTypes('true'), mockToken, 400);

                    createAuthor(wrongTypes(false), mockToken, 400);

                    createAuthor(wrongTypes(), mockToken, 400);

                    createAuthor(wrongTypes([54, 25, 0]), mockToken, 400);

                    createAuthor(
                        wrongTypes([true, false, true]),
                        mockToken,
                        400,
                    );
                });

                describeif(true)('invalid format', () => {
                    createAuthor(wrongTypes(''), mockToken, 400);

                    createAuthor(wrongTypes('sass'), mockToken, 400);

                    createAuthor(wrongTypes([]), mockToken, 400);

                    createAuthor(wrongTypes(['sass']), mockToken, 400);

                    createAuthor(wrongTypes(['saas', '32123']), mockToken, 400);

                    createAuthor(
                        wrongTypes(['writer', 'dasdas']),
                        mockToken,
                        400,
                    );

                    createAuthor(
                        wrongTypes(['artist', 'dasdas']),
                        mockToken,
                        400,
                    );

                    createAuthor(
                        wrongTypes(['artist', 'writer', 'something']),
                        mockToken,
                        400,
                    );

                    createAuthor(
                        wrongTypes(['artist', 'writer', 32]),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongTypes('artist'), mockToken, 400);
                });
            });

            describeif(true)('invalid birthDate', () => {
                const wrongBirthDate = change => {
                    let temp = { ...artist };
                    temp.deathDate = '2020-12-10'
                    //can't send a null value
                    if (change) temp['birthDate'] = change;
                    else delete temp.birthDate;

                    return temp;
                };

                describeif(false)('invalid type', () => {
                    createAuthor(wrongBirthDate(3), mockToken, 400);

                    createAuthor(wrongBirthDate(['sass']), mockToken, 400);

                    createAuthor(
                        wrongBirthDate(['saas', '32123']),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongBirthDate([54, 25, 0]), mockToken, 400);

                    createAuthor(
                        wrongBirthDate(JSON.stringify(artist)),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongBirthDate(), mockToken, 400);
                });

                describeif(false)('invalid format', () => {
                    createAuthor(wrongBirthDate(''), mockToken, 400);

                    createAuthor(wrongBirthDate('sass'), mockToken, 400);

                    createAuthor(wrongBirthDate('22/15/2012'), mockToken, 400);

                    createAuthor(wrongBirthDate('22/15/2000'), mockToken, 400);

                    createAuthor(wrongBirthDate('2222/12/30'), mockToken, 400);

                    createAuthor(
                        wrongBirthDate('2222/december/30'),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongBirthDate('1980/02/20'), mockToken, 400);
                });

                describeif(false)('invalid date', () => {
                    createAuthor(
                        wrongBirthDate('ds-dsas-2012'),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongBirthDate('1900-02-30'), mockToken, 400);

                    createAuthor(wrongBirthDate('1903-02-29'), mockToken, 400);

                    createAuthor(wrongBirthDate('2000-15-15'), mockToken, 400);

                    createAuthor(wrongBirthDate('2000-06-1'), mockToken, 400);

                    createAuthor(wrongBirthDate('2000-6-01'), mockToken, 400);

                    createAuthor(wrongBirthDate('2000-6-1'), mockToken, 400);

                    createAuthor(wrongBirthDate('1000-06-01'), mockToken, 400);
                });

                describeif(true)(
                    'invalid birthDate and deathDate relation',
                    () => {                      
                        createAuthor(
                            wrongBirthDate('2019-12-22'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('2022-02-05'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('2015-04-29'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('2030-05-15'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('2019-06-10'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('1900-06-06'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('1905-06-10'),
                            mockToken,
                            400,
                        );

                        createAuthor(
                            wrongBirthDate('1000-06-01'),
                            mockToken,
                            400,
                        );
                    },
                );
            });

            describeif(false)('invalid deathDate', () => {
                const wrongDeathDate = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['deathDate'] = change;
                    else delete temp.deathDate;

                    return temp;
                };

                describeif(false)('invalid type', () => {
                    createAuthor(wrongDeathDate(3), mockToken, 400);

                    createAuthor(wrongDeathDate(['sass']), mockToken, 400);

                    createAuthor(
                        wrongDeathDate(['saas', '32123']),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongDeathDate([54, 25, 0]), mockToken, 400);

                    createAuthor(
                        wrongDeathDate(JSON.stringify(artist)),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongDeathDate(), mockToken, 400);
                });

                describeif(false)('invalid format', () => {
                    createAuthor(wrongDeathDate(''), mockToken, 400);

                    createAuthor(wrongDeathDate('sass'), mockToken, 400);

                    createAuthor(wrongDeathDate('22/15/2012'), mockToken, 400);

                    createAuthor(wrongDeathDate('22/15/2000'), mockToken, 400);

                    createAuthor(wrongDeathDate('2222/12/30'), mockToken, 400);

                    createAuthor(
                        wrongDeathDate('2222/december/30'),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongDeathDate('1980/02/20'), mockToken, 400);
                });

                describeif(true)('invalid date', () => {
                    createAuthor(
                        wrongDeathDate('ds-dsas-2012'),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongDeathDate('1900-02-30'), mockToken, 400);

                    createAuthor(wrongDeathDate('1903-02-29'), mockToken, 400);

                    createAuthor(wrongDeathDate('2000-15-15'), mockToken, 400);

                    createAuthor(wrongDeathDate('2000-06-1'), mockToken, 400);

                    createAuthor(wrongDeathDate('2000-6-01'), mockToken, 400);

                    createAuthor(wrongDeathDate('2000-6-1'), mockToken, 400);

                    createAuthor(wrongDeathDate('1000-06-01'), mockToken, 400);
                });
            });

            describeif(false)('invalid biography', () => {
                const wrongBiography = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['biography'] = change;
                    else delete temp.biography;

                    return temp;
                };

                describeif(true)('invalid type', () => {
                    createAuthor(wrongBiography(2), mockToken, 400);

                    createAuthor(wrongBiography(-52), mockToken, 400);

                    //createAuthor(wrongBiography(true), mockToken, 400);

                    createAuthor(wrongBiography(false), mockToken, 400);

                    createAuthor(wrongBiography(['']), mockToken, 400);

                    createAuthor(wrongBiography(), mockToken, 400);
                });

                describeif(true)('invalid format', () => {
                    createAuthor(wrongBiography(''), mockToken, 400);

                    createAuthor(
                        wrongBiography(
                            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
                        ),
                        mockToken,
                        400,
                    );

                    createAuthor(wrongBiography('sd'), mockToken, 400);

                    createAuthor(wrongBiography('   '), mockToken, 400);
                });
            });
        });

        describeif(false)('invalid token', () => {
            createAuthor(bad_artist, mockToken2, 401);
        });
    });
});
