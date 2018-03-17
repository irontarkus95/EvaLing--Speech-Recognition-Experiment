// Found a nodejs one from https://github.com/palmerabollo/bingspeech-api-client
// Original one was doing processing on the client side

const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');
var fs = require("fs");
var fire= require("./firebase.js");
// Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions)


module.exports = {
    recognize: function(key){
        var interpretation;
        console.log("Running bing Speech Recognition");
        let audioStream = fs.createReadStream("js/audio/test.wav");
        let subscriptionKey = '041b277e4fa149c7b4d9dd1cbb4066aa';
        let client = new BingSpeechClient(subscriptionKey);
        client.recognizeStream(audioStream).then(response =>
            fire.writeToDatabase(key,1,"Azure",response.results[0].name)
            );
       
    }
}
