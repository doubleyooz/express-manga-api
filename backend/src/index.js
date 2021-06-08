require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const cookieParser = require("cookie-parser")

const app = express();
const server = require('http').Server(app);

//const io = require('socket.io')(server);


const allowedOrigins = ['http://localhost:3000'] 
  

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
app.use((req, res, next)=>{    
    
    res.header("Access-Control-Allow-Headers", "*")
    app.use(cors({
        origin: function(origin, callback){
          // allow requests with no origin 
          // (like mobile apps or curl requests)
          if(!origin) return callback(null, true);
          if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
        credentials: true,
      }));
    //req.io = io;
    next();
});



app.use(require('./routes'));
server.listen(parseInt(`${process.env.PORT}`), () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
