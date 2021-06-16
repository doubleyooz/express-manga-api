require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const cookieParser = require("cookie-parser")

const app = express();
const server = require('http').Server(app);

const response = require('./middlewares/response');

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


const allowedOrigins = ['http://localhost:3000']

const headers = [ 
 "Origin", "Access-Control-Allow-Origin", "Content-Type",
 "Accept", "Authorization", "Origin", "X-Requested-With",
 /*"Access-Control-Request-Method",*/ "Access-Control-Allow-Credentials", /*"Access-Control-Request-Header"*/
]
var corsOptionsDelegate = function (req, callback){
  
    var corsOptions;
    if (allowedOrigins.indexOf(req.header('Origin')) !== -1){
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
      
    }     
    else {
      corsOptions = { origin: false } // disable CORS for this request    
      console.log("Origin not allowed")
    }
     
   
    corsOptions.allowedHeaders = headers,
    corsOptions.methods = ['GET', 'PUT', 'POST', 'DELETE']    
    corsOptions.credentials = true
    callback(null, corsOptions) // callback expects two parameters: error and options
    
  
}


 
app.use(cookieParser())

app.use(cors(corsOptionsDelegate));

app.use(response)



app.use(require('./routes'));
server.listen(parseInt(`${process.env.PORT}`), () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
