import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
//import io from 'socket.io';

import app from "./config/express.js";

dotenv.config();

const server = http.Server(app);

mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	}
);

server.listen(parseInt(`${process.env.PORT}`), () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
