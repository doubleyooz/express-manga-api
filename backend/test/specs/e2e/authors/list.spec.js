import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import { scanToken } from '../../../mocks/jwt.mock.js';
import { createAuthor, listAuthor } from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);
const runAll = false;
describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    describeif(runAll)('should accept', () => {
        createAuthor(artist, mockToken, 200);
        createAuthor(writer, mockToken, 200);

        listAuthor({}, [artist, writer], mockToken, 200);
        listAuthor({ name: artist.name }, [artist], mockToken, 200);
        listAuthor({ types: artist.types }, [artist], mockToken, 200);
        listAuthor({ name: writer.name }, [writer], mockToken, 200);
        listAuthor({ types: writer.types }, [writer], mockToken, 200);
    });

    describeif(!runAll)('should reject', () => {
        //ensure you have created authors beforehand, otherwise it will break
        describeif(runAll)('mock data', () => {
            createAuthor(artist, mockToken, 200);
            createAuthor(writer, mockToken, 200);
        });
        describeif(!runAll)('invalid arguments', () => {
            describeif(!runAll)('invalid name', () => {
                //prettier-ignore
                describeif(runAll)('invalid type', () => {
                    
                    listAuthor({ name: [] }, [writer], mockToken, 400);                 
                    listAuthor({ name: ['adasd', 'adad', 'adas'] }, [writer], mockToken, 400);
                    
                })
                //prettier-ignore
                describeif(!runAll)('invalid format', () => {                    
                    listAuthor({ name: 'd' }, [artist], mockToken, 400);
                    listAuthor({ name: 'sd' }, [artist], mockToken, 400);
                    listAuthor({ name: 'aabbccddsseegg ddssaaadasdas' }, [artist], mockToken, 400);
                    listAuthor({ name: 'George321' }, [artist], mockToken, 400);
                    listAuthor({ name: 23213 }, [artist], mockToken, 400);            
                    listAuthor({ name: '3123sadad' }, [writer], mockToken, 400);
                    listAuthor({ name: 'asdasd3sadd' }, [writer], mockToken, 400);
                    
                })
            });
            describeif(runAll)('invalid types', () => {
                describeif(!runAll)('invalid type', () => {
                    listAuthor({ types: [32132] }, [artist], mockToken, 400);
                });

                describeif(!runAll)('no registered author', () => {
                    listAuthor({ name: 'dsadas' }, [writer], mockToken, 404);

                    listAuthor(
                        { name: writer.types },
                        [writer],
                        mockToken,
                        404,
                    );
                });

                describeif(!runAll)('invalid format', () => {
                    listAuthor(
                        { types: [writer.name] },
                        [writer],
                        mockToken,
                        400,
                    );
                    listAuthor(
                        { types: [writer.name, 2] },
                        [writer],
                        mockToken,
                        400,
                    );
                    listAuthor({ types: [32, 312] }, [writer], mockToken, 400);
                    //listAuthor({ types: [writer.name, writer.name] }, [writer], mockToken, 400);
                });
            });

            //prettier-ignore
            describeif(!runAll)('no registered _id', () => {
             
             
                
            });
        });
    });
});
