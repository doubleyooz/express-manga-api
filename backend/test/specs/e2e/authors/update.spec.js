import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import { scanToken } from '../../../mocks/jwt.mock.js';
import { updateAuthor, createAuthor } from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);
const runAll = false;
describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    //prettier-ignore
    describeif(runAll)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);
        updateAuthor({ _id: 1, types: ['writer'] }, mockToken, "types", 200);
        updateAuthor({ _id: 1, types: ['artist'] }, mockToken, "types", 200);
        updateAuthor({ _id: 1, types: ['artist', 'writer'] }, mockToken, "types", 200);            
        updateAuthor({ _id: 1, name: 'Mario Hyuzaki'}, mockToken, "name", 200);
        updateAuthor({ _id: 1, birthDate: '1997-05-30'}, mockToken, "birthDate", 200);
        updateAuthor({ _id: 1, deathDate: '2021-05-30'}, mockToken, "deathDate", 200);
        updateAuthor({ _id: 1, biography: 'An updated biography'}, mockToken, "biography", 200);
        updateAuthor({ _id: 1, socialMedia: ['https://www.orkut.com/dassd', 'https://twitter.com/usedasdsdsa']}, mockToken, "socialMedia", 200);
        
    });
    //prettier-ignore
    describeif(!runAll)('should reject', () => {
        //ensure you have created authors beforehand, otherwise it will break
        describeif(!runAll)('mock data', () => {
            createAuthor(artist, mockToken, 200);
            createAuthor(writer, mockToken, 200);
        });
        describeif(!runAll)('invalid arguments', () => {
            describeif(runAll)('invalid name', () => {
                //prettier-ignore
                describeif(!runAll)('invalid type', () => {
                    updateAuthor({ _id: 1, name: 2 }, mockToken, "reject number", 400);  
                    
                    //can't test for boolean because yup casts it to string, no strict() set there
                    //updateAuthor({ _id: 1, name: true }, mockToken, "reject boolean", 400); 

                    //updateAuthor({ _id: 1, name: false }, mockToken, "reject boolean", 400);  

                    updateAuthor({ _id: 1, name: [''] }, mockToken, "reject array with empty string", 400);

                    updateAuthor({ _id: 1, name: [] }, mockToken, "reject empty array", 400);

                    updateAuthor({ _id: 1, name: {...artist} }, mockToken, "reject nested object", 400);
                    
                    updateAuthor({ _id: 1 }, mockToken, "reject undefined", 400);

                    
                });
                //prettier-ignore
                describeif(!runAll)('invalid format', () => {
                    updateAuthor({ _id: 1, name: '' }, mockToken, "reject empty string", 400);

                    updateAuthor({ _id: 1, name: 's' }, mockToken, "reject one character string", 400);

                    updateAuthor({ _id: 1, name: 'sd' }, mockToken, "reject two character string", 400);
                    
                    updateAuthor({ _id: 1, name: '\n\n\n' }, mockToken, "reject three escape enter string", 400);
                  
                    updateAuthor({ _id: 1, name: '       ' }, mockToken, "reject string filled with spaces", 400);

                    updateAuthor({ _id: 1, name: 'more than 20 characters for sure...' }, mockToken, "reject string longer than 20 characters", 400);
                });
            });
           
            describeif(runAll)('invalid types', () => {
              
                describeif(!runAll)('invalid type', () => {
                   
                    updateAuthor({ _id: 1, types: 3 }, mockToken, "reject number", 400);  
                    
                    updateAuthor({ _id: 1, types: {...artist} }, mockToken, "reject nested object", 400);
                    
                    updateAuthor({ _id: 1, types: 'true'}, mockToken, "reject nested 'true'", 400);
                    
                    updateAuthor({ _id: 1, types: true}, mockToken, "reject nested true", 400);
                    
                    updateAuthor({ _id: 1, types: false}, mockToken, "reject nested false", 400);
                    
                    updateAuthor({ _id: 1}, mockToken, "reject undefined", 400);

                    updateAuthor({ _id: 1, types: [54, 25, 0]}, mockToken, "reject number array", 400);
               
                    updateAuthor({ _id: 1, types: [54, 25, 0]}, mockToken, "reject boolean array", 400);

                    updateAuthor({ _id: 1, types: [true, false, 2]}, mockToken, "reject mixed array", 400);
                    
                });

                describeif(!runAll)('invalid format', () => {
                    updateAuthor({ _id: 1, types: '' }, mockToken, "reject empty string", 400);

                    updateAuthor({ _id: 1, types: 'sass' }, mockToken, "reject invalid string", 400);

                    updateAuthor({ _id: 1, types: [] }, mockToken, "reject empty array", 400);

                    updateAuthor({ _id: 1, types: ['sass'] }, mockToken, "reject invalid single string array", 400);

                    updateAuthor({ _id: 1, types: ['sass', '3213123'] }, mockToken, "reject invalid string array", 400);

                    updateAuthor({ _id: 1, types: ['writer', 'adasdas'] }, mockToken, "reject string array with a single invalid string", 400);
                   
                    updateAuthor({ _id: 1, types: ['artist', 'adasdas'] }, mockToken, "reject string array with a single invalid string", 400);
                    
                    updateAuthor({ _id: 1, types: ['artist', 'artist'] }, mockToken, "reject repeated artist type", 400);

                    updateAuthor({ _id: 1, types: ['writer', 'writer'] }, mockToken, "reject repeated writer type", 400);

                    updateAuthor({ _id: 1, types: ['artist', 'artist', 'something'] }, mockToken, "reject string array with a single invalid string", 400);

                    updateAuthor({ _id: 1, types: ['artist', 'artist', 32] }, mockToken, "reject mixed array with valid strings", 400);

                    updateAuthor({ _id: 1, types: '/artist|writer/'}, mockToken, "reject regex string", 400);

                });
            });
         
            describeif(runAll)('invalid birthDate', () => {
                
                describeif(!runAll)('invalid type', () => {
                    updateAuthor({ _id: 1, birthDate: 3 }, mockToken, "reject number", 400);                     

                    updateAuthor({ _id: 1, birthDate: ['sass'] }, mockToken, "reject single string array", 400);

                    updateAuthor({ _id: 1, birthDate: ['sass', '3213123'] }, mockToken, "reject string array", 400);
                    
                    updateAuthor({ _id: 1, birthDate: [54, 25, 0]}, mockToken, "reject number array", 400);

                    updateAuthor({ _id: 1, birthDate: {...artist} }, mockToken, "reject nested object", 400);

                    updateAuthor({ _id: 1}, mockToken, "reject undefined", 400);
                });

                describeif(!runAll)('invalid format', () => {                   
                    updateAuthor({ _id: 1, birthDate: 'sass'}, mockToken, "reject invalid string", 400);

                    updateAuthor({ _id: 1, birthDate: '25/15/2012'}, mockToken, "reject dd/mm/yyyy", 400);

                    updateAuthor({ _id: 1, birthDate: '25/15/2000'}, mockToken, "reject dd/mm/yyyy", 400);

                    updateAuthor({ _id: 1, birthDate: '2222/12/30'}, mockToken, "reject yyyy/mm/dd", 400);

                    updateAuthor({ _id: 1, birthDate: '22/12/30'}, mockToken, "reject yy/mm/dd", 400);

                    updateAuthor({ _id: 1, birthDate: '2222/december/30'}, mockToken, "reject yyyy/month/dd", 400);

                    updateAuthor({ _id: 1, birthDate: '1980/02/20'}, mockToken, "reject yyyy/mm/dd", 400);

                    updateAuthor({ _id: 1, birthDate: '2000-06-1'}, mockToken, "reject yyyy-mm-d", 400);

                    updateAuthor({ _id: 1, birthDate: '2000-6-01'}, mockToken, "reject yyyy-m-dd", 400);

                    updateAuthor({ _id: 1, birthDate: '2000-6-1'}, mockToken, "reject yyyy-m-d", 400);
                });

                describeif(!runAll)('invalid date', () => {
                    updateAuthor({ _id: 1, birthDate: 'ds-dsas-2012'}, mockToken, "reject letters in the date", 400);
                  
                    updateAuthor({ _id: 1, birthDate: '1900-02-30'}, mockToken, "reject invalid february", 400);
                   
                    updateAuthor({ _id: 1, birthDate: '1903-02-29'}, mockToken, "reject invalid february", 400);

                    updateAuthor({ _id: 1, birthDate: '1943-15-29'}, mockToken, "reject invalid months", 400);

                    updateAuthor({ _id: 1, birthDate: '2030-10-23'}, mockToken, "reject future dates", 400);
                            
                    updateAuthor({ _id: 1, birthDate: '1000-06-01'}, mockToken, "reject dates earlier than 1900-01-01", 400);
        
                });

                describeif(!runAll)('invalid birthDate and deathDate relation', () => {
                    updateAuthor({ _id: 1, birthDate: '2019-12-22'}, mockToken, "reject dates with a gap lower than 10 years", 400);
                    
                    updateAuthor({ _id: 1, birthDate: '2022-02-05'}, mockToken, "reject birthDate after deathDate", 400);

                    updateAuthor({ _id: 1, birthDate: '2015-04-29'}, mockToken, "reject dates with a gap lower than 10 years", 400);

                    updateAuthor({ _id: 1, birthDate: '1900-06-06'}, mockToken, "reject dates with a gap greater than 101 years", 400);

                    updateAuthor({ _id: 1, birthDate: '1905-06-10'}, mockToken, "reject dates with a gap greater than 101 years", 400);
        
                    updateAuthor({ _id: 1, birthDate: '1000-06-01'}, mockToken, "reject dates with a gap greater than 101 years", 400);

                });
            });
            
            describeif(runAll)('invalid deathDate', () => {
             
                describeif(!runAll)('invalid type', () => {
                    updateAuthor({ _id: 1, deathDate: 3 }, mockToken, "reject number", 400);                     

                    updateAuthor({ _id: 1, deathDate: ['sass'] }, mockToken, "reject single string array", 400);

                    updateAuthor({ _id: 1, deathDate: ['sass', '3213123'] }, mockToken, "reject string array", 400);
                    
                    updateAuthor({ _id: 1, deathDate: [54, 25, 0]}, mockToken, "reject number array", 400);

                    updateAuthor({ _id: 1, deathDate: {...artist} }, mockToken, "reject nested object", 400);

                    updateAuthor({ _id: 1}, mockToken, "reject undefined", 400);
                });

                describeif(!runAll)('invalid format', () => {                 
                    updateAuthor({ _id: 1, deathDate: 'sass'}, mockToken, "reject invalid string", 400);

                    updateAuthor({ _id: 1, deathDate: '25/15/2012'}, mockToken, "reject dd/mm/yyyy", 400);

                    updateAuthor({ _id: 1, deathDate: '25/15/2000'}, mockToken, "reject dd/mm/yyyy", 400);

                    updateAuthor({ _id: 1, deathDate: '2222/12/30'}, mockToken, "reject yyyy/mm/dd", 400);

                    updateAuthor({ _id: 1, deathDate: '22/12/30'}, mockToken, "reject yy/mm/dd", 400);

                    updateAuthor({ _id: 1, deathDate: '2222/december/30'}, mockToken, "reject yyyy/month/dd", 400);

                    updateAuthor({ _id: 1, deathDate: '1980/02/20'}, mockToken, "reject yyyy/mm/dd", 400);

                    updateAuthor({ _id: 1, deathDate: '2000-06-1'}, mockToken, "reject yyyy-mm-d", 400);

                    updateAuthor({ _id: 1, deathDate: '2000-6-01'}, mockToken, "reject yyyy-m-dd", 400);

                    updateAuthor({ _id: 1, deathDate: '2000-6-1'}, mockToken, "reject yyyy-m-d", 400);
                });

                describeif(!runAll)('invalid date', () => {
                    updateAuthor({ _id: 1, deathDate: 'ds-dsas-2012'}, mockToken, "reject letters in the date", 400);
                  
                    updateAuthor({ _id: 1, deathDate: '1900-02-30'}, mockToken, "reject invalid february", 400);
                   
                    updateAuthor({ _id: 1, deathDate: '1903-02-29'}, mockToken, "reject invalid february", 400);

                    updateAuthor({ _id: 1, deathDate: '1903-15-39'}, mockToken, "reject invalid months", 400);

                    updateAuthor({ _id: 1, deathDate: '2030-10-23'}, mockToken, "reject future dates", 400);
                            
                    updateAuthor({ _id: 1, deathDate: '1909-12-31'}, mockToken, "reject dates earlier than 1910-01-01", 400);
        
                });

                describeif(!runAll)(
                    'invalid birthDate and deathDate relation',
                    () => {
                        updateAuthor({ _id: 1, deathDate: '1990-08-02'}, mockToken,  "reject dates with a gap lower than 10 years", 400);
                        updateAuthor({ _id: 1, deathDate: '2000-07-12'}, mockToken,  "reject dates with a gap lower than 10 years", 400);
                        updateAuthor({ _id: 1, deathDate: '2032-02-14'}, mockToken,  "reject future dates", 400);
                        updateAuthor({ _id: 1, deathDate: '1911-05-27'}, mockToken,  "reject deathDate earlier than birthDate", 400);
                        updateAuthor({ _id: 1, deathDate: '1980-04-11'}, mockToken,  "reject deathDate earlier than birthDate", 400);
                        updateAuthor({ _id: 1, birthDate: '1899-12-31'}, mockToken, "reject dates earlier than 1900-01-01", 400);
                        updateAuthor({ _id: 1, deathDate: '1000-06-30'}, mockToken,  "reject deathDate earlier than 1900-01-01", 400);
                        updateAuthor({ _id: 1, deathDate: '1905-06-10'}, mockToken,  "reject deathDate earlier than birthDate", 400);
                    
                    },
                );
            });
            /*
            describeif(runAll)('invalid biography', () => {
                const wrongBiography = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['biography'] = change;
                    else delete temp.biography;

                    return temp;
                };

                describeif(runAll)('invalid type', () => {
                    updateAuthor(wrongBiography(2), mockToken, 400);

                    updateAuthor(wrongBiography(-52), mockToken, 400);

                    //updateAuthor(wrongBiography(true), mockToken, 400);

                    updateAuthor(wrongBiography(false), mockToken, 400);

                    updateAuthor(wrongBiography(['']), mockToken, 400);

                    updateAuthor(wrongBiography(), mockToken, 400);
                });

                describeif(runAll)('invalid format', () => {
                    updateAuthor(wrongBiography(''), mockToken, 400);

                    updateAuthor(
                        wrongBiography(
                            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
                        ),
                        mockToken,
                        400,
                    );

                    updateAuthor(wrongBiography('sd'), mockToken, 400);

                    updateAuthor(wrongBiography('   '), mockToken, 400);
                });
            });

            describeif(runAll)('invalid social Media', () => {
                const wrongSocialMedia = change => {
                    let temp = { ...artist };
                    //can't send a null value
                    if (change) temp['socialMedia'] = change;
                    else delete temp.socialMedia;

                    return temp;
                };

                describeif(runAll)('invalid type', () => {
                    updateAuthor(wrongSocialMedia(3), mockToken, 400);

                    updateAuthor(
                        wrongSocialMedia(JSON.stringify(artist)),
                        mockToken,
                        400,
                    );

                    updateAuthor(wrongSocialMedia('true'), mockToken, 400);

                    updateAuthor(wrongSocialMedia(false), mockToken, 400);

                    updateAuthor(wrongSocialMedia(), mockToken, 400);

                    updateAuthor(wrongSocialMedia([54, 25, 0]), mockToken, 400);

                    updateAuthor(
                        wrongSocialMedia([true, false, true]),
                        mockToken,
                        400,
                    );

                    updateAuthor(wrongSocialMedia(''), mockToken, 400);

                    updateAuthor(wrongSocialMedia('sassf'), mockToken, 400);
                });

                describeif(!runAll)('invalid format', () => {
                    updateAuthor(wrongSocialMedia([]), mockToken, 400);

                    updateAuthor(wrongSocialMedia(['sass']), mockToken, 400);

                    updateAuthor(
                        wrongSocialMedia(['saas', '32123']),
                        mockToken,
                        400,
                    );

                    updateAuthor(
                        wrongSocialMedia(['writer', 'dasdas']),
                        mockToken,
                        400,
                    );

                    updateAuthor(
                        wrongSocialMedia(['artist', 'dasdas']),
                        mockToken,
                        400,
                    );

                    updateAuthor(
                        wrongSocialMedia(['artist', 'writer', 'something']),
                        mockToken,
                        400,
                    );

                    updateAuthor(
                        wrongSocialMedia(['artist', 'writer', 32]),
                        mockToken,
                        400,
                    );

                    describeif(!runAll)('invalid url', () => {
                        updateAuthor(
                            wrongSocialMedia([
                                'http://socialm.co/khj',
                                'https://soc.ialmco/khj',
                                'http://socialmco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'http://socialm.co/khj',
                                'http://socialmco/khj',
                                'https://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'https://socialmco/khj',
                                'http://social.mco/khj',
                                'http://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'https://socialm.co/khj',
                                'hsttp://socialm.co/khj',
                                'http://socialm.co/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'httpsw://socialm.co/khj',
                                'http://socialm.co/khj',
                                'http://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'http://social.dsmco/khj',
                                'http://social.mco/khj',
                                'htts23p://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'http://soc.dsaial.dsmco',
                                'http://social.mco/khj',
                                'http://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'http://social.dsmco/khj',
                                'http://social.mco/khj',
                                'https://social.mco',
                            ]),
                            mockToken,
                            400,
                        );

                        updateAuthor(
                            wrongSocialMedia([
                                'http://social.dsmco/khj',
                                'http://social.mco',
                                'http://social.mco/khjk/hjk',
                            ]),
                            mockToken,
                            400,
                        );
                    });
                });
            });*/
        });
    });
});
