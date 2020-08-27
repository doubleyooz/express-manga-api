require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');

const app = express();
const server = require('http').Server(app);
//const io = require('socket.io')(server);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useUnifiedTopology: true
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
    res.header("Acess-Control-Allow-Origin", "*");
    app.use(cors());
    //req.io = io;
    next();
});


app.use('/files', express.static(path.resolve(__dirname, '..', 'Uploads', 'resized')));

app.use(require('./routes'));
server.listen(3333);
