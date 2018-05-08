// https://github.com/watson-developer-cloud/node-sdk
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var fire= require("./firebase.js");
var stringSimilarity = require('string-similarity');

var speechToText = new SpeechToTextV1({
  username: 'dd99ad11-c7c4-4b98-aea8-96b592f6ce1a',
  password: 'Za05pW1jvRgr',
  url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});



module.exports = {
  RecognizeWatson: function(file,key,sentence){

    console.log("=====================================");
    console.log("Inside the watson.js file...");
    console.log("=====================================");
    console.log("File is: " + file);
    console.log("Key is: " + key);
    console.log("Sentence is: " + sentence);
    console.log("=====================================");    

    const fileExists = fs.stat(file,function(err,stats){

          var stream = fs.createReadStream(file)
          .pipe(speechToText.createRecognizeStream())
          .pipe(fs.createWriteStream('./Transcripts/'+key+'.txt'))
          
          stream.on('finish', function(){
                      fs.readFile("./Transcripts/"+key+".txt", 'utf8', 
                    function(err, data) {
                        if (err) throw err;
                        console.log(data);
                        var sim = stringSimilarity.compareTwoStrings(sentence, data);
                        
                        fire.writeToDatabase({"Watson":{"Response":data,"Similarity":sim}},key,sentence);
                  })
                });
      });  

}
}

