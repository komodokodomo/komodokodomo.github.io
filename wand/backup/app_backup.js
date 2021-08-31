
let recorder = null,recognition = null,meter,audioLevel;

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var link = document.createElement('a');

	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;
    link.click();

}

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
    const processor = audioContext.createScriptProcessor(512)
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;
  
    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);
  
    processor.checkClipping = function () {
      if (!this.clipping) {
        return false;
      }
      if ((this.lastClip + this.clipLag) < window.performance.now()) {
        this.clipping = false;
      }
      return this.clipping
    }
  
    processor.shutdown = function () {
      this.disconnect();
      this.onaudioprocess = null;
    }
  
    return processor;
  }
  
  function volumeAudioProcess(event) {
    const buf = event.inputBuffer.getChannelData(0);
    const bufLength = buf.length;
    let sum = 0;
    let x;
  
    // Do a root-mean-square on the samples: sum up the squares...
    for (var i = 0; i < bufLength; i++) {
      x = buf[i];
      if (Math.abs(x) >= this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }
  
    // ... then take the square root of the sum.
    const rms = Math.sqrt(sum / bufLength);
  
    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume * this.averaging);
    audioLevel = this.volume;;
  }


  var keyCodes = [
    {code: 192, identifier: "U+0060", value: "`"},
    {code: 220, identifier: "U+007C", value: "|"},
    {code: 219, identifier: "U+007B", value: "{"},
    {code: 221, identifier: "U+007D", value: "}"},
    {code: 191, identifier: "U+003F", value: "?"},
    {code: 53, identifier: "U+0025", value: "%"},
    {code: 54, identifier: "U+005E", value: "^"},
    {code: 56, identifier: "U+002A", value: "*"},
    {code: 191, identifier: "U+002F", value: "/"},
    {code: 222, identifier: "U+0027", value: "'"},
    {code: 52, identifier: "U+0024", value: "$"},
    {code: 49, identifier: "U+0021", value: "!"},
    {code: 192, identifier: "U+007E", value: "~"},
    {code: 55, identifier: "U+0026", value: "&"},
    {code: 187, identifier: "U+003D", value: "="},
    {code: 51, identifier: "U+0023", value: "#"},
    {code: 219, identifier: "U+005B", value: "["},
    {code: 221, identifier: "U+005D", value: "]"},
    {code: 190, identifier: "U+002E", value: "."},
    {code: 189, identifier: "U+005F", value: "_"},
    {code: 186, identifier: "U+003A", value: ":"},
    {code: 186, identifier: "U+003B", value: ";"},
    {code: 57, identifier: "U+0028", value: "("},
    {code: 48, identifier: "U+0029", value: ")"},
    {code: 188, identifier: "U+002C", value: ","},
    {code: 220, identifier: "U+005C", value: "\\"},
    {code: 188, identifier: "U+003C", value: ">"},
    {code: 190, identifier: "U+003E", value: "<"},
    {code: 0, identifier: "U+20AC", value: "€"},
    {code: 0, identifier: "U+00A3", value: "£"},
    {code: 0, identifier: "U+00A5", value: "¥"},
    {code: 0, identifier: "U+2022", value: "•"},
    {code: 189, identifier: "U+002D", value: "-"},
    {code: 187, identifier: "U+002B", value: "+"},
    {code: 222, identifier: "U+0022", value: '"'},
    {code: 8, identifier: "U+0008", value: "backspace"},
    {code: 32, identifier: "U+0020", value: " "},
    {code: 16, identifier: "Shift", value: ""}, //this is not an iphone identifier
    {code: 50, identifier: "U+0040", value: "@"},
    {code: 13, identifier: "Enter", value: ""},
    {code: 49, identifier: "U+0031", value: "1"},
    {code: 50, identifier: "U+0032", value: "2"},
    {code: 51, identifier: "U+0033", value: "3"},
    {code: 52, identifier: "U+0034", value: "4"},
    {code: 53, identifier: "U+0035", value: "5"},
    {code: 54, identifier: "U+0036", value: "6"},
    {code: 55, identifier: "U+0037", value: "7"},
    {code: 56, identifier: "U+0038", value: "8"},
    {code: 57, identifier: "U+0039", value: "9"},
    {code: 48, identifier: "U+0030", value: "0"},
    {code: 81, identifier: "U+0051", value: "q"},
    {code: 87, identifier: "U+0057", value: "w"},
    {code: 69, identifier: "U+0045", value: "e"},
    {code: 82, identifier: "U+0052", value: "r"},
    {code: 84, identifier: "U+0054", value: "t"},
    {code: 89, identifier: "U+0059", value: "y"},
    {code: 85, identifier: "U+0055", value: "u"},
    {code: 73, identifier: "U+0049", value: "i"},
    {code: 79, identifier: "U+004F", value: "o"},
    {code: 80, identifier: "U+0050", value: "p"},
    {code: 65, identifier: "U+0041", value: "a"},
    {code: 83, identifier: "U+0053", value: "s"},
    {code: 68, identifier: "U+0044", value: "d"},
    {code: 70, identifier: "U+0046", value: "f"},
    {code: 71, identifier: "U+0047", value: "g"},
    {code: 72, identifier: "U+0048", value: "h"},
    {code: 74, identifier: "U+004A", value: "j"},
    {code: 75, identifier: "U+004B", value: "k"},
    {code: 76, identifier: "U+004C", value: "l"},
    {code: 90, identifier: "U+005A", value: "z"},
    {code: 88, identifier: "U+0058", value: "x"},
    {code: 67, identifier: "U+0043", value: "c"},
    {code: 86, identifier: "U+0056", value: "v"},
    {code: 66, identifier: "U+0042", value: "b"},
    {code: 78, identifier: "U+004E", value: "n"},
    {code: 77, identifier: "U+004D", value: "m"},
    //UNICODE
    {code: 0, identifier: "U+00E8", value: "è"},
    {code: 0, identifier: "U+00E9", value: "é"},
    {code: 0, identifier: "U+00EA", value: "ê"},
    {code: 0, identifier: "U+00EB", value: "ë"},
    {code: 0, identifier: "U+0113", value: "ē"},
    {code: 0, identifier: "U+0117", value: "ė"},
    {code: 0, identifier: "U+0119", value: "ę"},
    {code: 0, identifier: "U+00FF", value: "ÿ"},
    {code: 0, identifier: "U+00FB", value: "û"},
    {code: 0, identifier: "U+00FC", value: "ü"},
    {code: 0, identifier: "U+00F9", value: "ù"},
    {code: 0, identifier: "U+00FA", value: "ú"},
    {code: 0, identifier: "U+016B", value: "ū"},
    {code: 0, identifier: "U+00EE", value: "î"},
    {code: 0, identifier: "U+00EF", value: "ï"},
    {code: 0, identifier: "U+00ED", value: "í"},
    {code: 0, identifier: "U+012B", value: "ī"},
    {code: 0, identifier: "U+012F", value: "į"},
    {code: 0, identifier: "U+00EC", value: "ì"},
    {code: 0, identifier: "U+00F4", value: "ô"},
    {code: 0, identifier: "U+00F0", value: "ð"},
    {code: 0, identifier: "U+00F1", value: "ñ"},
    {code: 0, identifier: "U+00F2", value: "ò"},
    {code: 0, identifier: "U+00B5", value: "µ"}

];

function getKeyCodeValue(code, identifier){
    var val = false;
    for(var i in keyCodes){
        if(keyCodes[i].code == code && keyCodes[i].identifier == identifier){
            val = keyCodes[i].value
        }
    }
    return val;
}



var keydownHelper = function (e) {
    var val;
    e.preventDefault();
    if(!APP_STATE.logined){
        DOM_EL.loginNicknameInput.elt.removeEventListener("input", inputHelper); 
        val = DOM_EL.loginNicknameInput.elt.value;
    }
    else{
        CNV_EL.bubble.inputDiv.elt.removeEventListener("input", inputHelper); 
        val = CNV_EL.bubble.inputDiv.elt.value;
    }

    var keyCode = getKeyCodeValue(e.keyCode, e.keyIdentifier);
    
    if (e.keyCode === 8 && val.length) {
        if(!APP_STATE.logined){
            DOM_EL.loginNicknameInput.elt.value = val.slice(0, val.length - 1);
        }
        else{
            CNV_EL.bubble.inputDiv.elt.value = val.slice(0, val.length - 1);
        }
        return;
      }
    // alert(keyCode);
    if (!keyCode) {
        return;
    }
  

    val += keyCode;
    
    if(!APP_STATE.logined){
        DOM_EL.loginNicknameInput.elt.value = val;
    }
    else{
        CNV_EL.bubble.inputDiv.elt.value = val;
    }
    // alert(val);
  };

  var inputHelper = function (e) {
    e.preventDefault();
    window.removeEventListener("keydown", keydownHelper);
  };
  

  window.addEventListener("keydown", keydownHelper); 

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

    activityContainer: null,
        activityTitleContainer: null,
            activityTitle: null,
            activityInstructions: null,
        activityContentContainer: null,
        activityContent: null,

    canvas: null,
    speechBubbleContainer: null,
    speechBubble: null,

    pauseContainer: null,

}

var CNV_EL = {
    bubble: null,
}

var UTIL = {
    speechRec : null,
    speechRecBuffer: "",
    speechBubbleContent: "",
    scribble: null,
    socket: null,
    thinking: ".",
    scribbleValue: 1,
    timer: 0,
    sttInterval: null,
    audioRecording: []
    // speechTimer: 0
}

var APP_STATE = {
    logined: false,
    width: null,
    height: null,
    nickname: "",
    speechRecorded: false,
    recording: false,
    inbuiltSTT: false,
}

var SOUNDS = {
    shutter: null,
    delete: null,
    pop: null,
  }

function preload() {
    soundFormats('mp3', 'ogg');
    // SOUNDS.shutter = loadSound('sound/shutter');
    // SOUNDS.delete = loadSound('sound/delete');
    SOUNDS.pop = loadSound('sound/pop');
  }

function handleMotion(event) {

    MOVEMENT.x = event.accelerationIncludingGravity.x;
    MOVEMENT.y = event.accelerationIncludingGravity.y;
    MOVEMENT.z = event.accelerationIncludingGravity.z;

    MOVEMENT.xx = event.acceleration.x;
    MOVEMENT.yy = event.acceleration.y;
    MOVEMENT.zz = event.acceleration.z;

    MOVEMENT.rotateZ = event.rotationRate.alpha;
    MOVEMENT.rotateY = event.rotationRate.gamma;
    MOVEMENT.rotateX = event.rotationRate.beta;

    if(MOVEMENT.zz < -10 &&  MOVEMENT.rotateX > 15){
        if(UTIL.speechBubbleContent.length > 0){
            triggerBubbleAnimation();
        }
    }
    // console.log(x +", " + y + ", " + z);
    // console.log(MOVEMENT.xx +", " + MOVEMENT.yy + ", " + MOVEMENT.zz);
    // console.log(MOVEMENT.rotateZ +", " + MOVEMENT.rotateY + ", " + MOVEMENT.rotateX);
}

function loginEvent(){
APP_STATE.logined = true;
    try{
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'en-SG';
        recognition.interimResults = true;

        
        recognition.onspeechstart = function() {
            console.log('Speech has been detected');
          }
        
          recognition.onspeechend = function(event) {
            APP_STATE.speechRecorded = false;
            console.log('Speech end has been detected');
          }
        
        recognition.onresult = function(event) {
            UTIL.speechRecBuffer = "";
        
            for(let i = 0; i <= event.resultIndex; i++){
                UTIL.speechRecBuffer += event.results[i][0].transcript;
                UTIL.speechRecBuffer += " ";
                if(event.results[i].isFinal){
                    APP_STATE.speechRecorded = true;
                    console.log("final transcript: " +  event.results[i][0].transcript);
                    UTIL.speechBubbleContent = UTIL.speechBubbleContent + event.results[i][0].transcript + "\n" ;
                    setTimeout(() => {
                        CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
                        // recognition.stop();
                        // recognition.start();
                    },0);
                    if(CNV_EL.bubble.instructionDiv.class().includes("hidden")){
                        CNV_EL.bubble.instructionDiv.removeClass("hidden");
                    }
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
            recognition.abort();
            setTimeout(() => {
                recognition.start();
            },5);
        }
        APP_STATE.inbuiltSTT = true;
        console.log("there is inbuilt STT");
    }
    catch(err){
        console.log("there is NO inbuilt STT");
        APP_STATE.inbuiltSTT = false;
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext; //new audio context to help us record
        

        
        navigator.mediaDevices.getUserMedia(
            {
                audio: {
                    // mandatory: {
                        autoGainControl: false,
                        channelCount: 1,
                        echoCancellation: false,
                        latency: 0,
                        noiseSuppression: false,
                        sampleRate: 48000,
                        volume: 1.0
                    // }
                }
            }).then(function(stream) {
        
                audioContext = new AudioContext();
                input = audioContext.createMediaStreamSource(stream);
                meter = createAudioMeter(audioContext);
                input.connect(meter);
            
                recorder = new WebAudioRecorder(input, {
                    workerDir: "javascripts/",     // must end with slash
                    numChannels: 1,
                });
            
                recorder.onComplete = function(recorder, blob) { 
                    console.log("recording complete, sending to server");
                    UTIL.socket.emit("bubble_audio",blob);
                    UTIL.audioRecording.push(blob);
                    // createDownloadLink(blob,"wav");
                }
            
                recorder.onError = function(recorder, message) { 
                    console.log(message);
                }
            
            });
    }
    
    if(DOM_EL.loginNicknameInput.value().length == 0){
        DOM_EL.loginNicknameInput.removeClass("no-error");
        setTimeout( () => DOM_EL.loginNicknameInput.addClass("no-error"), 300 );
    }
    else{
        APP_STATE.nickname = DOM_EL.loginNicknameInput.value();
        UTIL.socket.emit("bubble_login",{room:"2222", "name":APP_STATE.nickname});
        getAccel();
        DOM_EL.activityContainer.show();
        DOM_EL.loginContainer.hide();  
        CNV_EL.bubble.recordDiv.style("display","flex");
        CNV_EL.bubble.editDiv.style("display","flex");
        // CNV_EL.bubble.resetDiv.style("display","flex");
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
            DOM_EL.errorHeader.html("Error : ask for help from your teacher");
            DOM_EL.errorContent.html("cache needs to be cleared");
            DOM_EL.refreshButton.hide();
            DOM_EL.errorImage.elt.src = "image/error2.png";
            DOM_EL.errorContainer.style("display","flex");
        }
    });
    }
    catch(err) {
            console.log(err);
            window.addEventListener("devicemotion", handleMotion, true);
            DOM_EL.errorContainer.style("display","none");
            // DOM_EL.errorContainer.style("display","flex");
        }
}


function setup(){

    setInterval(()=>{
        UTIL.thinking+=".";
            if(UTIL.thinking == "...."){
                UTIL.thinking = "."
            }
        },1000);
    frameRate(10);
    startCon();

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    DOM_EL.canvas = createCanvas(APP_STATE.width,APP_STATE.height - titleHeight);
    // DOM_EL.canvas = select("#canvas-container");
    // DOM_EL.canvas.position(0,0);
    // DOM_EL.gesture = select("#gesture-identifier");

    // DOM_EL.speechBubbleContainer = select("#speech-bubble-container");
    // DOM_EL.speechBubble = select("#speech-bubble");

    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginTitleContainer = select("#login-title-container");
    DOM_EL.loginPinInput = select("#login-pin-input");
      DOM_EL.loginPinInput.addClass("no-error");
      DOM_EL.loginPinInput.hide();
    DOM_EL.loginNicknameInput = select("#login-nickname-input");
        DOM_EL.loginNicknameInput.addClass("no-error");
        DOM_EL.loginNicknameInput.elt.addEventListener("input", inputHelper);

    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(loginEvent);
    DOM_EL.activityContainer = select("#activity-container");
    // DOM_EL.activityContainer.elt.addEventListener("keydown", keydownHelper); 

        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityInstructions = select("#activity-instructions");
        DOM_EL.activityContentContainer = select("#activity-content-container");
            DOM_EL.activityContentContainer = select("#activity-content");
            DOM_EL.canvas.parent(DOM_EL.activityContainer);
    DOM_EL.activityContainer.hide();

    DOM_EL.errorContainer = select("#error-container");
    DOM_EL.errorContainer.hide();
    DOM_EL.errorContainer.position(0,0);

    DOM_EL.pauseContainer = select("#pause-container");
    DOM_EL.pauseContainer.hide();
    DOM_EL.pauseContainer.position(0,0);

    DOM_EL.errorImage = select("#error-image");
    DOM_EL.errorHeader = select("#error-header");
    DOM_EL.errorContent = select("#error-content");

    DOM_EL.refreshButton = select("#refresh-button");
    DOM_EL.refreshButton.mousePressed(refreshEvent);

    // UTIL.speechRec = new p5.SpeechRec('en-SG', gotSpeech);
    // UTIL.speechRec.continuous = false;
    // UTIL.speechRec.interimResults = true;
    // UTIL.speechRec.onResult = changeSpeechBubbleContent;
    // UTIL.speechRec.onEnd = speechEnd;
    // UTIL.speechRec.start();
  

    UTIL.scribble = new Scribble();
    CNV_EL.bubble = new ThoughtBubble(0, 0, width*0.7, width*0.7, "", {R:random(0,255),G:random(0,255),B:random(0,255)}, true) //💬<i>say your reply and your wand will capture it!</i>
    // UTIL.speechRec.start(continuous, interimResults);
    windowResized();
}

function refreshEvent(){
    if(!APP_STATE.cameraEnabled){
        window.location = window.location.href+'?eraseCache=true';
        location.reload(true);
    }
    else if(!APP_STATE.motionEnabled){
        DOM_EL.errorContainer.style("display","none");
        APP_STATE.optionChoice = true;
        getAccel();
    }
}

function gotSpeech() {
    console.log(UTIL.speechRec.resultString);
    // DOM_EL.speechBubble.html(UTIL.speechBubbleContent + " " + UTIL.speechRec.resultString);
}

function speechEnd(){
    console.log("speech ended");
    if(UTIL.speechRec.resultString){
        if(UTIL.speechRec.resultString.length > 0){
            UTIL.speechBubbleContent = UTIL.speechBubbleContent += UTIL.speechRec.resultString;
            UTIL.speechRec.resultString = "";
            UTIL.speechBubbleContent = UTIL.speechBubbleContent += "\n";
            CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
            // DOM_EL.speechBubble.html(UTIL.speechBubbleContent);
        }
    }
    // UTIL.speechRec.start();
}

function changeSpeechBubbleContent(){
    console.log(UTIL.speechRec.resultString);
    CNV_EL.bubble.changeContents(UTIL.speechBubbleContent + " " + UTIL.speechRec.resultString);
}

function draw(){
    background("#f5f5f5");
    if(recorder!== null){
        if(recorder.isRecording()){
            // CNV_EL.bubble.changeContents("recording" + UTIL.thinking);
            // stroke( 255, 0, 0 );
            let x = audioLevel * 10;
            if (x > 1.5){x = 1.5;}
            UTIL.scribbleValue = lerp(UTIL.scribbleValue,x,0.3);
            UTIL.scribble.bowing = UTIL.scribbleValue;           // changes the bowing of lines
            UTIL.scribble.roughness = UTIL.scribbleValue;        // changes the roughness of lines
            UTIL.scribble.maxOffset = UTIL.scribbleValue;        // coordinates will get an offset, here you define the max offset
            // UTIL.scribble.numEllipseSteps = 9; // defines how much curves will be used to draw an ellipse
            if(millis() - UTIL.timer < 10000){
            }
            else{
                recorder.finishRecording();
                // clearInterval(UTIL.sttInterval);
                CNV_EL.bubble.recordDiv.removeClass("active");
            }
        }
        else{
            // stroke( 255, 0, 0 );
            UTIL.scribbleValue = lerp(UTIL.scribbleValue,0.1,0.3);
            UTIL.scribble.bowing = UTIL.scribbleValue;           // changes the bowing of lines
            UTIL.scribble.roughness = UTIL.scribbleValue;        // changes the roughness of lines
            UTIL.scribble.maxOffset = UTIL.scribbleValue;        // coordinates will get an offset, here you define the max offset
            // UTIL.scribble.numEllipseSteps = 3; // defines how much curves will be used to draw an ellipse
        }
    }
    else{
        if(CNV_EL.bubble.recordDiv.class().includes("active")){
            UTIL.scribbleValue = lerp(UTIL.scribbleValue,1,0.3);
            UTIL.scribble.bowing = UTIL.scribbleValue;           // changes the bowing of lines
            UTIL.scribble.roughness = UTIL.scribbleValue;        // changes the roughness of lines
            UTIL.scribble.maxOffset = UTIL.scribbleValue;        // coordinates will get an offset, here you define the max offset
            if(millis() - UTIL.timer < 10000){
            }
            else{
                recognition.stop();
                CNV_EL.bubble.recordDiv.removeClass("active");
            }
        }
        else{
            UTIL.scribbleValue = lerp(UTIL.scribbleValue,0.1,0.3);
            UTIL.scribble.bowing = UTIL.scribbleValue;           // changes the bowing of lines
            UTIL.scribble.roughness = UTIL.scribbleValue;        // changes the roughness of lines
            UTIL.scribble.maxOffset = UTIL.scribbleValue;        // coordinates will get an offset, here you define the max offset
        }
    }
    CNV_EL.bubble.render();
}


function triggerBubbleAnimation(){
    if(!CNV_EL.bubble.bubbleOut){
        SOUNDS.pop.play();
        CNV_EL.bubble.bubbleOut = true;
        CNV_EL.bubble.frameCount = frameCount;
        CNV_EL.bubble.randomSeed = random(-10,10);
        UTIL.audioRecording = [];
    }
    CNV_EL.bubble.instructionDiv.addClass("hidden");
}

function init() {

	mm = new MobileMovement();
    
    mm.on("basketball shot", function(info) {
		console.log(info.movement); // Logs the monitored movement object defined by "basketball shot"
		console.log(info.actionKey); // Logs the string "basketball shot"
        console.log(info.event.alpha); // Logs the alpha component of the DeviceOrientation event triggering the callback
        if(UTIL.speechBubbleContent.length > 0){
            triggerBubbleAnimation();
        }
	});
}

window.addEventListener("load", init, false);
window.addEventListener("devicemotion", handleMotion, true);

function toggleRecord(){
    if(CNV_EL.bubble.recordDiv.class().includes("active")){
        CNV_EL.bubble.recordDiv.removeClass("active");
        if(APP_STATE.inbuiltSTT){
            // recognition.stop();
            setTimeout(() => {
                recognition.stop();
            },5);
            console.log("stop recognition");
        }
        else{
            recorder.finishRecording();
        }

    }else{
        CNV_EL.bubble.recordDiv.addClass("active");
        UTIL.timer = millis();
        if(APP_STATE.inbuiltSTT){
            // recognition.start();
            setTimeout(() => {
                recognition.start();
            },5);
            console.log("start recognition");
        }
        else{
            recorder.startRecording();
        }
    }
}
function startRecord(){
        CNV_EL.bubble.recordDiv.addClass("active");
        if(APP_STATE.inbuiltSTT){
            recognition.start();
        }
        else{
            recorder.startRecording();
        }
        APP_STATE.recording = true;
}

function stopRecord(){
        CNV_EL.bubble.recordDiv.removeClass("active");
        APP_STATE.recording = false;
        if(APP_STATE.inbuiltSTT){
            recognition.stop();
        }
        else{
            recorder.finishRecording();
        }
}

function editContentEvent(){
    // window.removeEventListener("keydown", keydownHelper);
    CNV_EL.bubble.instructionDiv.addClass("hidden");

    if(CNV_EL.bubble.recordDiv.class().includes("active")){
        CNV_EL.bubble.recordDiv.removeClass("active");
        recognition.stop();
    }
    CNV_EL.bubble.textDiv.hide();
    CNV_EL.bubble.inputDiv.style("display","flex");
    CNV_EL.bubble.inputDiv.value(CNV_EL.bubble.contents);   

    CNV_EL.bubble.recordDiv.hide();
    CNV_EL.bubble.editDiv.hide();
    CNV_EL.bubble.resetDiv.hide();

    setTimeout(()=>{
        CNV_EL.bubble.inputDiv.elt.focus();
    },5);
    console.log("editContentEvent fired");
}


function resetContentEvent(){
    if(CNV_EL.bubble.recordDiv.class().includes("active")){
        CNV_EL.bubble.recordDiv.removeClass("active");
        recognition.stop();
    }
    UTIL.speechBubbleContent = "";
    UTIL.speechRecBuffer = "";
    CNV_EL.bubble.changeContents("");
}

// function inputEvent(){
//     CNV_EL.bubble.inputDiv.value(this.value());
// }

class ThoughtBubble {
    constructor(posX, posY, width, height, contents, color, handle = false){
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.height = height;
        this.contents = contents;
        this.contentsHTML = contents.replace("\n","<br>");
        this.handle = handle;
        this.angle = 0;
        this.shiftX = 0;
        this.scaleX = 1.0;
        this.scaleXY = 1.0;
        this.bubbleOut = false;
        this.frameCount;
        this.randomSeed;
        this.color = color;

        this.div = createDiv();
        this.div.addClass("bubble");
        this.div.parent(DOM_EL.activityContainer);

        this.textDiv = createDiv(contents);
        this.textDiv.addClass("bubble-contents");
        this.textDiv.parent(this.div);

        this.inputDiv = createElement("textarea",contents);
        this.inputDiv.elt.addEventListener("input", inputHelper);

        // this.inputDiv.input(inputEvent);
        this.inputDiv.elt.onblur = function(){

            window.addEventListener("keydown", keydownHelper); 
            
            this.inputDiv.hide();
            CNV_EL.bubble.changeContents(this.inputDiv.value());
            UTIL.speechBubbleContent = this.inputDiv.value();
            this.inputDiv.value("");
            // if(this.inputDiv.value().length > 0){APP_STATE.speechRecorded = true;}
            this.textDiv.style("display","flex");
            CNV_EL.bubble.recordDiv.style("display","flex");
            CNV_EL.bubble.editDiv.style("display","flex");
            if(UTIL.speechBubbleContent.length>0 && CNV_EL.bubble.instructionDiv.class().includes("hidden")){
                CNV_EL.bubble.instructionDiv.removeClass("hidden");
            }


            // CNV_EL.bubble.resetDiv.style("display","flex");
        }.bind(this);
        this.inputDiv.addClass("bubble-contents");
        this.inputDiv.parent(this.div);
        this.inputDiv.hide();

        this.recordDiv = createDiv("🎙️");
        this.recordDiv.hide();
        this.recordDiv.id("record-div");
        this.recordDiv.addClass("side");
        // this.closeDiv.parent(this.div);
        this.recordDiv.mousePressed(toggleRecord);
        // this.recordDiv.touchStarted(startRecord);
        // this.recordDiv.touchEnded(stopRecord);

        this.editDiv = createDiv("✏️");
        this.editDiv.hide();
        this.editDiv.id("edit-div");
        this.editDiv.mousePressed(editContentEvent);

        this.resetDiv = createDiv("🔄");
        this.resetDiv.hide();
        this.resetDiv.id("reset-div");
        this.resetDiv.mousePressed(resetContentEvent);

        this.orientationScale = 1.0;

        this.instructionDiv = createDiv();
        this.instructionDiv.id("instruction-div")
        this.instructionDiv.addClass("hidden");
        
        this.instructionImage = createImg("image/wand_instruction.gif");
        this.instructionImage.id("instruction-image");
        this.instructionImage.parent(this.instructionDiv);
        
        this.instruction = createDiv("Wave your device to send your speech bubble to the board");
        this.instruction.id("instruction");
        this.instruction.parent(this.instructionDiv);


    }
    render(){
        let shiftXMap;
        let scaleXYMap;

        imageMode(CENTER);
        textAlign(CENTER,CENTER);
        textStyle(BOLD);
        rectMode(CENTER);
        translate(width / 2, height / 2);

        // this.angle = lerp(this.angle, 0, 0.3);
        // this.shiftX = lerp(this.shiftX, MOVEMENT.xx, 0.1);
        // this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
        // shiftXMap = this.shiftX * this.width/8;
        // scaleXYMap = 1 + this.scaleXY/8;
        // this.scaleX = 1- abs(shiftXMap/this.width);

        if(this.orientationScale == 1.0){
            this.shiftX = lerp(this.shiftX, MOVEMENT.xx, 0.1);
            this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
            shiftXMap = this.shiftX * this.width/8;
            scaleXYMap = 1 + this.scaleXY/8;
            this.scaleX = 1- abs(shiftXMap/this.width);
            textSize(APP_STATE.width/30);
        }
        else if(this.orientationScale == 0.7){
            this.shiftX = lerp(this.shiftX, MOVEMENT.yy, 0.1);
            this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
            shiftXMap = this.shiftX * this.width/8;
            scaleXYMap = 1 + this.scaleXY/8;
            this.scaleX = 1- abs(shiftXMap/this.width);
            textSize(APP_STATE.height/30);
        }


        rotate(this.angle / 3.0);
        if(this.handle){
            strokeWeight(1);
            let arr = [ 
                        this.x + shiftXMap - this.width * this.scaleX * scaleXYMap * this.orientationScale/18, 
                        this.x + shiftXMap + this.width * this.scaleX * scaleXYMap * this.orientationScale/18, 
                        this.x + shiftXMap + this.width * this.scaleX * scaleXYMap * this.orientationScale/18, 
                        this.x + shiftXMap - this.width * this.scaleX * scaleXYMap * this.orientationScale/18 
                    ];
            let arr2 = [ 
                        this.y + this.height * scaleXYMap * this.orientationScale/2, 
                        this.y + this.height * scaleXYMap * this.orientationScale/2, 
                        this.y + this.height * 3 * scaleXYMap * this.orientationScale/2, 
                        this.y + this.height * 3 * scaleXYMap * this.orientationScale/2 
                    ];
            stroke(0);
            UTIL.scribble.scribbleFilling( arr, arr2, 2, 45 );
            UTIL.scribble.scribbleRoundedRect( 
                this.x + shiftXMap, 
                this.y + this.height * scaleXYMap * this.orientationScale, 
                this.width * this.scaleX * scaleXYMap * this.orientationScale/9, 
                this.height * scaleXYMap * this.orientationScale, 
                this.width * this.scaleX * scaleXYMap * this.orientationScale/24 );
        }
        // strokeWeight();
        stroke(0);
        // if(recorder){
        if(CNV_EL.bubble.recordDiv.class().includes("active")){
            fill(0);
            noStroke();
            text(
                (10 - round((millis()-UTIL.timer)/1000)) + "s", 
                this.x + shiftXMap, 
                -this.height * scaleXYMap * this.orientationScale/2 - 30 //+ (this.height - this.height * scaleXYMap * this.orientationScale * sqrt(0.5))/2
                );
            // if(recorder.isRecording()){
                fill(255,0,0,20);
            // }
        }
        stroke(0);
        strokeWeight(1);
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale );
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale );
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale );
        if(!this.bubbleOut){
            fill(0);
            noStroke();
            text(
                APP_STATE.nickname + "'s bubble:", 
                this.x + shiftXMap, 
                -this.height * scaleXYMap * this.orientationScale/2 + (this.height - this.height * scaleXYMap * this.orientationScale * sqrt(0.5))/2
                );
            this.textDiv.html(this.contentsHTML);
            this.div.position(this.x + shiftXMap + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
            this.div.size(this.width * this.scaleX * scaleXYMap * this.orientationScale * sqrt(0.5), this.height * this.orientationScale * scaleXYMap * sqrt(0.5) - 40);
            this.div.style("font-size", width * scaleXYMap * this.orientationScale/30 + 'px');
        }
        else{
            stroke(0);
            UTIL.scribble.scribbleEllipse( 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30),
                this.width * this.orientationScale + 10* sin(frameCount), 
                this.height * this.orientationScale + 10* cos(frameCount) );
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
                this.height * this.orientationScale + 10* cos(frameCount) - 3 );
            fill(0);
            // text(this.contents, this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8);
            text(
                APP_STATE.nickname + "'s bubble:", 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                -this.height * scaleXYMap * this.orientationScale/2 + (this.height - this.height * scaleXYMap * this.orientationScale * sqrt(0.5))/2 + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
                );
            this.textDiv.html(this.contentsHTML);
            this.div.position(
                this.x + shiftXMap + width/2 + this.randomSeed + sin(frameCount) * random(2,30), 
                this.y + height/2 + DOM_EL.canvas.position().y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
                );
            this.div.size(
                this.width * this.scaleX * scaleXYMap * this.orientationScale * sqrt(0.5), 
                this.height  * scaleXYMap * this.orientationScale * sqrt(0.5) - 40
                );
            this.div.style("font-size", width * scaleXYMap * this.orientationScale/30 + 'px');  //(((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
            if(this.y + this.height/2 + (((frameCount - this.frameCount) * this.height * this.orientationScale * -1 - this.y)/30) < this.height * this.orientationScale * -1.5 - this.y ){
                this.bubbleOut = false;
                UTIL.socket.emit("bubble_message",{name: APP_STATE.nickname, message : UTIL.speechBubbleContent, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
                UTIL.speechBubbleContent = "";
                this.contents = "";
                this.contentsHTML = "";
            }
        }


    }
    changePos(x,y){
       this.x = x;
       this.y = y;
    }
    changeContents(contents){
        this.contents = contents;
        this.contentsHTML = contents.replace("\n","<br>");
    }
    changeDimensions(width,height){
        this.width = width;
        this.height = height;
    }
    tiltLeft(){
        this.angle = PI/3;
    }
    tiltRight(){
        this.angle = -PI/3;
    }
    shiftLeft(){
        this.shiftX = width * 0.1 * -1;
    }
    shiftRight(){
        this.shiftX = width * 0.1;
    }

}

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
    
    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    resizeCanvas(APP_STATE.width,APP_STATE.height - titleHeight);

    // CNV_EL.bubble.changeDimensions(width*0.7, width*0.7);

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      document.documentElement.style.setProperty('--vmin', `${vw}px`);
      CNV_EL.bubble.changeDimensions(width*0.7, width*0.7);
      CNV_EL.bubble.orientationScale = 1.0;
    //   DOM_EL.orientationContainer.style("display", "none");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh}px`);
      CNV_EL.bubble.orientationScale = 0.7;
      CNV_EL.bubble.changeDimensions(height, height);
    //   DOM_EL.orientationContainer.style("display", "flex");
    }
}

function startCon()
{
  UTIL.socket = io('fhss.ml', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('hello',{room : "2222"});
		console.log("connected");		 
  });
  UTIL.socket.on('someone-joined', function(msg) 
  {
		console.log(msg);	
	});
  UTIL.socket.on('someone-change', function(msg) 
  {
		console.log(msg);		 		 
  });
  UTIL.socket.on('someone-left', function(msg) 
  {
		console.log(msg);	
  });
  UTIL.socket.on('bubble-question-event', function(msg) 
  {
        console.log(msg);	
        DOM_EL.activityTitle.html(msg.value);
  });
  UTIL.socket.on('bubblepit-login-event', function(msg) 
  {
        console.log(msg);	
        UTIL.socket.emit("bubble_login",{room:"2222", "name":APP_STATE.nickname});
        // DOM_EL.activityTitle.html(msg.value);
  });
  UTIL.socket.on('bubblepit-play-event', function(msg) 
  {
        console.log(msg);	
        DOM_EL.pauseContainer.style("display","none");
  });
  UTIL.socket.on('bubblepit-pause-event', function(msg) 
  {
        console.log(msg);
        DOM_EL.pauseContainer.style("display","flex");	
  });
  UTIL.socket.on('bubble-stt-event', function(msg) 
  {
        console.log(msg);
        UTIL.speechBubbleContent = UTIL.speechBubbleContent + msg.results[0].alternatives[0].transcript + "\n" ;
        setTimeout(() => {
            CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
        },0);
        if(UTIL.speechBubbleContent.length>0 && CNV_EL.bubble.instructionDiv.class().includes("hidden")){
            CNV_EL.bubble.instructionDiv.removeClass("hidden");
        }
        // alert(msg.results[0].alternatives[0].transcript);
  });
}
