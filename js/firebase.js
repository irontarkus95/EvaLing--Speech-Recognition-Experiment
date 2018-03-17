var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDhyZl_PJSmDgzjMZb6xBH8IyFn74rHv4U",
  authDomain: "speech2text-3ab74.firebaseapp.com",
  databaseURL: "https://speech2text-3ab74.firebaseio.com",
  projectId: "speech2text-3ab74",
  storageBucket: "speech2text-3ab74.appspot.com",
  messagingSenderId: "947156179107"
};
firebase.initializeApp(config);

module.exports={
  writeToDatabase: function(name,stage,statement,interp,apiname){
var ref  = firebase.database().ref("experiment");
var transcript = ref.child(name+"/"+stage);
transcript.update({
  original:statement,
  apiname: interp
})
  }
}