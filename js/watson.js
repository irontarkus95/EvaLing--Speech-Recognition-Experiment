// https://github.com/watson-developer-cloud/node-sdk
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
const download = require('download');
var fire= require("./firebase.js");
var admin = require("firebase-admin");
var serviceAccount = require("./services/services.json");


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
  var value = "stdd";
  try{
    var bucket = admin.storage().bucket();
    bucket.getFiles({}, (err, files,apires) => { download(getFile(files,name)).then(data => {
      fs.writeFileSync('js/audio/test.wav', data);

        fs.createReadStream('js/audio/test.wav')
      .pipe(speechToText.createRecognizeStream({content_type: 'audio/l16; rate=44100'}))
      .pipe(fs.createWriteStream('./transcription.txt'));
    });});

    fs.readFile("./transcription.txt", 'utf8', function(err, data) {
      if (err) throw err;
      fire.writeToDatabase("testing",1,data,"Watson");
    });
  }
  catch (err) {
    console.log(err);
  }
  finally{
    
  }
  
    // or streaming 
}

}

// RecognizeWatson(name);
