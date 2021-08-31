//TODO Add survey page and mechanism
// SVG should be fit better in portrait mode;

window.addEventListener("load", init, false);
window.addEventListener("devicemotion", handleMotion, true);
window.onbeforeunload = function () {
    if (streamStreaming) {
      UTIL.audioSocket.emit('endGoogleCloudStream', '');
    }
  };
window.addEventListener("visibilitychange", () => {
if(document.hidden){
    if(APP_STATE.DOMRegistered){
    DOM_EL.capture.elt.pause();
    UTIL.audioSocket.emit('endGoogleCloudStream', '');
    }
}
else{
    if(APP_STATE.DOMRegistered){
    DOM_EL.capture.elt.play();
    windowResized();
    }    
}
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }


function mouseDragged(){
    APP_STATE.mouseX = mouseX;
    APP_STATE.mouseY = mouseY;

    let distance = sqrt(Math.pow(APP_STATE.mouseX - width/2, 2) + Math.pow(abs(APP_STATE.mouseY - height/2) , 2));

    if(APP_STATE.mode == 1 && !APP_STATE.readyToSubmit){
        if(distance * 2 < CNV_EL.bubble.width * CNV_EL.bubble.orientationScale ){
            var one_point = {};
            one_point.x = mouseX - width/2;
            one_point.y = mouseY - height/2;
            pointBuffer.push(one_point);
            showButtons();
        }
        else{
        }
    }
}
function mouseReleased(event){
    
    if(event.srcElement.id.includes("palette-undo")){
        console.log("undo path");
        return;
    }
    if(APP_STATE.mode == 1 && !APP_STATE.readyToSubmit && pointBuffer.length>0){
        let n = Object.keys(shapesBubble).length;
        shapesBubble[n] = {};
        shapesBubble[n].payload = pointBuffer;
        shapesBubble[n].color = APP_STATE.currentColor;
        pointBuffer = [];
        console.log("pointbuffer added to shapesBubble");
    }

}


let recognition = null;

//================= CONFIG =================
// Stream Audio
let bufferSize = 2048,
  AudioContext,
  context,
  processor,
  input,
  globalStream;
  

//vars
let audioElement = document.querySelector('audio'),
//   finalWord = false,
  removeLastSentence = true,
  streamStreaming = false;

//audioStream constraints
const constraints = {
  audio: {channelCount: 1},
  video: false,
};

var downsampleBuffer = function (buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw 'downsampling rate show be smaller than original sample rate';
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
  
      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  };
  
  function capitalize(s) {
    if (s.length < 1) {
      return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

function convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l / 3);
  
    while (l--) {
      if (l % 3 == 0) {
        buf[l / 3] = buffer[l] * 0xffff;
      }
    }
    return buf.buffer;
  }

function initRecording() {
    UTIL.audioSocket.emit('startGoogleCloudStream', ''); //init socket Google Speech Connection
    streamStreaming = true;
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
      latencyHint: 'interactive',
    });

    APP_STATE.audioSampleRate = context.sampleRate;
    console.log("audio sample rate: "+ context.sampleRate);


    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();
  
    var handleSuccess = function (stream) {
      globalStream = stream;
      console.log(globalStream);
      input = context.createMediaStreamSource(stream);
      input.connect(processor);
  
      processor.onaudioprocess = function (e) {
        microphoneProcess(e);
      };
    };
  
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
  }

function microphoneProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    // var right = e.inputBuffer.getChannelData(1);
    // console.log(left);
    // var left16 = convertFloat32ToInt16(left); // old 32 to 16 function
    var left16 = downsampleBuffer(left, APP_STATE.audioSampleRate, 16000);
    // console.log(left16);
    UTIL.audioSocket.emit('binaryData', left16);
}

function stopRecording() {
    // waited for FinalWord
    // startButton.disabled = false;
    // endButton.disabled = true;
    // recordingStatus.style.visibility = 'hidden';
    streamStreaming = false;
    UTIL.audioSocket.emit('endGoogleCloudStream', '');
  
    let track = globalStream.getTracks()[0];
    track.stop();
  
    input.disconnect(processor);

    processor.disconnect(context.destination);
    context.close().then(function () {
      input = null;
      processor = null;
      context = null;
      AudioContext = null;
    });
  }


const ACTIVITY_INSTRUCTIONS = [
["📷: Take photo, 🔁: Flip camera, 🗑️: Discard","Flip Camera","Take Photo"],
["↩️: Undo, 🗑️: Discard" ,"Start Drawing","Stop Drawing"],
["⌨️: Keyboard, 🗑️: Discard, ↩️: Undo, 🎙️: Speech ","Start Typing","Start Recording"],
["Tilt your device to choose a shape","Confirm","Confirm"]
];

var MOVEMENT = {
    x : null,
    y : null,
    z : null,
    xx : null,
    yy : null,
    zz : null,
    rotateZ : null,
    rotateY : null,
    rotateX : null,
}

var DOM_EL = {
    loginContainer: null,
        loginTitleContainer: null,
        loginPinInput: null,
        loginNicknameInput: null,
        loginButton: null,
    
    onboardContainer: null,

    activityContainer: null,
        activityTitleContainer: null,
            activityTitle: null,
            activityFullscreen: null,
            activityInstructions: null,
        activityContentContainer: null,
        activityContent: null,
        activityPaletteContainer: null,
        activitySpeechContainer: null,
        activityCameraContainer: null,
        activityMirrorContainer: null,
        activitySliderContainer: null,
        activitySlider: null,
            activitySliderCamera: null,
            activitySliderDraw: null,
            activitySliderSpeech: null,
            activitySliderShapes: null,


    canvas: null,
    capture: null,
    captureOverlay: null,
    speechBubbleContainer: null,
    speechBubble: null,

    pauseContainer: null,
    bubbleoutContainer: null,

    feedbackContainer: null,
        feedbackButton: null,
        feedbackRating: [],

}

var CNV_EL = {
    bubble: null,
}

var UTIL = {
    thinking: ".",
    speechRec : null,
    speechRecBuffer: "",
    scribble: null,
    socket: null,
    audioSocket: null,
    thinking: ".",
    scribbleValue: 1,
    timer: 0,
    sttInterval: null,
    audioRecording: [],
    sliderHandler: null,
    canvas: null,
    ctx: null,
    speechBubbleContent: "",
    prevSpeechBubbleContent: "",
    cameraBubbleContent: null,
    paletteBubbleContent : null,
    // speechTimer: 0
}

var URL_PARAMS = {
    room: null,
    name: null,
  }

var APP_STATE = {
    pitUser: null,
    portrait: null,
    DOMRegistered: false,
    audioEnabled : false,
    audioSampleRate: null,
    vmin: null,
    logined: false,
    mode : 0,
    prevMode : 0,
    onboarded: false,
    finishLobby: false,
    width: null,
    height: null,
    nickname: "",
    speechRecorded: false,
    recording: false,
    inbuiltSTT: false,
    audioStream : false,
    ticktock: false,
    room : null,
    question : null,
    isSafari : null,
    uuid: null,
    switchFlag: false,
    readyToSubmit : false,
    currentColor : "black",
    mouseX: null,
    mouseY: null,
    scaler: 1,
    leftHalf : false,
    rightHalf : false,
    recording: false,
    dim1: null,
    dim2: null,
    feedbackRating : [],
    feedbackSubmitted : false,
    lockMode: false
}

var SOUNDS = {
    shutter: null,
    delete: null,
    pop: null,
  }

var palette = {
    entire: null,
    body : null,
    canvas : null,
    pickerBlue : null,
    pickerRed : null,
    pickerGreen : null,
    pickerBlack: null,
    pickerWhite: null,
}
var speech = {
    entire: null,
    body : null,
    canvas : null,
    discard : null,
    mike : null,
    mikeBG : null,
    keyboard : null,
    // ok: null,
}

var camera = {
    entire: null,
    body : null,
    canvas : null,
    discard : null,
    flip : null,
    snap : null,
    // ok: null,
}

var mirror = {
    entire: null,
    canvas : null,
    discard : null,
    snap : null,
}

var speechBubble = {

};
var cameraBubble = {

};
var paletteBubble = {

};
var shapesBubble = {};
let pointBuffer = [];



function preload() {
    soundFormats('mp3', 'ogg');
    SOUNDS.shutter = loadSound('sound/shutter');
    SOUNDS.delete = loadSound('sound/delete');
    SOUNDS.pop = loadSound('sound/pop');
  }

function handleMotion(event) {

    // event.preventDefault();

    MOVEMENT.x = event.accelerationIncludingGravity.x;
    MOVEMENT.y = event.accelerationIncludingGravity.y;
    MOVEMENT.z = event.accelerationIncludingGravity.z;

    // MOVEMENT.xx = event.acceleration.x;
    MOVEMENT.yy = event.acceleration.y;
    MOVEMENT.zz = event.acceleration.z;

    MOVEMENT.rotateZ = event.rotationRate.alpha;
    MOVEMENT.rotateY = event.rotationRate.gamma;
    MOVEMENT.rotateX = event.rotationRate.beta;

    if(APP_STATE.portrait == true){
        if(event.accelerationIncludingGravity.y > 5){
            // console.log("portrait 1");
            MOVEMENT.xx = event.acceleration.x * -1;
            // MOVEMENT.yy = event.acceleration.y;
        }
        else if(event.accelerationIncludingGravity.y < -5){
            // console.log("portrait 2");
            MOVEMENT.xx = event.acceleration.x;
            // MOVEMENT.yy = event.acceleration.y * -1;
        }

    }else if(APP_STATE.portrait == false){
        if(event.accelerationIncludingGravity.x > 5){
            // console.log("landscape 1");
            MOVEMENT.xx = event.acceleration.y;
        }
        else if(event.accelerationIncludingGravity.x < -5){
            // console.log("landscape 2");
            MOVEMENT.xx = event.acceleration.y * -1;   
            //  MOVEMENT.yy = event.acceleration.y * -1;

        }
    }

    if(MOVEMENT.zz < -10 &&  MOVEMENT.rotateX > 15){
        if(APP_STATE.mode == 0 && APP_STATE.readyToSubmit && UTIL.cameraBubbleContent!==null){
            triggerBubbleAnimation();
            APP_STATE.prevMode = 0;
        }
        else if(APP_STATE.mode == 1 && APP_STATE.readyToSubmit){
            triggerBubbleAnimation();
            APP_STATE.prevMode = 1;
        }
        else if(APP_STATE.mode == 2 && APP_STATE.readyToSubmit){
            if(UTIL.speechBubbleContent.length > 0){
                triggerBubbleAnimation();
                APP_STATE.prevMode = 2;
            }
        }
    }
}

function loginEvent(){
    resetLoginIframe();
    windowResized();

    if(DOM_EL.loginNicknameInput.value().length == 0){
        DOM_EL.loginNicknameInput.removeClass("no-error");
        setTimeout( () => DOM_EL.loginNicknameInput.addClass("no-error"), 300 );
    }
    else{
        // if(APP_STATE.audioStream){

        // }
        // else{
            try{
                initInbuiltSTT();
                APP_STATE.inbuiltSTT = true;
                console.log("there is inbuilt STT");
                APP_STATE.audioStream = false;
            }
            catch(err){
                console.error(err);
                console.log("there is NO inbuilt STT");
                APP_STATE.inbuiltSTT = false;
                APP_STATE.audioStream = true;
            }
        // }
        // openFullscreen(DOM_EL.loginButton.elt);
        APP_STATE.logined = true;
        APP_STATE.nickname = DOM_EL.loginNicknameInput.value();
        APP_STATE.room = DOM_EL.loginPinInput.value();
        UTIL.socket.emit("bubble_login",{"room":APP_STATE.room, "name":APP_STATE.nickname});
        location.assign(`/wand2?room=${APP_STATE.room}&name=${APP_STATE.nickname}&logined=true`);
        getAccel();
        DOM_EL.activityContainer.show();
        DOM_EL.loginContainer.hide();  
    }
  }


  function initInbuiltSTT(){
    // var SpeechRecognition;
    // var SpeechRecognitionEvent;

    var SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;

    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;

    
    recognition.onspeechstart = function() {
        console.log('Speech has been detected');
      }
    
    recognition.onspeechend = function(event) {
        APP_STATE.speechRecorded = false;
        console.log('Speech end has been detected');
    }
    recognition.onsoundstart = function(event) {
        console.log('Sound detected');
    }
    recognition.onsoundend = function(event) {
        APP_STATE.speechRecorded = false;
        console.log('Sound ended');
    }
    
    recognition.onresult = function(event) {
        UTIL.speechRecBuffer = "";
        console.log(event);
        for(let i = 0; i <= event.resultIndex; i++){
            UTIL.speechRecBuffer += event.results[i][0].transcript;
            UTIL.speechRecBuffer += " ";
            if(event.results[i].isFinal){
                APP_STATE.speechRecorded = true;
                console.log("final transcript: " +  event.results[i][0].transcript);
               UTIL.prevSpeechBubbleContent =  UTIL.speechBubbleContent;
                UTIL.speechBubbleContent = UTIL.speechBubbleContent + event.results[i][0].transcript + ".\n" ;
                setTimeout(() => {
                    CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
                    stopAudioRecording();
                    showButtons();
                },0);
            }
            else{
                CNV_EL.bubble.changeContents(UTIL.speechBubbleContent + " " + UTIL.speechRecBuffer);
            }
        }
        if(!APP_STATE.speechRecorded){
            CNV_EL.bubble.changeContents(UTIL.speechBubbleContent + " " + UTIL.speechRecBuffer);
        }
        
      }
    
    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
        console.log('attempting restart');
        if(UTIL.speechRecBuffer.length > 0){
            UTIL.prevSpeechBubbleContent =  UTIL.speechBubbleContent;
            UTIL.speechBubbleContent = UTIL.speechBubbleContent + UTIL.speechRecBuffer + ".\n" ;
            CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
        }
        stopAudioRecording();
        
        if(event.error == "service-not-allowed"){
            APP_STATE.inbuiltSTT = false;
            APP_STATE.audioStream = true;
        }
        // setTimeout(() => {
        //     recognition.start();
        // },5);
    }
  }
  
  function showLoginError(){
    DOM_EL.loginPinInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginPinInput.addClass("no-error");
    },300);
  }

  function getAccel(){
    try{ 
        DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
            // DOM_EL.errorContainer.style("display","none");
            console.log("accelerometer permission granted");
            APP_STATE.motionEnabled = true;
            // Do stuff here
            window.addEventListener("devicemotion", handleMotion, true);
        }
        else{
            DOM_EL.errorHeader.html("Error : you did not enable motion permissions");
            DOM_EL.errorContent.html("Restart Safari to solve issue");
            DOM_EL.refreshButton.hide();
            DOM_EL.errorImage.elt.src = "image/error2.png";
            DOM_EL.errorContainer.style("display","flex");
        }
    });
    }
    catch(err) {
            window.addEventListener("devicemotion", handleMotion, true);
            DOM_EL.errorContainer.style("display","none");
        }
}

function rescalePaletteColors(){
    palette.pickerWhite.animate({transform:'s1.5',transform: 't0,-5'},100);
    palette.pickerBlack.animate({transform:'s1.5',transform: 't0,-5'},100);
    palette.pickerBlue.animate({transform:'s1.5',transform: 't0,-5'},100);
    palette.pickerGreen.animate({transform:'s1.5',transform: 't0,-5'},100);
    palette.pickerRed.animate({transform:'s1.5',transform: 't0,-5'},100);
}

function registerSVG(){
    palette.entire = Snap.select("#palette-entire");
    // palette.body = Snap.select("#palette-body");
    palette.canvas = Snap.select("#palette-canvas");
    palette.pickerRed = Snap.select("#picker-red");
    palette.pickerGreen = Snap.select("#picker-green");
    palette.pickerBlue = Snap.select("#picker-blue");
    palette.pickerBlack = Snap.select("#picker-black");
    palette.pickerBlack.animate({transform:'s1.2'},100);
    palette.pickerWhite = Snap.select("#picker-white");
    palette.discard = Snap.select("#palette-discard");
    // palette.ok = Snap.select("#palette-ok");
    palette.undo = Snap.select("#palette-undo");

    palette.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
    palette.undo.animate({transform:'s1.5',transform: 't0,-5'},100);
    rescalePaletteColors();
    palette.pickerBlack.animate({transform:'s1.0',transform: 't0,-1'},100);


    // palette.body.click(function () {
    //     console.log("palette body");
    // });    
    palette.canvas.click(function () {
        console.log("palette canvas");
    });
    palette.pickerRed.click(function () {
        console.log("pickerRed body");
        rescalePaletteColors();
        APP_STATE.currentColor = "indianred";
        palette.pickerRed.animate({transform:'s1.0',transform: 't0,-1'},100);
    });
    palette.pickerGreen.click(function () {
        console.log("pickerBlue body");
        rescalePaletteColors();
        APP_STATE.currentColor = "green";
        palette.pickerGreen.animate({transform:'s1.0',transform: 't0,-1'},100);
    });
    palette.pickerBlue.click(function () {
        console.log("pickerBlue body");
        APP_STATE.currentColor = "blue";
        rescalePaletteColors();
        palette.pickerBlue.animate({transform:'s1.0',transform: 't0,-1'},100);

    });
    palette.pickerBlack.click(function () {
        console.log("pickerBlack body");
        APP_STATE.currentColor = "black";
        rescalePaletteColors();
        palette.pickerBlack.animate({transform:'s1.0',transform: 't0,-1'},100);
    });
    palette.pickerWhite.click(function () {
        console.log("pickerWhite body");
        APP_STATE.currentColor = "white";
        rescalePaletteColors();
        palette.pickerWhite.animate({transform:'s1.0',transform: 't0,-1'},100);
    });
    palette.discard.click(function () {
        console.log("palette discard");
        palette.discard.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            palette.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        shapesBubble = {};
        pointBuffer = [];
        SOUNDS.delete.play();
        retractButtons();
    });
    palette.undo.click(function () {
        console.log("palette undo");
        palette.undo.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            palette.undo.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        let n = Object.keys(shapesBubble).length;
        if(n > 0){
            delete shapesBubble[n-1];
        }
        else if (n == 0){
            retractButtons();
        }
    });

    camera.entire = Snap.select("#camera-entire");
    // camera.body = Snap.select("#camera-body");
    camera.canvas = Snap.select("#camera-canvas");
    camera.discard = Snap.select("#camera-discard");
    camera.flip = Snap.select("#camera-flip");
    camera.snap = Snap.select("#camera-snap");

    camera.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
    camera.flip.animate({transform:'s1.5',transform: 't0,-5'},100);
    camera.snap.animate({transform:'s1.5',transform: 't0,-5'},100);


    // camera.body.click(function () {
    //     console.log("camera body");
    // });    
    camera.canvas.click(function () {
        console.log("camera canvas");
    });
    camera.discard.click(function () {
        console.log("camera discard");
        SOUNDS.delete.play();
        camera.discard.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            camera.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        closeSnap();
        retractButtons();
    });
    camera.flip.click(function () {
        console.log("camera flip");
        camera.flip.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            camera.flip.animate({transform:'s1.5',transform: 't0,-5'},100);
            switchCamera();
        },100);
        retractButtons();
    });
    camera.snap.click(function () {
        console.log("camera snap");
        camera.snap.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            camera.snap.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        SOUNDS.shutter.play();
        snapEvent();
        showButtons();
    });


    speech.entire = Snap.select("#speech-entire");
    // speech.body = Snap.select("#speech-body");
    speech.canvas = Snap.select("#speech-canvas");
    speech.discard = Snap.select("#speech-discard");
    speech.mike = Snap.select("#speech-mike");
    speech.undo = Snap.select("#speech-undo");
    speech.mikeBG = Snap.select("#speech-mike-bg");
    speech.keyboard = Snap.select("#speech-keyboard");

    speech.mike.animate({transform:'s1.5',transform: 't0,-5'},100);
    speech.undo.animate({transform:'s1.5',transform: 't0,-5'},100);
    speech.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
    speech.keyboard.animate({transform:'s1.5',transform: 't0,-5'},100);

 
    speech.canvas.click(function () {
        console.log("speech canvas");
    });
    speech.discard.click(function () {
        console.log("speech discard");
        speech.discard.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            speech.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        SOUNDS.delete.play();
        UTIL.speechBubbleContent = "";
        retractButtons();
        CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
    });
    speech.mike.click(function () {
        console.log("speech mike");
        if(APP_STATE.recording){
            stopAudioRecording();
            // if(APP_STATE.inbuiltSTT){
            //     recognition.stop();
            // }else{
            //     if(APP_STATE.audioStream){
            //         stopAudioRecording();
            //     }
            // }
            // APP_STATE.recording = false;
            // speech.mikeBG.removeClass("active");
        }
        else{
            APP_STATE.recording = true;
            speech.mike.animate({transform:'s1.0',transform: 't0,-1'},100);
            speech.mikeBG.addClass("active");

            // else{
            if(APP_STATE.inbuiltSTT){
                recognition.start();
                console.log("start inbuilt STT recording");
            }else{
                if(APP_STATE.audioStream){
                    initRecording();
                    console.log("start audio recording");
                }
            }
        }
    });
    speech.undo.click(function () {
        console.log("speech undo");
        speech.undo.animate({transform:'s1.0',transform: 't0,0'},100);
        setTimeout(()=>{
            speech.undo.animate({transform:'s1.5',transform: 't0,-5'},100);
        },100);
        UTIL.speechBubbleContent = UTIL.prevSpeechBubbleContent;
        if( UTIL.speechBubbleContent == ""){
            retractButtons();
        }
        CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
    });

    speech.keyboard.click(function () {
        console.log("speech keyboard");
        speech.keyboard.animate({transform:'s1.0',transform: 't0,-1'},100);
        editContentEvent();
    });

    mirror.entire = Snap.select("#mirror-entire");
    mirror.canvas = Snap.select("#mirror-canvas");
    mirror.discard = Snap.select("#mirror-discard");
    mirror.snap = Snap.select("#mirror-snap");

    // mirror.discard.animate({transform:'s1.5',transform: 't0,-5'},100);
    mirror.snap.animate({transform:'s1.5',transform: 't0,-5'},100);

    mirror.snap.click(function () {
        console.log("mirror snap");
    });
}

function retractButtons(){
    CNV_EL.bubble.leftButton.addClass("retracted");
    CNV_EL.bubble.rightButton.addClass("retracted");
}

function showButtons(){
    CNV_EL.bubble.leftButton.removeClass("retracted");
    CNV_EL.bubble.rightButton.removeClass("retracted");
}

function stopAudioRecording(){
    APP_STATE.recording = false;
    speech.mikeBG.removeClass("active");
    speech.mike.animate({transform:'s1.5',transform: 't0,-5'},100);
    // else{
    if(APP_STATE.inbuiltSTT){
        recognition.stop();
    }else{
        if(APP_STATE.audioStream){
            stopRecording();
            console.log("stop audio recording");
        }
    }
    // }
}


function setup(){

    let params = (new URL(document.location)).searchParams;
    // URL_PARAMS.room = parseInt(params.get('room')); 
    URL_PARAMS.room = params.get('room'); 


    // AudioContext = window.AudioContext || window.webkitAudioContext;
    registerSVG();

    setInterval(()=>{
        UTIL.thinking+=".";
        if(UTIL.thinking.length > 3){
            UTIL.thinking = ".";
        }
        if(!APP_STATE.finishLobby){
            DOM_EL.activityTitle.html("Waiting for others to join" + UTIL.thinking);
        }
    },1000);

    if(localStorage.getItem('uuid')){
        APP_STATE.uuid = localStorage.getItem('uuid');
        console.log("retrieved uuid: " + APP_STATE.uuid);
    }
    else{
        let n = Date.now();
        localStorage.setItem('uuid',n);
        APP_STATE.uuid = n;
        console.log("created uuid: " + APP_STATE.uuid);
    }



    APP_STATE.isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;

    // if(APP_STATE.isSafari){
    //     window.addEventListener("keydown", keydownHelper); 
    //   }

    setInterval(()=>{
        UTIL.thinking+=".";
            if(UTIL.thinking == "...."){
                UTIL.thinking = "."
            }
        },1000);
    frameRate(10);
    startCon();

    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginTitleContainer = select("#login-title-container");
    DOM_EL.loginPinInput = select("#login-pin-input");
      DOM_EL.loginPinInput.addClass("no-error");
    //   DOM_EL.loginPinInput.hide();
    DOM_EL.loginNicknameInput = select("#login-nickname-input");
        DOM_EL.loginNicknameInput.addClass("no-error");

    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(loginEvent);

    DOM_EL.onboardContainer = select("#onboard-container");
    DOM_EL.onboardContainer.hide();


    DOM_EL.activityContainer = select("#activity-container");
        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityInstructions = select("#activity-instructions");
        DOM_EL.activityContentContainer = select("#activity-content-container");
        DOM_EL.activityContentContainer.mousePressed(()=>{
            if(IFRAME.speechFrameLoaded){toggleSpeechIframe;}
        });
        DOM_EL.activitySliderContainer = select("#activity-slider-container");
        DOM_EL.activitySlider = select("#activity-slider");
            DOM_EL.activitySliderCamera = select("#activity-slider-camera");
            DOM_EL.activitySliderDraw = select("#activity-slider-draw");
            DOM_EL.activitySliderSpeech = select("#activity-slider-speech");
            DOM_EL.activitySliderShapes = select("#activity-slider-shapes");
            DOM_EL.activitySliderCamera.mousePressed(()=>{
                if(!APP_STATE.lockMode){
                    shiftSlider(0);
                }
            });
            DOM_EL.activitySliderDraw.mousePressed(()=>{
                if(!APP_STATE.lockMode){
                    shiftSlider(1);
                }            });
            DOM_EL.activitySliderSpeech.mousePressed(()=>{
                if(!APP_STATE.lockMode){
                    shiftSlider(2);
                }            });
            DOM_EL.activitySliderShapes.mousePressed(()=>{
                if(!APP_STATE.lockMode){
                    shiftSlider(3);
                }            
            });


        DOM_EL.activityPaletteContainer = select("#activity-palette-container");
        DOM_EL.activitySpeechContainer = select("#activity-speech-container");
        DOM_EL.activityCameraContainer = select("#activity-camera-container");
        DOM_EL.activityMirrorContainer = select("#activity-mirror-container");
        DOM_EL.activityPaletteContainer.hide();
        DOM_EL.activitySpeechContainer.hide();
        DOM_EL.activityMirrorContainer.hide();
            
            DOM_EL.activitySlider.style("transform",`translateX(${-DOM_EL.activitySliderCamera.width/2}px)`);

            let w = window.innerWidth;
            let h = window.innerHeight - convertRemToPixels(8);

            if(w>h){
                APP_STATE.dim1 = w;
                APP_STATE.dim2 = h;
            }
            else{
                APP_STATE.dim1 = h;
                APP_STATE.dim2 = w;
            }


    DOM_EL.canvas = createCanvas(w,h);
    DOM_EL.canvas.parent(DOM_EL.activityContentContainer);

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      APP_STATE.vmin = vw;
      document.documentElement.style.setProperty('--vmin', `${vw}px`);
    }
    else{
      APP_STATE.vmin = vh;
      document.documentElement.style.setProperty('--vmin', `${vh}px`);
    }

    DOM_EL.activityContainer.hide();


    DOM_EL.errorContainer = select("#error-container");
    DOM_EL.errorContainer.hide();
    DOM_EL.errorContainer.position(0,0);

    DOM_EL.pauseContainer = select("#pause-container");
    DOM_EL.pauseContainer.hide();
    DOM_EL.pauseContainer.position(0,0);

    DOM_EL.bubbleoutContainer = select("#bubbleout-container");
    DOM_EL.bubbleoutContainer.hide();
    DOM_EL.bubbleoutContainer.position(0,0);

    DOM_EL.errorImage = select("#error-image");
    DOM_EL.errorHeader = select("#error-header");
    DOM_EL.errorContent = select("#error-content");

    DOM_EL.refreshButton = select("#refresh-button");
    DOM_EL.refreshButton.mousePressed(refreshEvent);

    try{
        options = {
            video: {
                facingMode: "environment" 
            }
        };
        DOM_EL.capture = createCapture(options,(stream)=>{
              console.log(stream);
              console.log("camera allowed successfully");
              APP_STATE.cameraEnabled = true;
            //   DOM_EL.capture.parent(DOM_EL.activityCameraContainer);
          });
        DOM_EL.capture.id("video");
    }
    catch{
        // alert("you must allow camera permissions");
        // location.reload();
    }
    

    DOM_EL.captureOverlay = createDiv();
    DOM_EL.captureOverlay.id("video-overlay");

    UTIL.canvas = document.createElement("canvas");
    UTIL.canvas.style.display = 'none';
    UTIL.ctx = UTIL.canvas.getContext("2d");


    UTIL.scribble = new Scribble();

    CNV_EL.bubble = new ThoughtBubble(0, 0, APP_STATE.vmin*75, APP_STATE.vmin*75, "", {R:random(0,255),G:random(0,255),B:random(0,255)}, true) //💬<i>say your reply and your wand will capture it!</i>

    UTIL.sliderHandler = new Hammer(DOM_EL.activityContainer.elt);
    UTIL.sliderHandler.on('swipeleft swiperight', function(ev) {
        if(!APP_STATE.lockMode){
            windowResized();
            let distance = sqrt(Math.pow(APP_STATE.mouseX - width/2, 2) + Math.pow(abs(APP_STATE.mouseY - height/2) , 2));
            console.log(ev.type);
            APP_STATE.readyToSubmit = false;
            let totalOffset = 0;
            if(APP_STATE.mode == 1){
                if(distance * 2 < CNV_EL.bubble.width * CNV_EL.bubble.orientationScale ){
                    return;
                }
            }
            DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.remove("active");
            if(pointBuffer.length > 0){return;}
            if(ev.type == "swipeleft"){
                APP_STATE.mode++;
                if(APP_STATE.mode > 3){
                    APP_STATE.mode = 3;
                }
            }
            else if(ev.type == "swiperight"){
                APP_STATE.mode--;
                if(APP_STATE.mode < 0){
                    APP_STATE.mode = 0;
                }
            }
            DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");
    
            for(let i = 0; i <= APP_STATE.mode; i++){
                if(i == 0){
                    totalOffset -= DOM_EL.activitySlider.elt.children[i].offsetWidth/2 + convertRemToPixels(2);
                }
                else{
                    totalOffset -= DOM_EL.activitySlider.elt.children[i].offsetWidth + convertRemToPixels(2);
                }
            }
            console.log(totalOffset);
            showRelevantSVG();
    
            DOM_EL.activityInstructions.html(ACTIVITY_INSTRUCTIONS[APP_STATE.mode][0]);
            DOM_EL.activitySlider.style("transform",`translateX(${totalOffset}px)`);
        }
    });
    DOM_EL.feedbackContainer = select("#feedback-container");
    DOM_EL.feedbackButton = select("#feedback-button");
    DOM_EL.feedbackButton.mousePressed(checkFeedbackCompletion);

    
    for(let i = 0; i < 6; i++){
        APP_STATE.feedbackRating[i] = null;
        DOM_EL.feedbackRating[i] = document.getElementsByClassName("star"+i);
        for (let j = 0; j < DOM_EL.feedbackRating[i].length; j++) {
            DOM_EL.feedbackRating[i][j].addEventListener("click", function(){
              Array.from(document.querySelectorAll(".star"+i+".selected")).forEach((el)=>{
                  el.classList.remove('selected');
              });
              DOM_EL.feedbackRating[i][j].classList.add("selected");
                APP_STATE.feedbackRating[i] = DOM_EL.feedbackRating[i].length-j;
                console.log("feedback "+ i + ": rating " + APP_STATE.feedbackRating[i]);
                // checkFeedbackCompletion();
            });
          }
    }


    APP_STATE.DOMRegistered = true;
    resetLoginIframe();

    if(!APP_STATE.audioEnabled){
        askAudioPermissions();
    }
    getAccel();

}

function checkFeedbackCompletion(){
    let completed = true;
    APP_STATE.feedbackRating.forEach((rating)=>{
        if(rating == null){completed = false;}
    });
    if(completed){
      DOM_EL.feedbackContainer.addClass("hide");
      Array.from(document.querySelectorAll(".star.selected")).forEach((el)=>{
        el.classList.remove('selected');
    });

    UTIL.socket.emit("bubble_feedback",{
        "timestamp": Date.now(),
        "pitUser":APP_STATE.pitUser,
        "user":APP_STATE.nickname,
        "room":APP_STATE.room,
        "ratings0":APP_STATE.feedbackRating[0],
        "ratings1":APP_STATE.feedbackRating[1],
        "ratings2":APP_STATE.feedbackRating[2],
        "ratings3":APP_STATE.feedbackRating[3],
        "ratings4":APP_STATE.feedbackRating[4],
        "ratings5":APP_STATE.feedbackRating[4]
    });
    for(let i = 0; i<APP_STATE.feedbackRating.length; i++){
        APP_STATE.feedbackRating[i] = null;
    }
    APP_STATE.feedbackSubmitted = true;
    }
  }

function shiftSlider(num){
    APP_STATE.readyToSubmit = false;
    DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.remove("active");
    APP_STATE.mode = num;
    DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");      
    moveSlider();
    showRelevantSVG();
    windowResized();
}

function showRelevantSVG(){
    DOM_EL.activityPaletteContainer.addClass("hide");
    DOM_EL.activitySpeechContainer.addClass("hide");
    DOM_EL.activityCameraContainer.addClass("hide");
    DOM_EL.activityMirrorContainer.addClass("hide");
    setTimeout(()=>{
        DOM_EL.activityPaletteContainer.hide();
        DOM_EL.activitySpeechContainer.hide();
        DOM_EL.activityCameraContainer.hide();
        DOM_EL.activityMirrorContainer.hide();

        if(APP_STATE.mode == 0){
            DOM_EL.activityCameraContainer.style("display","flex");
            DOM_EL.activityCameraContainer.removeClass("hide");
            DOM_EL.capture.style("display","flex");
            CNV_EL.bubble.textDiv.hide();
            if(UTIL.cameraBubbleContent !== null){
                showButtons();
            }else{
                retractButtons();   
            }
        }
        else if(APP_STATE.mode == 1){
            DOM_EL.activityPaletteContainer.style("display","flex");
            DOM_EL.activityPaletteContainer.removeClass("hide");
            DOM_EL.capture.hide();
            CNV_EL.bubble.textDiv.hide();
            if(Object.keys(shapesBubble).length>0){
                showButtons();
            }else{
                retractButtons();  
            }
        }
        else if(APP_STATE.mode == 2){
            if(!APP_STATE.audioEnabled){
                askAudioPermissions();
            }
            CNV_EL.bubble.textDiv.style("display","flex");
            DOM_EL.activitySpeechContainer.style("display","flex");
            DOM_EL.activitySpeechContainer.removeClass("hide");
            DOM_EL.capture.hide();
            if(UTIL.speechBubbleContent.length>0){
                showButtons();
            }else{
                retractButtons();
            }
        }
        else if(APP_STATE.mode == 3){
            CNV_EL.bubble.textDiv.hide();
            DOM_EL.activityMirrorContainer.style("display","flex");
            DOM_EL.activityMirrorContainer.removeClass("hide");
            DOM_EL.capture.hide();
            retractButtons();
        }
    },300);


}

function askAudioPermissions(){
    navigator.mediaDevices.getUserMedia(constraints).then(()=>{
        console.log("audio permission obtained");
        APP_STATE.audioEnabled = true;
    }
    );
}

function moveSlider(){
    let totalOffset = 0;
    for(let i = 0; i <= APP_STATE.mode; i++){
        if(i == 0){
            totalOffset -= DOM_EL.activitySlider.elt.children[i].offsetWidth/2 + convertRemToPixels(2);
        }
        else{
            totalOffset -= DOM_EL.activitySlider.elt.children[i].offsetWidth + convertRemToPixels(2);
        }
    }
    console.log(totalOffset);
    DOM_EL.activityInstructions.html(ACTIVITY_INSTRUCTIONS[APP_STATE.mode][0]);
    DOM_EL.activitySlider.style("transform",`translateX(${totalOffset}px)`);
}

function refreshEvent(){
    if(!APP_STATE.cameraEnabled){
        window.location = window.location.href+'?eraseCache=true';
        location.reload(true);
    }
    else if(!APP_STATE.motionEnabled){
        DOM_EL.errorContainer.style("display","none");
        window.location = window.location.href+'?eraseCache=true';
        location.reload(true);
    }
}

function snapEvent(){
    SOUNDS.shutter.play();

    UTIL.canvas.width = DOM_EL.capture.elt.width;
    UTIL.canvas.height = DOM_EL.capture.elt.height;

    DOM_EL.captureOverlay.addClass("flash");
    setTimeout(() => DOM_EL.captureOverlay.removeClass("flash"), 100);

    DOM_EL.capture.pause();

    UTIL.ctx.drawImage(DOM_EL.capture.elt, 0, 0);
    UTIL.cameraBubbleContent = UTIL.canvas.toDataURL('image/jpeg',0.5);
}

function closeSnap(){
    UTIL.cameraBubbleContent = null;
    DOM_EL.capture.play();
}

function switchCamera()
{
  APP_STATE.switchFlag = !APP_STATE.switchFlag;
  if(APP_STATE.switchFlag==true)
  {
    DOM_EL.capture.stop();
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "environment" 
     }
   };

  }
  else{
    DOM_EL.capture.stop();
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "user" 
     }
   };
  }
  DOM_EL.capture = createCapture(options, function(stream) {
    console.log(stream);
  });

  DOM_EL.capture.id("video");
  DOM_EL.capture.parent(CNV_EL.bubble.div);

}


function draw(){
    clear();    
    CNV_EL.bubble.render();
}


function triggerBubbleAnimation(){
    if(!CNV_EL.bubble.bubbleOut){
        if(APP_STATE.mode == 0 && UTIL.cameraBubbleContent == null){return;}
        else if(APP_STATE.mode == 1 && UTIL.paletteBubbleContent == null){return;}
        else if(APP_STATE.mode == 2 && UTIL.speechBubbleContent == ""){return;}
        else{
            DOM_EL.bubbleoutContainer.style("display","flex");
            SOUNDS.pop.play();
            CNV_EL.bubble.bubbleOut = true;
            CNV_EL.bubble.frameCount = frameCount;
            CNV_EL.bubble.randomSeed = random(-10,10);
        }
    }
    CNV_EL.bubble.instructionDiv.addClass("hidden");
    
}

function init() {

	mm = new MobileMovement();
    
    mm.on("basketball shot", function(info) {

        if(APP_STATE.mode == 0 && APP_STATE.readyToSubmit && UTIL.cameraBubbleContent!==null){
            triggerBubbleAnimation();
            APP_STATE.prevMode = 0;
        }
        else if(APP_STATE.mode == 1  && APP_STATE.readyToSubmit){
            triggerBubbleAnimation();
            APP_STATE.prevMode = 1;
        }
        else if(APP_STATE.mode == 2  && APP_STATE.readyToSubmit){
            if(UTIL.speechBubbleContent.length > 0){
                triggerBubbleAnimation();
                APP_STATE.prevMode = 2;
            }
        }

	});
}



function updateReadyToSubmit(){
    if(APP_STATE.leftHalf && APP_STATE.rightHalf){
        console.log("both buttons pressed");
        APP_STATE.readyToSubmit = true;
        CNV_EL.bubble.instructionDiv.removeClass("hidden");
        DOM_EL.activityInstructions.addClass("hide");
        if(APP_STATE.mode == 0){
            DOM_EL.activityCameraContainer.addClass("hide");
            // console.log("ready to submit");
        }
        else if(APP_STATE.mode == 1){
            UTIL.paletteBubbleContent = createImage(CNV_EL.bubble.width * CNV_EL.bubble.orientationScale,CNV_EL.bubble.width * CNV_EL.bubble.orientationScale);
            UTIL.paletteBubbleContent = get(width/2 - CNV_EL.bubble.width * CNV_EL.bubble.orientationScale/2, 
                                height/2 - CNV_EL.bubble.width * CNV_EL.bubble.orientationScale/2,
                                CNV_EL.bubble.width * CNV_EL.bubble.orientationScale,
                                CNV_EL.bubble.width * CNV_EL.bubble.orientationScale
                                );
            // DOM_EL.activityPaletteContainer.style("opacity","0");
            DOM_EL.activityPaletteContainer.addClass("hide");
            // console.log("ready to submit");
        }
        else if(APP_STATE.mode == 2){
            DOM_EL.activitySpeechContainer.addClass("hide");
            // console.log("ready to submit");
        }
    }
    else{
        console.log("either button or both not pressed");
        CNV_EL.bubble.instructionDiv.addClass("hidden");
        DOM_EL.activityInstructions.removeClass("hide");
        APP_STATE.readyToSubmit = false;
        if(APP_STATE.mode == 0){
            // UTIL.cameraBubbleContent = null;
            DOM_EL.activityCameraContainer.removeClass("hide");
        }
        else if(APP_STATE.mode == 1){
            // UTIL.paletteBubbleContent = null;
            DOM_EL.activityPaletteContainer.removeClass("hide");
        }
        else if(APP_STATE.mode == 2){
            // UTIL.speechBubbleContent = "";
            DOM_EL.activitySpeechContainer.removeClass("hide");
        }
    }
}

class ThoughtBubble {
    constructor(posX, posY, width, height, contents, color, handle = false){
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.height = height;
        this.contents = contents;
        this.contentsHTML = contents.replace("\n","<br>");
        this.handle = handle;
        this.shiftX = 0;
        this.scaleX = 1.0;
        this.scaleXY = 1.0;
        this.bubbleOut = false;
        this.frameCount;
        this.randomSeed;
        this.color = color;
        this.mouseIsDragged;

        this.offsetX = 0;
        this.offsetY = 0;

        this.div = createDiv();
        this.div.addClass("bubble");
        this.div.parent(DOM_EL.activityContentContainer);
        this.div.id("bubble-container");

        this.textDiv = createDiv(contents);
        this.textDiv.addClass("bubble-contents");
        this.textDiv.parent(this.div);

        this.rightButton = select("#right-button");
        this.rightButton.addClass("side");
        this.rightButtonManager = new Hammer.Manager(this.rightButton.elt);
        var Press2 = new Hammer.Press({
            time: 5
        });
        this.rightButtonManager.add(Press2);
        this.rightButtonManager.add(new Hammer.Pan({}));

        this.leftButton = select("#left-button");
        this.leftButtonManager = new Hammer.Manager(this.leftButton.elt);
        var Press = new Hammer.Press({
            time: 5
            });
        this.leftButtonManager.add(Press);
        this.leftButtonManager.add(new Hammer.Pan({}));

        this.leftButtonManager.on('press pressup panend', function(ev) {
            if(ev.type == "press"){
                APP_STATE.leftHalf = true;
                CNV_EL.bubble.leftButton.addClass("active");
            }
            else if (ev.type == "pressup"){
                APP_STATE.leftHalf = false;
                CNV_EL.bubble.leftButton.removeClass("active");
            }
            else if (ev.type == "panend"){
                APP_STATE.leftHalf = false;
                CNV_EL.bubble.leftButton.removeClass("active");
            }
            updateReadyToSubmit();
        });

        this.rightButtonManager.on('press pressup panend', function(ev) {
            if(ev.type == "press"){
                APP_STATE.rightHalf = true;
                CNV_EL.bubble.rightButton.addClass("active");
            }
            else if (ev.type == "pressup"){
                APP_STATE.rightHalf = false;
                CNV_EL.bubble.rightButton.removeClass("active");
            }
            else if (ev.type == "panend"){
                APP_STATE.rightHalf = false;
                CNV_EL.bubble.rightButton.removeClass("active");
            }
            updateReadyToSubmit();
        });


        this.orientationScale = 0.7;

        this.instructionDiv = createDiv();
        this.instructionDiv.id("instruction-div")
        this.instructionDiv.attribute("tabindex", "-1");
        this.instructionDiv.addClass("hidden");
        
        this.instructionImage = createImg("image/wand_instruction.gif");
        this.instructionImage.id("instruction-image");
        this.instructionImage.parent(this.instructionDiv);
        
        this.instruction = createDiv("Wave your device to send your speech bubble to the board");
        this.instruction.id("instruction");
        this.instruction.parent(this.instructionDiv);

        this.shiftXMap = 0;
        this.scaleXYMap = 1;
        this.offset;

        DOM_EL.capture.parent(this.div);
        DOM_EL.captureOverlay.parent(this.div);

    }
    render(){

        imageMode(CENTER);
        rectMode(CENTER);
        let circleDia;

        if(APP_STATE.mode == 0){
            circleDia = camera.canvas.getBBox().h;
            APP_STATE.scaler =  camera.entire.getBBox().h / camera.canvas.getBBox().h;
            this.offset = (300 - camera.canvas.getBBox().cy) * APP_STATE.scaler ;        
        }else if(APP_STATE.mode == 1){
            circleDia = palette.canvas.getBBox().h;
            APP_STATE.scaler =  palette.entire.getBBox().h / palette.canvas.getBBox().h;
            this.offset = (300 - palette.canvas.getBBox().cy) * APP_STATE.scaler ;
        }else if(APP_STATE.mode == 2){
            circleDia = speech.canvas.getBBox().h;
            APP_STATE.scaler =  speech.entire.getBBox().h / speech.canvas.getBBox().h;
            this.offset = (300 - speech.canvas.getBBox().cy) * APP_STATE.scaler ;
        }else if(APP_STATE.mode == 3){
            APP_STATE.scaler =  1;
            this.offset = 0;
        }

        push();
        translate(width / 2, height / 2 );
        scale(1/APP_STATE.scaler);

        if(APP_STATE.readyToSubmit){
            this.shiftX = lerp(this.shiftX, MOVEMENT.xx, 0.1);
            this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
            this.shiftXMap = this.shiftX * this.width/8;
            this.scaleXYMap = 1 + this.scaleXY/8;
            this.scaleX = 1- abs(this.shiftXMap/this.width);
        
            stroke(0);
            strokeWeight(1);
            noFill();
            UTIL.scribble.scribbleEllipse( this.x + this.shiftXMap, this.y - this.offset, this.width * this.scaleX * this.scaleXYMap, this.height * this.scaleXYMap);
            UTIL.scribble.scribbleEllipse( this.x + this.shiftXMap, this.y - this.offset, this.width * this.scaleX * this.scaleXYMap, this.height * this.scaleXYMap);
            UTIL.scribble.scribbleEllipse( this.x + this.shiftXMap, this.y - this.offset, this.width * this.scaleX * this.scaleXYMap, this.height * this.scaleXYMap);
            if(this.handle){
                this.drawHandle();
            }
            fill(255);
            noStroke();
            ellipse( this.x + this.shiftXMap, this.y - this.offset, this.width * this.scaleX * this.scaleXYMap - 20, this.height * this.scaleXYMap - 20);
        }
        pop();

        // if(APP_STATE.mode == 1 && !APP_STATE.readyToSubmit && !this.bubbleOut){
        //     this.drawScribble();  
        // }
        
        if(!this.bubbleOut){

            if(APP_STATE.readyToSubmit){
                this.div.position(this.x + this.shiftXMap + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
                this.div.size(this.width * this.scaleX * this.scaleXYMap * this.orientationScale, this.height * this.orientationScale * this.scaleXYMap);
            }
            else{
                this.div.position(this.x + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
                this.div.size(this.width * this.orientationScale, this.height * this.orientationScale);
            }
            
            if(APP_STATE.mode == 1 && !APP_STATE.readyToSubmit){
                this.drawScribble();  
            }
            else if(APP_STATE.mode == 1 && APP_STATE.readyToSubmit && UTIL.paletteBubbleContent !==null){
                image(
                    UTIL.paletteBubbleContent,
                    width/2 + this.shiftXMap ,
                    height/2  - this.offset,
                    UTIL.paletteBubbleContent.width * this.scaleX * this.scaleXYMap,
                    UTIL.paletteBubbleContent.height * this.scaleXYMap,
                    );
            }
            else if(APP_STATE.mode == 2){
                this.textDiv.html(this.contentsHTML);
            }
        }
        else{
            push();
            translate(width / 2, height / 2 );
            UTIL.scribble.scribbleEllipse( 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30),
                this.width * this.orientationScale + 10* sin(frameCount), 
                this.height * this.orientationScale + 10* cos(frameCount) 
                );
            fill(this.color.R,this.color.G,this.color.B,10);
            stroke(this.color.R,this.color.G,this.color.B,10);
            UTIL.scribble.scribbleEllipse( 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30), 
                this.width * this.orientationScale + 10* sin(frameCount)-3, 
                this.height * this.orientationScale + 10* cos(frameCount) - 3 );
            ellipse(
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30), 
                this.width * this.orientationScale + 10* sin(frameCount) - 3, 
                this.height * this.orientationScale + 10* cos(frameCount) - 3 
                );
            pop();
            this.div.position(
                this.x + this.shiftXMap + width/2 + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + height/2 + DOM_EL.canvas.position().y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
                );
            this.div.size(
                this.width * this.orientationScale, 
                this.height * this.orientationScale
                );
            this.div.style("font-size", width * this.scaleXYMap * this.orientationScale/30 + 'px');  

            if(APP_STATE.prevMode == 1 && UTIL.paletteBubbleContent !==null){ //changed from mode to prevMode
                image(
                    UTIL.paletteBubbleContent,
                    width/2 + this.randomSeed + sin(frameCount) * random(2,30) ,
                    height/2  + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30),
                    UTIL.paletteBubbleContent.width,
                    UTIL.paletteBubbleContent.height,
                    );
            }
            else if(APP_STATE.mode == 2){
                this.textDiv.html(this.contentsHTML);
            }
            
            if(this.y + this.height/2 + (((frameCount - this.frameCount) * this.height * this.orientationScale * -1 - this.y)/30) < this.height * this.orientationScale * -1.5 - this.y ){
                this.bubbleOut = false;            
                DOM_EL.bubbleoutContainer.hide();
                if(APP_STATE.prevMode == 0){
                    if(APP_STATE.pitUser!==null){
                        UTIL.socket.emit("bubble_image",{
                            "room" : APP_STATE.room, 
                            "question" : APP_STATE.question, 
                            "name": APP_STATE.nickname, 
                            "message" : UTIL.cameraBubbleContent, 
                            "color": {R:this.color.R,G:this.color.G,B:this.color.B},
                            "user" : APP_STATE.pitUser
                        });
                    }else{
                        UTIL.socket.emit("bubble_image",{"room" : APP_STATE.room, question : APP_STATE.question, name: APP_STATE.nickname, message : UTIL.cameraBubbleContent, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
                    }
                    DOM_EL.capture.play();
                }
                else if(APP_STATE.prevMode == 1){
                    if(APP_STATE.pitUser!==null){
                        UTIL.socket.emit("bubble_image",{
                            "room" : APP_STATE.room, 
                            "question" : APP_STATE.question, 
                            "name": APP_STATE.nickname, 
                            "message" : UTIL.paletteBubbleContent.canvas.toDataURL(), 
                            "color": {R:this.color.R,G:this.color.G,B:this.color.B},
                            "user" : APP_STATE.pitUser
                        });
                    }else{
                        UTIL.socket.emit("bubble_image",{"room" : APP_STATE.room, question : APP_STATE.question, name: APP_STATE.nickname, message : UTIL.paletteBubbleContent.canvas.toDataURL(), color: {R:this.color.R,G:this.color.G,B:this.color.B}});
                    }
                    UTIL.paletteBubbleContent = null;
                }
                else if(APP_STATE.prevMode == 2){
                    if(APP_STATE.pitUser!==null){
                        UTIL.socket.emit("bubble_message",{
                            "room" : APP_STATE.room, 
                            "question" : APP_STATE.question, 
                            "name": APP_STATE.nickname, 
                            "message" : UTIL.speechBubbleContent, 
                            "color": {R:this.color.R,G:this.color.G,B:this.color.B},
                            "user" : APP_STATE.pitUser
                        });
                    }else{
                        UTIL.socket.emit("bubble_message",{"room" : APP_STATE.room, question : APP_STATE.question, name: APP_STATE.nickname, message : UTIL.speechBubbleContent, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
                    }
                }
                resetBubbleContent();
                this.contents = "";
                this.contentsHTML = "";
            }
        }
    }

    drawScribble(){
        push();
        fill(255);
        noStroke();
        ellipse(
            this.x + width/2, 
            this.y + height/2, //+ DOM_EL.canvas.position().y,
            this.width * this.orientationScale, 
            this.height * this.orientationScale
            );
        noFill();
        strokeWeight(3);
        Object.keys(shapesBubble).forEach((key)=>{
            beginShape();
            stroke(shapesBubble[key].color);
            for(var i in shapesBubble[key].payload){
                var one_point = shapesBubble[key].payload[i];
                curveVertex(one_point.x + width/2, one_point.y + height/2);
            }
            endShape();
        });
            beginShape();
            stroke(APP_STATE.currentColor);
            for(var i in pointBuffer){
                var one_point = pointBuffer[i];
                curveVertex(one_point.x + width/2, one_point.y + height/2);
            }
            endShape();
            pop();
    }


    changeContents(contents){
        this.contents = contents;
        this.contentsHTML = contents.replace("\n","<br>");
    }
    changeDimensions(width,height){
        this.width = width;
        this.height = height;
    }
    drawHandle(){
        strokeWeight(1);
        let arr = [ 
                    this.x + this.shiftXMap - this.width * this.scaleX * this.scaleXYMap * this.orientationScale/18, 
                    this.x + this.shiftXMap + this.width * this.scaleX * this.scaleXYMap * this.orientationScale/18, 
                    this.x + this.shiftXMap + this.width * this.scaleX * this.scaleXYMap * this.orientationScale/18, 
                    this.x + this.shiftXMap - this.width * this.scaleX * this.scaleXYMap * this.orientationScale/18 
                ];
        let arr2 = [ 
                    this.y + this.height * this.scaleXYMap * this.orientationScale/2, 
                    this.y + this.height * this.scaleXYMap * this.orientationScale/2, 
                    this.y + this.height * 3 * this.scaleXYMap * this.orientationScale/2, 
                    this.y + this.height * 3 * this.scaleXYMap * this.orientationScale/2 
                ];
        stroke(0);
        UTIL.scribble.scribbleFilling( arr, arr2, 2, 45 );
        UTIL.scribble.scribbleRoundedRect( 
            this.x + this.shiftXMap, 
            this.y + this.height * this.scaleXYMap * this.orientationScale, 
            this.width * this.scaleX * this.scaleXYMap * this.orientationScale/9, 
            this.height * this.scaleXYMap * this.orientationScale, 
            this.width * this.scaleX * this.scaleXYMap * this.orientationScale/24 );
    }
    renderTimer(){
        fill(0);
        noStroke();
        text(
            (20 - round((millis()-UTIL.timer)/1000)) + "s", 
            this.x + this.shiftXMap, 
            -this.height * this.scaleXYMap * this.orientationScale/2 - 30
            );
            fill(255,0,0,20);
    }

}


function editContentEvent(){
    CNV_EL.bubble.instructionDiv.addClass("hidden");
    if(APP_STATE.recording){
        stopAudioRecording();
    }
    CNV_EL.bubble.textDiv.hide();
    toggleSpeechIframe();
}

function resetBubbleContent(){
    UTIL.speechBubbleContent = "";
    UTIL.cameraBubbleContent = null;
    UTIL.paletteBubbleContent = null;
    if(APP_STATE.mode == 0){
        DOM_EL.activityCameraContainer.removeClass("hide");
    }
    else if(APP_STATE.mode == 1){
        DOM_EL.activityPaletteContainer.removeClass("hide");
        shapesBubble = {};
        pointBuffer = [];
    }
    else if(APP_STATE.mode == 2){
        DOM_EL.activitySpeechContainer.removeClass("hide");
    }
    retractButtons();    
}
// function toggleFullscreen() {
//     if (!document.fullscreenElement) {
//         document.documentElement.requestFullscreen();
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   }

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

function windowResized(){
    setTimeout(() => {
        let circleDia;

        if(APP_STATE.mode == 0){
            circleDia = camera.canvas.getBBox().h;   
        }else if(APP_STATE.mode == 1){
            circleDia = palette.canvas.getBBox().h;
        }else if(APP_STATE.mode == 2){
            circleDia = speech.canvas.getBBox().h;
        }

        let circleSquareDim = sqrt(Math.pow(circleDia,2) / 2);

        
        let w = window.innerWidth;
        let h = window.innerHeight - convertRemToPixels(8);
        CNV_EL.bubble.offsetX = w/2 - width/2;
        CNV_EL.bubble.offsetY = h/2 - height/2;
        resizeCanvas(w,h);
        

        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
    
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
        document.documentElement.style.setProperty('--textbox', `${circleSquareDim}px`);
    
        if(vh > vw){
        APP_STATE.vmin = vw;
        APP_STATE.portrait = true;
        document.documentElement.style.setProperty('--vmin', `${vw}px`);
        if(APP_STATE.DOMRegistered){
            CNV_EL.bubble.orientationScale = 0.7;
            CNV_EL.bubble.changeDimensions(75*APP_STATE.vmin, 75*APP_STATE.vmin);
            CNV_EL.bubble.rightButton.addClass("portrait");
            CNV_EL.bubble.leftButton.addClass("portrait");
        }
        }
        else{
        APP_STATE.vmin = vh;
        APP_STATE.portrait = false;
        document.documentElement.style.setProperty('--vmin', `${vh}px`);
        if(APP_STATE.DOMRegistered){
            CNV_EL.bubble.orientationScale = 0.7;
            CNV_EL.bubble.changeDimensions(75*APP_STATE.vmin, 75*APP_STATE.vmin);
            CNV_EL.bubble.rightButton.removeClass("portrait");
            CNV_EL.bubble.leftButton.removeClass("portrait");
        }
        }
    },600);
}

function togglePauseScreen(){
    if(APP_STATE.pause){
        DOM_EL.pauseContainer.style("display","flex");
    }else{
        DOM_EL.pauseContainer.style("display","none");
    }
}

function startCon(){

  UTIL.socket = io('cotf.cf', {});
  UTIL.audioSocket = io("cotf.cf",{path: '/node/socket.io'});

  UTIL.socket.on('connect', function() 
  {
        if(APP_STATE.room !== null){
            UTIL.socket.emit('bubble_login',{"room":APP_STATE.room, "name":APP_STATE.nickname});
        }
		console.log("connected");		 
  });
  UTIL.socket.on('bubblepit-feedback-event', function(msg) 
  {
        APP_STATE.pitUser = msg.user;
        if(APP_STATE.room == msg.room && !APP_STATE.feedbackSubmitted){
            DOM_EL.feedbackContainer.removeClass("hide");
        }
  });
  UTIL.socket.on('bubblepit-question-event', function(msg) 
  {
        APP_STATE.readyToSubmit = false;
        // console.log(msg);	
        if(msg.user){
            APP_STATE.pitUser = msg.user;
        }
        if(msg.room == APP_STATE.room){
            APP_STATE.finishLobby = true;
            DOM_EL.activityTitle.html(msg.value);
            APP_STATE.question = msg.value;
            DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.remove("active");
            if(msg.type == "📸"){
                APP_STATE.mode = 0;
                DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");      
            }
            else if(msg.type == "🎨"){
                APP_STATE.mode = 1;
                DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");      
            }
            else if(msg.type == "💬"){
                APP_STATE.mode = 2;
                DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");      
            }
            else if(msg.type == "🔠"){
                APP_STATE.mode = 3;
                DOM_EL.activitySlider.elt.children[APP_STATE.mode].classList.add("active");      
            }
            moveSlider();
            showRelevantSVG();
            // APP_STATE.lockMode = true;
        }
  });
  UTIL.socket.on('bubblepit-login-event', function(msg) 
  {
    if(msg.user){
        APP_STATE.pitUser = msg.user;
    }
    UTIL.socket.emit("bubble_login",{"room":APP_STATE.room, "name":APP_STATE.nickname});
  });
  UTIL.socket.on('bubblepit-all-play-event', function(msg) 
  {
    if(msg.user){
        APP_STATE.pitUser = msg.user;
    }
    console.log("received command to resume");
    APP_STATE.pause = false;
    togglePauseScreen();
  });
  UTIL.socket.on('bubblepit-all-pause-event', function(msg) 
  {
    if(msg.user){
        APP_STATE.pitUser = msg.user;
    }
    console.log("received command to pause");
    APP_STATE.pause = true;
    togglePauseScreen();
  });


  //================= SOCKET IO =================
UTIL.audioSocket.on('connect', function (data) {
    console.log('connected to socket');
    UTIL.audioSocket.emit('join', 'Server Connected to Client');
  });
  
  UTIL.audioSocket.on('messages', function (data) {
    console.log(data);
  });
  
  UTIL.audioSocket.on('speechData', function (data) {

    var dataFinal = undefined || data.results[0].isFinal;
    console.log(dataFinal);
  
    if (dataFinal === false) {
      // console.log(resultText.lastElementChild);
      if (removeLastSentence) {
        // resultText.lastElementChild.remove();
        if(CNV_EL.bubble.textDiv.elt.childElementCount > 0){
            CNV_EL.bubble.textDiv.elt.lastElementChild.remove();
        }
      }
      removeLastSentence = true;
  
      //add empty span
      let empty = document.createElement('span');
      CNV_EL.bubble.textDiv.elt.appendChild(empty);
  
      //add children to empty span
      let edit = addTimeSettingsInterim(data);
  
    //   for (var i = 0; i < edit.length; i++) {
    //     CNV_EL.bubble.textDiv.elt.lastElementChild.appendChild(edit[i]);
    //     CNV_EL.bubble.textDiv.elt.lastElementChild.appendChild(
    //       document.createTextNode('\u00A0')
    //     );
    //   }
    } else if (dataFinal === true) {

    //     if(CNV_EL.bubble.textDiv.elt.childElementCount > 0){
    //         CNV_EL.bubble.textDiv.elt.lastElementChild.remove();
    //     }
        
    //   //add empty span
    //   let empty = document.createElement('span');
    //   CNV_EL.bubble.textDiv.elt.appendChild(empty);
  
      //add children to empty span
      let edit = addTimeSettingsFinal(data);
    //   for (var i = 0; i < edit.length; i++) {
    //     if (i === 0) {
    //       edit[i].innerText = capitalize(edit[i].innerText);
    //     }
    //     CNV_EL.bubble.textDiv.elt.lastElementChild.appendChild(edit[i]);
  
    //     if (i !== edit.length - 1) {
    //         CNV_EL.bubble.textDiv.elt.lastElementChild.appendChild(
    //         document.createTextNode('\u00A0')
    //       );
    //     }
    //   }
    //   CNV_EL.bubble.textDiv.elt.lastElementChild.appendChild(
    //     document.createTextNode('\u002E\u00A0')
    //   );
  
      console.log("Google Speech sent 'final' Sentence.");
    //   finalWord = true;
    //   endButton.disabled = false;
  
      removeLastSentence = false;
    }
  });
}

//================= Juggling Spans for nlp Coloring =================
function addTimeSettingsInterim(speechData) {
    let wholeString = speechData.results[0].alternatives[0].transcript;
    console.log(wholeString);
    // capitalize(wholeString);

    CNV_EL.bubble.changeContents(UTIL.speechBubbleContent + " " + wholeString);
  
    // let nlpObject = nlp(wholeString).out('terms');
  
    // let words_without_time = [];
  
    // for (let i = 0; i < nlpObject.length; i++) {
    //   //data
    //   let word = nlpObject[i].text;
    //   let tags = [];
  
    //   //generate span
    //   let newSpan = document.createElement('span');
    //   newSpan.innerHTML = word;
  
    //   //push all tags
    //   for (let j = 0; j < nlpObject[i].tags.length; j++) {
    //     tags.push(nlpObject[i].tags[j]);
    //   }
  
    //   //add all classes
    //   for (let j = 0; j < nlpObject[i].tags.length; j++) {
    //     let cleanClassName = tags[j];
    //     // console.log(tags);
    //     let className = `nl-${cleanClassName}`;
    //     newSpan.classList.add(className);
    //   }
  
    //   words_without_time.push(newSpan);
    // }
  
    // finalWord = false;
    // endButton.disabled = true;
  
    // return words_without_time;
  }
  
  function addTimeSettingsFinal(speechData) {
    let wholeString = speechData.results[0].alternatives[0].transcript;
    // wholeString[0] = capitalize(wholeString[0]);
    
    console.log(wholeString);

    UTIL.prevSpeechBubbleContent = UTIL.speechBubbleContent;

    UTIL.speechBubbleContent = UTIL.speechBubbleContent + capitalize(wholeString) + " " ;
    CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
    showButtons();

  
    // let nlpObject = nlp(wholeString).out('terms');
    // let words = speechData.results[0].alternatives[0].words;
    // let words_n_time = [];
  
    // for (let i = 0; i < words.length; i++) {
    //   //data
    //   let word = words[i].word;
    //   let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
    //   let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
    //   let tags = [];
  
    //   //generate span
    //   let newSpan = document.createElement('span');
    //   newSpan.innerHTML = word;
    //   newSpan.dataset.startTime = startTime;
  
    //   //push all tags
    //   for (let j = 0; j < nlpObject[i].tags.length; j++) {
    //     tags.push(nlpObject[i].tags[j]);
    //   }
  
    //   //add all classes
    //   for (let j = 0; j < nlpObject[i].tags.length; j++) {
    //     let cleanClassName = nlpObject[i].tags[j];
    //     // console.log(tags);
    //     let className = `nl-${cleanClassName}`;
    //     newSpan.classList.add(className);
    //   }
  
    //   words_n_time.push(newSpan);
    // }
  
    // return words_n_time;
  }

  
function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

var IFRAME = {
    loginframe: null,
    loginframeLoaded: false,
    speechFrame: null,
    speechFrameLoaded: false,
}


function resetLoginIframe() {
    // Remove the old frame
    let loginBox = document.getElementById("login-form-container");

    if(IFRAME.loginframeLoaded){
        IFRAME.loginframe.contentDocument.activeElement.blur();
        loginBox.removeChild(IFRAME.loginframe);
    }
  
    // Create a new frame that has an input internally
    IFRAME.loginframe = document.createElement('iframe');
    IFRAME.loginframe.classList.add("login-iframe");
    IFRAME.loginframe.setAttribute("name","frame");
    IFRAME.loginframe.src = '/loginnameframe.html';
    loginBox.appendChild(IFRAME.loginframe);
    IFRAME.loginframeLoaded = true;
  
    IFRAME.loginframe.addEventListener('load', () => {  
      const nicknameInput = IFRAME.loginframe.contentDocument.body.querySelectorAll("input")[0];
      const passwordInput = IFRAME.loginframe.contentDocument.body.querySelectorAll("input")[1];

      if(URL_PARAMS.room !== null){
        passwordInput.value = URL_PARAMS.room;
        DOM_EL.loginPinInput.value(URL_PARAMS.room);
      }
  
      nicknameInput.addEventListener('input', e => {
        DOM_EL.loginNicknameInput.value( e.target.value);
      });

      passwordInput.addEventListener('input', e => {
        DOM_EL.loginPinInput.value(e.target.value);
      });
    });
  }



function toggleSpeechIframe() {
    let speechBox = document.getElementById("bubble-container");

    if(IFRAME.speechFrameLoaded){
        console.log("hide iframe");
        const textbox = IFRAME.speechFrame.contentDocument.body.querySelector("textarea");
        speech.keyboard.animate({transform:'s1.0'},100);
        UTIL.prevSpeechBubbleContent = UTIL.speechBubbleContent;
        CNV_EL.bubble.changeContents(textbox.value);
        UTIL.speechBubbleContent = textbox.value;
        if(UTIL.speechBubbleContent.length > 0){
            showButtons();
        }
        CNV_EL.bubble.textDiv.style("display","flex");
        IFRAME.loginframe.contentDocument.activeElement.blur();
        speechBox.removeChild(IFRAME.speechFrame);
        IFRAME.speechFrameLoaded = false;
        speech.keyboard.animate({transform:'s1.5',transform: 't0,-5'},100);


        DOM_EL.activityCameraContainer.parent(DOM_EL.activityContainer);
        DOM_EL.activityPaletteContainer.parent(DOM_EL.activityContainer);
        DOM_EL.activitySpeechContainer.parent(DOM_EL.activityContainer);
        CNV_EL.bubble.rightButton.parent(DOM_EL.activityContainer);
        CNV_EL.bubble.leftButton.parent(DOM_EL.activityContainer);
        DOM_EL.activitySliderContainer.parent(DOM_EL.activityContainer);
    }
    else{
        console.log("show iframe");
        DOM_EL.activityContentContainer.parent(DOM_EL.activityContainer);
        DOM_EL.activitySliderContainer.parent(DOM_EL.activityContainer);
        IFRAME.speechFrame = document.createElement('iframe');
        IFRAME.speechFrame.classList.add("bubble-contents");
        IFRAME.speechFrame.classList.add("speech-iframe");
        IFRAME.speechFrame.src = '/speechiframe.html';
        speechBox.appendChild(IFRAME.speechFrame);
        IFRAME.speechFrameLoaded = true;
      
        IFRAME.speechFrame.addEventListener('load', () => {  
          const textbox = IFRAME.speechFrame.contentDocument.body.querySelector("textarea");
          textbox.value = CNV_EL.bubble.textDiv.html().replace("<br>","\n");
          setTimeout(()=>{textbox.focus();},50);
        // textbox.focus();

      
          textbox.addEventListener('input', e => {
              console.log(textbox.value);
          });

          textbox.addEventListener('click', e => {
            console.log("speech frame clicked");
        });
    
          textbox.addEventListener('blur', e => {
            console.log("hide speech iframe now");
            toggleSpeechIframe();
            });
        });
    }
  
  }
