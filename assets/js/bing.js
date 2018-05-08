// Found a nodejs one from https://github.com/palmerabollo/bingspeech-api-client
// Original one was doing processing on the client side

const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');
var fs = require("fs");
var admin = require("firebase-admin");
var fire= require("./firebase.js");
const download = require('download');
var stringSimilarity = require('string-similarity');
// Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions)


module.exports = {
    recognize: function(file,key,sentence){

        console.log("=====================================");
        console.log("Inside the watson.js file...");
        console.log("=====================================");
        console.log("File is: " + file);
        console.log("Key is: " + key);
        console.log("Sentence is: " + sentence);
        console.log("=====================================");    
        
        const fileExists = fs.stat(file,function(err,stats){

            let audioStream = fs.createReadStream(file);
            let subscriptionKey = '0c35f692d7dd476ea78155e54ad0b977';
            let client = new BingSpeechClient(subscriptionKey);
            client.recognizeStream(audioStream).then(response =>{
                console.log(response.results);
                var sim = stringSimilarity.compareTwoStrings(sentence, response.results[0].name);
                    
                fire.writeToDatabase({"Azure":{"Response":response.results[0].name,"Similarity":sim}},key,sentence);
            });
        });
    }
}
