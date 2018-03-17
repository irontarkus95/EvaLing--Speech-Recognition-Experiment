var mediaRecorder;

                
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

var mediaConstraints = {
    audio: true
};

document.querySelector('#start-recording').onclick = function() {
  startRecord();
};

document.querySelector('#stop-recording').onclick = function() {
    stopRecord();
};




function startRecord(){
    this.disabled = true;
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
}

function stopRecord(){
    this.disabled = true;
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
}



var file;
function onMediaSuccess(stream) {
                 

    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;

    var recorderType;
    mediaRecorder.recorderType = StereoAudioRecorder;
    mediaRecorder.mimeType = 'audio/wav';
    
    
    // mediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;
    mediaRecorder.ondataavailable = function(blob) {
        file = blob;
        file.loc = "pizawas";
        var storage = firebase.storage();
        var storageRef = storage.ref('audio2.wav');
        storageRef.put(blob);
        console.log(storageRef.getDownloadURL());
    };

    mediaRecorder.start(5000);

}

function onMediaError(e) {
    console.error('media error', e);
}

function getBlob(){
return this.file;
}


window.onbeforeunload = function() {
    document.querySelector('#start-recording').disabled = false;
};

var storage = firebase.storage();
var pathReference = storage.ref('audio.wav');