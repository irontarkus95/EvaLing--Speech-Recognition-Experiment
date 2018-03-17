// https://github.com/watson-developer-cloud/node-sdk
var https = require('https');
var firebase = require("firebase");
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
const download = require('download');
const googleStorage = require('@google-cloud/storage');



var config = {
  apiKey: "AIzaSyDhyZl_PJSmDgzjMZb6xBH8IyFn74rHv4U",
  authDomain: "speech2text-3ab74.firebaseapp.com",
  databaseURL: "https://speech2text-3ab74.firebaseio.com",
  projectId: "speech2text-3ab74",
  storageBucket: "gs://speech2text-3ab74.appspot.com",
  messagingSenderId: "947156179107"
};
firebase.initializeApp(config);


var admin = require("firebase-admin");
var serviceAccount = require("./services.json");


var speechToText = new SpeechToTextV1({
  username: 'dd99ad11-c7c4-4b98-aea8-96b592f6ce1a',
  password: 'Za05pW1jvRgr',
  url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});

function getFile(fileList,name){
  for(var i=0;i<fileList.length;i++){
    if(fileList[i]["metadata"]['name']==name)
    return fileList[i]['metadata']["mediaLink"];
  }
}

module.exports = {
  RecognizeWatson: function(name){
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "gs://speech2text-3ab74.appspot.com/"
  });

  var bucket = admin.storage().bucket();
  bucket.getFiles({}, (err, files,apires) => { console.log(files);download(getFile(files,name)).then(data => {
    fs.writeFileSync('trial.wav', data);
    var par = {
      audio:fs.createReadStream('trial.wav'),
      content_type: 'audio/l16; rate=44100'
      }

    speechToText.createRecognizeStream(par, function(err, res) {
      if (err)
        console.log(err);
      else
        console.log(res);
      });
      
      fs.createReadStream('trial.wav')
    .pipe(speechToText.createRecognizeStream(par))
    .pipe(fs.createWriteStream('./transcription.txt'));
  });}
  );
    // or streaming 
}
}

// RecognizeWatson(name);
