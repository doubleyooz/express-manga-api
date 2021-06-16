require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const cookieParser = require("cookie-parser")

const app = express();
const server = require('http').Server(app);

const response = require('./middlewares/response');
const { corsOptionsDelegate } = require('./config/cors');

//const io = require('socket.io')(server);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('uploads'));

 
app.use(cookieParser())

app.use(cors(corsOptionsDelegate));

app.use(response)



app.use(require('./routes'));
server.listen(parseInt(`${process.env.PORT}`), () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
