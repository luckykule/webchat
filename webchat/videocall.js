// var txtSelfId = document.querySelector("input#txtSelfId");
// var txtTargetId = document.querySelector("input#txtTargetId");
// var btnRegister = document.querySelector("button#btnRegister");
// var btnCall = document.querySelector("button#btnCall");
var localVideo = document.querySelector("video#localVideo");
var remoteVideo = document.querySelector("video#remoteVideo");
var lblFrom = document.querySelector("label#lblFrom");
var videoSelect = document.querySelector("select#videoSelect")
var btnRegister = document.querySelector("button#btnRegister");

let peer = null;
let localConn = null;
let localStream = null;

hashCode = function (str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function gotStream(stream) {
    console.log('received local stream');
    localStream = stream;
    localVideo.srcObject = localStream;
}

function sendMessage(from, to, action) {
    var message = { "from": from, "to": to, "action": action };
    if (!localConn) {
        localConn = peer.connect(hashCode(to));
        localConn.on('open', () => {
            localConn.send(JSON.stringify(message));
            console.log(message);
        });
    }
    if (localConn.open){
        localConn.send(JSON.stringify(message));
        console.log(message);
    }
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

//绑定摄像头列表到下拉框
function gotDevices(deviceInfos) {
    if (deviceInfos===undefined){
        return
    }
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

//开启本地摄像头
function start() {
    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    const videoSource = videoSelect.value;
    const constraints = {
        audio: false,
        video: { width: 320, deviceId: videoSource ? { exact: videoSource } : undefined }
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices)
        .catch(handleError);
}


