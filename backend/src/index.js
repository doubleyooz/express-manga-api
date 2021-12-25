import mongoose from 'mongoose';
import http from 'http';
//import io from 'socket.io';

import { app } from './config/express.config.js';

const server = http.Server(app);
const str = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-c09yq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(str, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

server.listen(parseInt(`${process.env.PORT}`), () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
