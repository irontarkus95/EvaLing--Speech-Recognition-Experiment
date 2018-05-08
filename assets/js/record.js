var mediaRecorder;
var phrase = document.querySelector("#text_to_send");
var mediaConstraints = { audio: true };
var storage = firebase.storage();
var pathReference = storage.ref('audio.wav');

document.querySelector('#get_audio').onclick = function() { startRecord(); };
document.querySelector('#stop_audio').onclick = function() { stopRecord(); };

function startRecord(){
    // Disable button and start recording
    this.disabled = true;
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
}

function stopRecord(){
    // Disable button and start recording

    this.disabled = true;
    mediaRecorder.stop();
    mediaRecorder.stream.stop();    
}
                
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

function onMediaSuccess(stream) { // Successfully grab the microphone
                 
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;

    var recorderType;
    mediaRecorder.recorderType = StereoAudioRecorder;
    mediaRecorder.mimeType = 'audio/wav';
    
    mediaRecorder.ondataavailable = function(blob) { // Fire function when recording is finished
        var fd = new FormData();
        fd.append("phrase", phrase.value)
        fd.append('key', randomKey())
        fd.append('upload', blob, "output.wav");
        submit(fd);
    };

    mediaRecorder.start(60000);

}

function onMediaError(e) { console.error('media error', e); }

function getBlob(){ return this.file; }

window.onbeforeunload = function() { document.querySelector('#get_audio').disabled = false; };



function submit(formdata) {
    console.log(formdata);

    xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/blob", true);
    xhttp.send(formdata);

    xhttp.onreadystatechange = function () {
        // The server will respond with the database key of the speech recognition job
        // Page will now redirect to a results page so that the similarities of
        // the recognition can be viewed

        if(xhttp.readyState === 4 && xhttp.status === 200) {
            
          console.log(xhttp.responseText);
          window.location.href = "results/" + xhttp.responseText;
        }
    };
}

function randomKey() {
    // Returns a string of 20 random characters
    // Used as the ID in the firebase db

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  // ------------------- DOCS --------------------------------

  /*
    This file will use the browser to record audio and encode it to audio/wav
    As soon as the user stops recording, the data is sent to the server for processing
  */