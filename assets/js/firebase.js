var firebase = require('firebase');
module.exports={
  writeToDatabase: function(data,key,sentence,sim){
var ref  = firebase.database().ref("Speech-To-Text");
var transcript = ref.child(key);
transcript.update({"Sentence":sentence});
transcript.update(data);
  }
}