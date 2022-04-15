import mongoose from 'mongoose';

import { artist, bad_artist, writer } from '../../../mocks/author.mock.js';
import { scanToken } from '../../../mocks/jwt.mock.js';
import { createAuthor, listAuthor } from '../../../helpers/author.helper.js';

const describeif = condition => (condition ? describe : describe.skip);
const runAll = false;
describe('Author', () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    describeif(runAll)('should accept', () => {
        listAuthor(artist, mockToken, 200);
        listAuthor(writer, mockToken, 200);

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
                    listAuthor({ name: '           ' }, [writer], mockToken, 400);
                    listAuthor({ name: '\n\n\n\n\n\n\n\n' }, [writer], mockToken, 400);
                    
                })
            });
            describeif(!runAll)('invalid types', () => {
                describeif(!runAll)('invalid type', () => {
                    listAuthor({ types: [32132] }, [artist], mockToken, 400);
                });
                //prettier-ignore
                describeif(!runAll)('invalid format', () => {
                    listAuthor({ types: [''] }, [artist], mockToken, 400);

                    listAuthor({ types: ['sass'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['saas', '32123'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['writer', 'dasdas'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['artist', 'dasdas'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['artist', 'artist'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['writer', 'writer'] }, [artist], mockToken, 400);

                    listAuthor({ types: ['/artist|writer/'] }, [artist], mockToken, 400);
                });
            });

            //prettier-ignore
            describeif(!runAll)('no registered author', () => {
                listAuthor({ name: 'dsada' }, [artist], mockToken, 404);
                listAuthor({ name: 'name' }, [artist], mockToken, 404);
                listAuthor({ name: 'namesd' }, [artist], mockToken, 404);

                listAuthor({ types: ['writer', 'artist'] }, [artist], mockToken, 404);
                listAuthor({ types: ['writer'], name: artist.name }, [artist], mockToken, 404);
                listAuthor({ types: ['artist'], name: writer.name }, [artist], mockToken, 404);
                             
            });
        });
    });
});
