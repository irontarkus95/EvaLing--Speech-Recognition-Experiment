var firebase = require('firebase');


module.exports={
  writeToDatabase: function(data,key){
var ref  = firebase.database().ref("Speech-To-Text");
var transcript = ref.child(key);
transcript.update({"Sentence":"Hello 2 + 2 is 4"});
transcript.update(data);

  }
}