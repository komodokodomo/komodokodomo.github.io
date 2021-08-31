

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
}

var CNV_EL = {
    bubble: null,
}

var UTIL = {
    speechRec : null,
    speechRecBuffer: "",
    speechBubbleContent: "",
    scribble: null,
    socket: null
    // speechTimer: 0
}

var APP_STATE = {
    width: null,
    height: null,
    nickname: "",
    speechRecorded: false,
    room : 1234
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
// recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-SG';
recognition.interimResults = true;
// recognition.maxAlternatives = 1;

recognition.onspeechstart = function() {
    console.log('Speech has been detected');
  }

  recognition.onspeechend = function(event) {
    APP_STATE.speechRecorded = false;
    console.log('Speech end has been detected');
    // recognition.stop();
    // recognition.start();
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
                // setTimeout(()=>{            
                    if(CNV_EL.bubble.instructionDiv.class().includes("hidden")){
                    CNV_EL.bubble.instructionDiv.removeClass("hidden");
                }
            // },5);
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

// recognition.onspeechend = function(e) {
    // console.log(e);
    // if(UTIL.speechRec.resultString){
    //     if(UTIL.speechRec.resultString.length > 0){
    //         UTIL.speechBubbleContent = UTIL.speechBubbleContent += UTIL.speechRec.resultString;
    //         UTIL.speechRec.resultString = "";
    //         UTIL.speechBubbleContent = UTIL.speechBubbleContent += "\n";
    //         CNV_EL.bubble.changeContents(UTIL.speechBubbleContent);
    //         // DOM_EL.speechBubble.html(UTIL.speechBubbleContent);
    //     }
    // }
// }

recognition.onerror = function(event) {
    console.log('Error occurred in recognition: ' + event.error);
    console.log('attempting restart');
    recognition.abort();
    setTimeout(() => {
        recognition.start();
    },5);
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
    console.log(MOVEMENT.xx +", " + MOVEMENT.yy + ", " + MOVEMENT.zz);
    console.log(MOVEMENT.rotateZ +", " + MOVEMENT.rotateY + ", " + MOVEMENT.rotateX);
}

function loginEvent(){
    if(DOM_EL.loginNicknameInput.value().length == 0){
        DOM_EL.loginNicknameInput.removeClass("no-error");
        setTimeout( () => DOM_EL.loginNicknameInput.addClass("no-error"), 300 );
    }
    else{
        APP_STATE.nickname = DOM_EL.loginNicknameInput.value();
        DOM_EL.activityContainer.show();
        DOM_EL.loginContainer.hide();  
        CNV_EL.bubble.recordDiv.style("display","flex");
        CNV_EL.bubble.editDiv.style("display","flex");
        CNV_EL.bubble.resetDiv.style("display","flex");
    }
  }
  
  function showLoginError(){
    DOM_EL.loginPinInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginPinInput.addClass("no-error");
    },300);
  }



function setup(){
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
    DOM_EL.loginNicknameInput = select("#login-nickname-input");
        DOM_EL.loginNicknameInput.addClass("no-error");
    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(loginEvent);
    DOM_EL.activityContainer = select("#activity-container");
        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityInstructions = select("#activity-instructions");
        DOM_EL.activityContentContainer = select("#activity-content-container");
            DOM_EL.activityContentContainer = select("#activity-content");
            DOM_EL.canvas.parent(DOM_EL.activityContainer);
    DOM_EL.activityContainer.hide();

    // UTIL.speechRec = new p5.SpeechRec('en-SG', gotSpeech);
    // UTIL.speechRec.continuous = false;
    // UTIL.speechRec.interimResults = true;
    // UTIL.speechRec.onResult = changeSpeechBubbleContent;
    // UTIL.speechRec.onEnd = speechEnd;
    // UTIL.speechRec.start();
  

    UTIL.scribble = new Scribble();
    CNV_EL.bubble = new ThoughtBubble(0, 0, width*0.7, width*0.7, "💬<i>say your reply and your wand will capture it!</i>", {R:random(0,255),G:random(0,255),B:random(0,255)}, true)
    // UTIL.speechRec.start(continuous, interimResults);
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
    CNV_EL.bubble.render();
}


function triggerBubbleAnimation(){
    if(!CNV_EL.bubble.bubbleOut){
        CNV_EL.bubble.bubbleOut = true;
        CNV_EL.bubble.frameCount = frameCount;
        CNV_EL.bubble.randomSeed = random(-10,10);
    }
    CNV_EL.bubble.instructionDiv.addClass("hidden");
    
}

function init() {

	mm = new MobileMovement();
    
    // mm.on("dig", function(info) {
	// 	console.log(info.movement); // Logs the monitored movement object defined by "basketball shot"
	// 	console.log(info.actionKey); // Logs the string "basketball shot"
    //     console.log(info.event.alpha); // Logs the alpha component of the DeviceOrientation event triggering the callback
    // });
    
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
        recognition.stop();

    }else{
        CNV_EL.bubble.recordDiv.addClass("active");
        recognition.start();
    }
}
function startRecord(){
        CNV_EL.bubble.recordDiv.addClass("active");
        recognition.start();
}

function stopRecord(){
        CNV_EL.bubble.recordDiv.removeClass("active");
        recognition.stop();
}

function editContentEvent(){
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

        this.instructionDiv = createDiv();
        this.instructionDiv.id("instruction-div")
        this.instructionDiv.addClass("hidden");
        
        this.instructionImage = createImg("image/wand_instruction.gif");
        this.instructionImage.id("instruction-image");
        this.instructionImage.parent(this.instructionDiv);
        
        this.instruction = createDiv("Wave your device to send your speech bubble to the board");
        this.instruction.id("instruction");
        this.instruction.parent(this.instructionDiv);

        this.div = createDiv();
        this.div.addClass("bubble");
        this.div.parent(DOM_EL.activityContainer);

        this.textDiv = createDiv(contents);
        this.textDiv.addClass("bubble-contents");
        this.textDiv.parent(this.div);

        this.inputDiv = createElement("textarea",contents);
        // this.inputDiv.input(inputEvent);
        this.inputDiv.elt.onblur = function(){
            this.inputDiv.hide();
            CNV_EL.bubble.changeContents(this.inputDiv.value());
            UTIL.speechBubbleContent = this.inputDiv.value();
            // if(this.inputDiv.value().length > 0){APP_STATE.speechRecorded = true;}
            this.textDiv.style("display","flex");
            CNV_EL.bubble.recordDiv.style("display","flex");
            CNV_EL.bubble.editDiv.style("display","flex");
            CNV_EL.bubble.resetDiv.style("display","flex");
        }.bind(this);
        this.inputDiv.addClass("bubble-contents");
        this.inputDiv.parent(this.div);
        this.inputDiv.hide();

        this.recordDiv = createDiv("🎙️");
        this.recordDiv.hide();
        this.recordDiv.id("record-div");
        // this.closeDiv.parent(this.div);
        // this.recordDiv.mousePressed(toggleRecord);
        this.recordDiv.touchStarted(startRecord);
        this.recordDiv.touchEnded(stopRecord);

        this.editDiv = createDiv("✏️");
        this.editDiv.hide();
        this.editDiv.id("edit-div");
        this.editDiv.mousePressed(editContentEvent);

        this.resetDiv = createDiv("🔄");
        this.resetDiv.hide();
        this.resetDiv.id("reset-div");
        this.resetDiv.mousePressed(resetContentEvent);


    }
    render(){
        let shiftXMap;
        let scaleXYMap;

        imageMode(CENTER);
        textAlign(CENTER,CENTER);
        textSize(APP_STATE.width/30);
        textStyle(BOLD);
        rectMode(CENTER);
        translate(width / 2, height / 2);

        this.angle = lerp(this.angle, 0, 0.3);
        this.shiftX = lerp(this.shiftX, MOVEMENT.xx, 0.1);
        this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
        shiftXMap = this.shiftX * this.width/8;
        scaleXYMap = 1 + this.scaleXY/8;
        this.scaleX = 1- abs(shiftXMap/this.width);


        rotate(this.angle / 3.0);
        if(this.handle){
            strokeWeight(1);
            let arr = [ 
                        this.x + shiftXMap - this.width * this.scaleX * scaleXYMap/12, 
                        this.x + shiftXMap + this.width * this.scaleX * scaleXYMap/12, 
                        this.x + shiftXMap + this.width * this.scaleX * scaleXYMap/12, 
                        this.x + shiftXMap - this.width * this.scaleX * scaleXYMap/12 
                    ];
            let arr2 = [ 
                        this.y + this.height * scaleXYMap/2, 
                        this.y + this.height * scaleXYMap/2, 
                        this.y + this.height * 3 * scaleXYMap/2, 
                        this.y + this.height * 3 * scaleXYMap/2 
                    ];
            stroke(0);
            UTIL.scribble.scribbleFilling( arr, arr2, 2, 45 );
            UTIL.scribble.scribbleRoundedRect( this.x + shiftXMap, this.y + this.height * scaleXYMap, this.width * this.scaleX * scaleXYMap/6, this.height * scaleXYMap, this.width * this.scaleX * scaleXYMap/24 );
        }
        // strokeWeight();
        stroke(0);
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap, this.height * scaleXYMap );
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap, this.height * scaleXYMap );
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap, this.height * scaleXYMap );
        if(!this.bubbleOut){
            fill(0);
            noStroke();
            text(APP_STATE.nickname + "'s bubble:", this.x + shiftXMap, -this.height * scaleXYMap/2 + (this.height - this.height * scaleXYMap * sqrt(0.5))/2);
            this.textDiv.html(this.contentsHTML);
            this.div.position(this.x + shiftXMap + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
            this.div.size(this.width * this.scaleX * scaleXYMap * sqrt(0.5), this.height  * scaleXYMap * sqrt(0.5) - 40);
            this.div.style("font-size", width*scaleXYMap/30 + 'px');
        }
        else{
            stroke(0);
            UTIL.scribble.scribbleEllipse( this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8, this.width + 10* sin(frameCount), this.height + 10* cos(frameCount) );
            fill(this.color.R,this.color.G,this.color.B,10);
            stroke(this.color.R,this.color.G,this.color.B,10);
            UTIL.scribble.scribbleEllipse( this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8, this.width + 10* sin(frameCount)-3, this.height + 10* cos(frameCount) - 3 );
            ellipse(this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8, this.width + 10* sin(frameCount) - 3, this.height + 10* cos(frameCount) - 3 );
            fill(0);
            // text(this.contents, this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8);
            text(APP_STATE.nickname + "'s bubble:", this.x + this.randomSeed + sin(frameCount) * random(2,30), -this.height * scaleXYMap/2 + (this.height - this.height * scaleXYMap * sqrt(0.5))/2 - (frameCount - this.frameCount)*8);
            this.textDiv.html(this.contentsHTML);
            this.div.position(this.x + shiftXMap + width/2 + this.randomSeed + sin(frameCount) * random(2,30), this.y + height/2 + DOM_EL.canvas.position().y - (frameCount - this.frameCount)*8);
            this.div.size(this.width * this.scaleX * scaleXYMap * sqrt(0.5), this.height  * scaleXYMap * sqrt(0.5) - 40);
            this.div.style("font-size", width*scaleXYMap/30 + 'px');
            if(this.y + this.height/2 - (frameCount - this.frameCount)*5 < (this.height) * -1 - this.y ){
                this.bubbleOut = false;
                UTIL.socket.emit("bubble_message",{room: APP_STATE.room,name: APP_STATE.nickname, message : UTIL.speechBubbleContent, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
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

    CNV_EL.bubble.changeDimensions(width*0.7, width*0.7);

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      document.documentElement.style.setProperty('--vmin', `${vw*2}px`);
    //   DOM_EL.orientationContainer.style("display", "none");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    //   DOM_EL.orientationContainer.style("display", "flex");
    }
}

function startCon()
{
  UTIL.socket = io('fhss.ml', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('hello',{room : APP_STATE.room});
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
}
