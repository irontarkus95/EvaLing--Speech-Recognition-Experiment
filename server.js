var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

var watson = require("./js/watson.js");
// var google = require("./js/google.js");
var azure = require("./js/bing.js");
// var alexa = require("./js/alexa");
// View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

app.get('/',function(req,res){
    res.sendfile('index.html');
})

app.post("/watson",urlencodedParser,function(req,res){
    watson.RecognizeWatson("audio/"+req.body["name"]+".wav");
    res.end('Watson recognized');
    // res.render("watson")
})

app.post("/google",urlencodedParser,function(req,res){
    console.log(req.body["name"]);
    // watson.trial(req.body);
    // res.render("watson")
})

app.post("/azure",urlencodedParser,function(req,res){
    console.log(req.body["name"]);
    azure.recognize("Kerschel");
    res.end('Azure recognized');
    // res.render("watson")
})

app.listen(8080,function(){
    console.log('Server Started');
})