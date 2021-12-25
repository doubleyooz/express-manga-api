// test-setup.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.set('useCreateIndex', true);
mongoose.promise = global.Promise;

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found') return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (
                error.message.includes(
                    'a background operation is currently running',
                )
            )
                return;
            console.log(error.message);
        }
    }
}

async function dropTestUploadFolder() {
    let reqPath = path.resolve(path.dirname(''), 'uploads2');
    fs.rmdirSync(reqPath, { recursive: true });
}

async function dropTempJson() {
    fs.unlinkSync('./test/e2e/tests/temp.json');
}

function setupDB(databaseName) {
    // Set variables
    beforeAll(async () => {
        let dict = {
            token: '',
            scan_id: '',
        };

        await fs.writeFile(
            './test/e2e/tests/temp.json',
            JSON.stringify(dict),
            function (err, result) {
                if (err) console.log('error', err);
            },
        );
    });

    // Connect to Mongoose
    beforeAll(async () => {
        const mongoms = await MongoMemoryServer.create();
        const uri = mongoms.getUri();

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };

        await mongoose.connect(uri, options);
    });

    // Cleans up database between each test
    afterEach(async () => {
        //await removeAllCollections();
    });

    // Disconnect Mongoose
    afterAll(async () => {
        await dropAllCollections();
        await dropTempJson();
        //await dropTestUploadFolder();
        await mongoose.connection.close();
    });
}

setupDB('test');
