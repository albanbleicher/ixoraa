
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
    var audioContext = new AudioContext;
    console.log(audioContext);

    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    let volume = document.getElementById('volume');
    javascriptNode.onaudioprocess = function () {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }

        var average = values / length;
        const db = `${Math.round(average)}px`
        volume.style.height = db;
        volume.style.width = db;
        volume.style.transform = translate(`${db}px`, `${db}px`);
        if (Math.round(average) > 100) {
            volume.style.backgroundColor = "red"
        }
    }

    /* use the stream */
}).catch(function (err) {
    console.log(err);
    /* handle the error */
});

