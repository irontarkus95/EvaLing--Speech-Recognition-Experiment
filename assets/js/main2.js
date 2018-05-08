$(function () {

	// var options = $("#choose_input");
	var input = $("#get_audio");
	var stop_input = $("#stop_audio");
	// var file = $("#get_file");
	var phrase = $("#text_to_send")
	var flacdata = {
    	bps: 16,
    	channels: 1,
    	compression: 5,
	};
	var settings = {
		audio_context: null,
		stream: null,
		recording: false,
		encoder: null,
		ws: null,
		input: null,
		node: null,
		samplerate: 44100,
		autoSelectSamplerate: true,
		samplerates: [ 8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000 ],
		// Google API accepts all the above sample rates, this app will default to 44100Hz
		compression: 5,
		compressions: [ 0, 1,2,3,4,5,6,7,8 ],
		bitrate: 16,
		bitrates: [ 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 192, 224, 256, 320 ], // FLAC MUST HAVE 16 OR 24 BIT ENCODING
		recordButtonStyle: "red-btn",
    	flacdata: flacdata,
    	wav_format: true,
    	outfilename_flac: "output.flac",
    	outfilename_wav: "output.wav",
	};

	settings.result_mode = "file";

	var user_key;

	// options.children().eq(0).hide();
	// options.on("change", (element) => {
	// 	var selected = $("#choose_input option:selected").text();
	// 	if (selected === "Recording") {
	// 		input.show();
	// 		stop_input.show();
	// 		file.hide();
	// 	}
	// 	else {
	// 		input.hide();
	// 		stop_input.hide();
	// 		file.show();
	// 	}

	// })

	// input.on("click", () => {
	// 	// Disable recording button and enable stop recording button
	// 	input.prop("disabled", true);
	// 	stop_input.prop("disabled", false);
	// 	// settings.startRecording();


	// })

	// stop_input.on("click", () => {
	// 	stop_input.prop("disabled", true);
	// 	input.prop("disabled", false);
	// 	// settings.stopRecording();
	// })

	settings.startRecording = function (e) {
		// recreate this function to a 
		// level of acceptable sanity

		console.log("Started recording...");
		settings.encoder = new Worker("encoder.js");

		settings.encoder.postMessage({ cmd: 'save_as_wavfile' });
		// settings.encoder.postMessage({ cmd: 'save_as_flacfile' });

		settings.encoder.onmessage = function (event) {
			if (event.data.cmd == 'end') {
				var result_mode = settings.result_mode;
				console.log(result_mode);
				if (result_mode === 'file') {
					var fname;
					if (settings.wav_format) { fname = settings.outfilename_wav; }
					else { fname =  settings.outfilename_flac; }
					console.log(event.data.buf);
					// Send file to our API here...
					// settings.forceDownload(event.data.buf, fname);
					
					var fd = new FormData();
					fd.append("phrase", phrase.val())
					fd.append('key', randomKey())
					fd.append('upload', event.data.buf, fname);
					submit(fd);

				}
				else { console.log("An error has occurred :("); }

				settings.encoder.terminate();
			} else if (event.data.cmd = 'debug') { console.log(event.data); }
			else { console.error("Unknown event from web worker..."); }
		}

		if(navigator.webkitGetUserMedia)
			navigator.webkitGetUserMedia({ video: false, audio: true }, settings.gotUserMedia, settings.userMediaFailed);
		else if(navigator.mozGetUserMedia)
			navigator.mozGetUserMedia({ video: false, audio: true }, settings.gotUserMedia, settings.userMediaFailed);
		else
			navigator.getUserMedia({ video: false, audio: true }, settings.gotUserMedia, settings.userMediaFailed);
	}

	// settings.forceDownload = function(blob, filename){
	// 	var url = (window.URL || window.webkitURL).createObjectURL(blob);
	// 	var link = window.document.createElement('a');
	// 	link.href = url;
	// 	link.download = filename || 'output.flac';

		
	// 	//NOTE: FireFox requires a MouseEvent (in Chrome a simple Event would do the trick)
	// 	var click = document.createEvent("MouseEvent");
	// 	click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	// 	link.dispatchEvent(click);
	// };

	settings.userMediaFailed = function(code) {
		console.log("Failed getting microphone input from user");
		console.log(code);
	}

	settings.gotUserMedia = function (localMediaStream) {
		settings.recording = true;
		console.log("Microphone obtained...");
		settings.stream = localMediaStream;

		var audio_context;
		if(typeof webkitAudioContext !== 'undefined'){ audio_context = new webkitAudioContext; }
		else if(typeof AudioContext !== 'undefined'){ audio_context = new AudioContext; }
		else {
			console.log("Execution environment does not support AudioContext interface...");
			return;
		}

		settings.audio_context = audio_context;
		settings.input = audio_context.createMediaStreamSource(settings.stream);

		if(settings.input.context.createJavaScriptNode)
			settings.node = settings.input.context.createJavaScriptNode(4096, 1, 1);
		else if(settings.input.context.createScriptProcessor)
			settings.node = settings.input.context.createScriptProcessor(4096, 1, 1);
		else
			console.error('Could not create audio node for JavaScript based Audio Processing.');

		var sampleRate = settings.audio_context.sampleRate;
		console.log('audioContext.sampleRate: ' + sampleRate);//DEBUG
		if(settings.autoSelectSamplerate){
			settings.samplerate = sampleRate;
		}

		console.log('initializing encoder with:');//DEBUG
        console.log(' bits-per-sample = ' + settings.flacdata.bps);//DEBUG
        console.log(' channels        = ' + settings.flacdata.channels);//DEBUG
        console.log(' sample rate     = ' + settings.samplerate);//DEBUG
        console.log(' compression     = ' + settings.compression);//DEBUG
		settings.encoder.postMessage({ cmd: 'init', config: { 
				samplerate: settings.samplerate, 
				bps: settings.flacdata.bps, 
				channels: settings.flacdata.channels, 
				compression:settings.compression
			} 
		});

		settings.node.onaudioprocess = function(event) {
			if (!settings.recording)
				return;
            // see also: http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
			var channelLeft  = event.inputBuffer.getChannelData(0);
			// var channelRight = e.inputBuffer.getChannelData(1);
			settings.encoder.postMessage({ cmd: 'encode', buf: channelLeft});
		};

		settings.input.connect(settings.node);
		settings.node.connect(audio_context.destination);

		// settings.$apply();
	
	};

	settings.stopRecording = function() {
		if (!settings.recording) {
			return;
		}
		console.log('stop recording');
		var tracks = settings.stream.getAudioTracks()
		for(var i = tracks.length - 1; i >= 0; --i){
			tracks[i].stop();
		}
		settings.recording = false;
		settings.encoder.postMessage({ cmd: 'finish' });

		settings.input.disconnect();
		settings.node.disconnect();
		settings.input = settings.node = null;
	};

	function submit(formdata) {
		xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/blob", true);
		xhttp.send(formdata);

		xhttp.onreadystatechange = function () {
			if(xhttp.readyState === 4 && xhttp.status === 200) {
				
			  console.log(xhttp.responseText);
			  window.location.href = "results/" + xhttp.responseText;
			}
		  };
	}

	function randomKey() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	  
		for (var i = 0; i < 20; i++)
		  text += possible.charAt(Math.floor(Math.random() * possible.length));
	  
		return text;
	  }
})