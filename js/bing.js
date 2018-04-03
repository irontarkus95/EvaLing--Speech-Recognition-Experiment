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
            const fileExists = fs.stat(file,function(err,stats){
             
                let audioStream = fs.createReadStream(file);
                let subscriptionKey = '8783eba6791a45cc869e699236e6edda';
                let client = new BingSpeechClient(subscriptionKey);
                client.recognizeStream(audioStream).then(response =>{
                    var sim = stringSimilarity.compareTwoStrings(sentence, response.results[0].name);
                        
                    fire.writeToDatabase({"Azure":{"Response":response.results[0].name,"Similarity":sim}},key,sentence);
            });
        });
    }
}
