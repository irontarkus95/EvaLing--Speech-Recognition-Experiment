var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'js/audio');
    },
    filename: function(req,file,callback){
        callback(null,file.originalname)
       }
    });

const upload = multer({storage});

var fire= require("./js/firebase.js");
var watson = require("./js/watson.js");
// var google = require("./js/google.js");
var azure = require("./js/bing.js");
// var alexa = require("./js/alexa");
// View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyAQVtLUDbwAhwSHVIC5g8_t1wgiI6agNfQ",
    authDomain: "vrexpr.firebaseapp.com",
    databaseURL: "https://vrexpr.firebaseio.com",
    projectId: "vrexpr",
    storageBucket: "vrexpr.appspot.com",
    messagingSenderId: "499258811526"
  };
  firebase.initializeApp(config);


app.get('/',function(req,res){
    res.sendfile('index.html');

})

app.post("/watson",urlencodedParser,function(req,res){
    var filelocation = req.file.destination +"/"+ req.file.originalname;
    var key = req.body['key'];
    watson.RecognizeWatson(filelocation,key);
    res.end('Watson recognized');

})

app.post("/google",upload.single('audiofile'),function(req,res){
    var filelocation = req.file.destination +"/"+ req.file.originalname;
    var key = req.body['key'];
    watson.RecognizeWatson(filelocation,key);
    res.end('Watson recognized');
})

app.post("/azure",urlencodedParser,function(req,res){
    var ref  = firebase.database().ref("Speech-To-Text");
    var key = ref.push().key;
    azure.recognize(file,key);
    res.end('Watson recognized');
})

app.post("/all",upload.single('audiofile'),function(req,res){
    var filelocation = req.file.destination +"/"+ req.file.originalname;
    var key = req.body['key'];
    var phrase = req.body['phrase'];
    try{
    watson.RecognizeWatson(filelocation,key,phrase);
    azure.recognize(filelocation,key,phrase);
    res.end('Watson recognized');
    }
    catch (e){
        res.end(e);
    }
})

app.listen(8080,function(){
    console.log('Server Started');
})