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
admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "gs://vrexpr.appspot.com/"
  });




module.exports = {
  RecognizeWatson: function(file,key,sentence){

    const fileExists = fs.stat(file,function(err,stats){
          var stream = fs.createReadStream(file)
          .pipe(speechToText.createRecognizeStream())
          .pipe(fs.createWriteStream('./Transcripts/'+key+'.txt'))
          
          stream.on('finish', function(){
                      fs.readFile("./Transcripts/"+key+".txt", 'utf8', 
                    function(err, data) {
                        if (err) throw err;
                        console.log(data)
                        fire.writeToDatabase({"Watson":{"Response":data}},key,sentence);
                  })
                });
      });  

}
}
// RecognizeWatson(name);
