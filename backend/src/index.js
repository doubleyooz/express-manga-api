require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');

const app = express();
const server = require('http').Server(app);

const response = require("./middlewares/response");
//const io = require('socket.io')(server);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
});

app.use(response);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('uploads'));

app.use((req, res, next)=>{
    res.header("Acess-Control-Allow-Origin", "*");
    app.use(cors());
    //req.io = io;
    next();
});



app.use(require('./routes'));
server.listen(3333, () => {
    console.log(`Listening on port 3333`);
});
