// test-setup.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";


import { MongoMemoryServer } from "mongodb-memory-server";

mongoose.set("useCreateIndex", true);
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
			if (error.message === "ns not found") return;
			// This error occurs when you use it.todo. You can
			// safely ignore this error too
			if (error.message.includes("a background operation is currently running"))
				return;
			console.log(error.message);
		}
	}
}

async function dropTestUploadFolder() {
	let reqPath = path.resolve(path.dirname(''), "uploads2");
	fs.rmdirSync(reqPath, { recursive: true });
}

function dbReporter() {

    this.jasmineStarted = function (options) {};    
    this.specStarted = function (result) {};    
    this.specDone = async function (result) {

        if (result.status == 'pending') {
        }
        else if (result.status == 'passed') {
        }
        else if (result.status == 'failed') {
            //Put your testrail interaction code here
        }

        testResultsUploadQueue.push(result);
    };

    this.suiteStarted = function (result) {};    
    this.suiteDone = function (result) {}    
    this.jasmineDone = async function (result) {}
}
 
function setupDB(databaseName) {
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

	beforeAll(async () => {
		 
		 
		 //Declare a global variable that will contain all the asynchronous upload actions (promises)
		 global.testResultsUploadQueue = [];
	 
		 //initialize the dbreporer
		 await jasmine.getEnv().addReporter(new dbReporter());
	})

	// Cleans up database between each test
	afterEach(async () => {
		//await removeAllCollections();
	});
	afterAll(async () => {
		//Wait for all uploads to resolve before completing
		await Promise.all(testResultsUploadQueue);
	})
	// Disconnect Mongoose
	afterAll(async () => {
		await dropAllCollections();
		//await dropTestUploadFolder();
		await mongoose.connection.close();

	});
}

setupDB("test");