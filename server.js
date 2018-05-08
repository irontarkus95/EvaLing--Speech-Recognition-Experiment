// REQUIRE FILES -------------------------------------------------------
// Modules
var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var firebase = require('firebase');
var multer = require('multer');

// Local Files
var fire = require("./assets/js/firebase.js");
var watson = require("./assets/js/watson.js");
// var google = require("./js/google.js");
var azure = require("./assets/js/bing.js");
// var alexa = require("./js/alexa");

// EXPRESS OPTIONS -----------------------------------------------------
// View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use("/assets", express.static("assets"));
app.use("/distrib", express.static("distrib"));
app.use("/results", express.static("assets"))

// MIDDLEWARE ----------------------------------------------------------
// BodyParser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// Multer Storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        // console.log(req.body);
        cb(null,'audio');
    },
    filename: function(req,file,callback){
        callback(null,file.originalname)
       }
    });
const upload = multer({storage});
const type = upload.single('upload');

// FIREBASE ------------------------------------------------------------
var config = {
    apiKey: "AIzaSyAQVtLUDbwAhwSHVIC5g8_t1wgiI6agNfQ",
    authDomain: "vrexpr.firebaseapp.com",
    databaseURL: "https://vrexpr.firebaseio.com",
    projectId: "vrexpr",
    storageBucket: "vrexpr.appspot.com",
    messagingSenderId: "499258811526"
  };
  firebase.initializeApp(config);


// REQUESTS ------------------------------------------------------------
app.get('/',function(req,res){
    res.sendfile('index.html');

})

// MAIN POST METHOD
// This will receive a blob of data from the client
// Middleware will save the file as audio/wav (using multer)
// The file will then be sent off to the apis
// Post request sends back the database key of the speech recognition results
app.post('/blob', type, function (req, res) {
    console.log(req.body);
    console.log(req.file);
    // Make API calls to Speech people

    var filelocation = req.file.destination +"/"+ req.file.originalname;

    var key = req.body['key'];
    var phrase = req.body['phrase'];
    console.log(phrase);
    try{
    watson.RecognizeWatson(filelocation,key,phrase);
    azure.recognize(filelocation,key,phrase);
    }
    catch (e){
        res.end(e);
    }

    res.send(key);
 });

 app.get("/results/:id", (req, res) => {
     res.render("result", {
         key: req.params.id
     })
 })

// app.post("/watson",urlencodedParser,function(req,res){
//     var filelocation = req.file.destination +"/"+ req.file.originalname;
//     var key = req.body['key'];
//     watson.RecognizeWatson(filelocation,key);
//     res.end('Watson recognized');

// })

// app.post("/google",upload.single('audiofile'),function(req,res){
//     var filelocation = req.file.destination +"/"+ req.file.originalname;
//     var key = req.body['key'];
//     watson.RecognizeWatson(filelocation,key);
//     res.end('Watson recognized');
// })

// app.post("/azure",urlencodedParser,function(req,res){
//     var ref  = firebase.database().ref("Speech-To-Text");
//     var key = ref.push().key;
//     azure.recognize(file,key);
//     res.end('Watson recognized');
// })

app.post("/all",upload.single('audiofile'),function(req,res){
    var filelocation = req.file.destination +"/"+ req.file.originalname;
    var key = req.body['key'];
    var phrase = req.body['phrase'];
    try{
    // watson.RecognizeWatson(filelocation,key,phrase);
    azure.recognize(filelocation,key,phrase);
    res.end('Watson recognized');
    }
    catch (e){
        res.end(e);
    }
})

app.post("/submit", urlencodedParser, (req, res) => {
    console.log(req.body)
})

app.listen(process.env.PORT || 8080,function(){
    console.log('Server Started at http://127.0.0.1:' + process.env.PORT);
})

// ---------------------------------------------------------------------------------------------------