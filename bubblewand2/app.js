

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
    capture: null,
    captureOverlay: null,
    speechBubbleContainer: null,
    speechBubble: null,

    orientationContainer: null,
    orientationImageContainer: null,
      orientationImage: null,
    orientationHeader: null,
    orientationContent: null,

    errorContainer: null,
    errorImageContainer: null,
        errorImage: null,
    errorHeader: null,
    errorContent: null,
    refreshButton: null,

    pauseContainer: null,
}

var CNV_EL = {
    bubble: null,
}

var UTIL = {
    speechBubbleContent: "",
    scribble: null,
    socket: null,
    canvas: null,
    ctx: null,
    scheduler: null,
    worker1: null,
    worker2: null,
    dataUrl: null,
    timeout: null

    // speechTimer: 0
}

var APP_STATE = {
    cameraEnabled: false,
    motionEnabled: false,
    width: null,
    height: null,
    nickname: "",
    contentReady: false,
    optionChoice: null,
    DOMRegistered: false
}

var SOUNDS = {
    shutter: null,
    delete: null,
    pop: null,
  }

UTIL.scheduler = Tesseract.createScheduler();
UTIL.worker1 = Tesseract.createWorker();
UTIL.worker2 = Tesseract.createWorker();
Tesseract.setLogging(true)



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

    if(MOVEMENT.zz < -10){
        if(MOVEMENT.rotateX > 15 || MOVEMENT.rotateY > 15)
        if(UTIL.dataUrl.length !== null && APP_STATE.contentReady == true){
            triggerBubbleAnimation();
        }
    }
    // console.log(MOVEMENT.xx +", " + MOVEMENT.yy + ", " + MOVEMENT.zz);
    // console.log(MOVEMENT.rotateZ +", " + MOVEMENT.rotateY + ", " + MOVEMENT.rotateX);
}

async function waitUserInput() {
    while (APP_STATE.optionChoice === null) await UTIL.timeout(50); // pauses script
}

async function loginEvent(){
    if(DOM_EL.loginNicknameInput.value().length == 0){
        DOM_EL.loginNicknameInput.removeClass("no-error");
        setTimeout( () => DOM_EL.loginNicknameInput.addClass("no-error"), 300 );
    }
    else{
        APP_STATE.nickname = DOM_EL.loginNicknameInput.value();
        UTIL.socket.emit("bubble_login",{room:"2222", "name":APP_STATE.nickname});
        DOM_EL.activityContainer.show();
        DOM_EL.loginContainer.hide();  
        CNV_EL.bubble.closeDiv.style("display","flex");
        if(!APP_STATE.cameraEnabled){
            DOM_EL.errorContainer.style("display","flex");
        }
        else{
            // DOM_EL.errorContainer.style("display","none");
            DOM_EL.errorHeader.html("You might need to enable motion!");
            DOM_EL.errorContent.html("If the prompt appears, press <b>allow</b>");
            DOM_EL.refreshButton.html("OK");
            DOM_EL.errorImage.elt.src = "image/error2.png";
            DOM_EL.errorContainer.style("display","flex");
            
            APP_STATE.optionChoice = null;
            
            await waitUserInput();
            console.log("shouldnt fire until I press OK");

            getAccel();
            checkOrientation();
        }
}
  }
  
  function showLoginError(){
    DOM_EL.loginPinInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginPinInput.addClass("no-error");
    },300);
  }

window.addEventListener("visibilitychange", () => {
    if(document.hidden){
      if(APP_STATE.DOMRegistered){
        DOM_EL.capture.elt.pause();
      }
    //   console.log("window hidden");
    }
    else{
      if(APP_STATE.DOMRegistered){
        DOM_EL.capture.elt.play();
      }    
    //   console.log("window shown");
    }
  });

function startCon()
{
  UTIL.socket = io('fhss.ml', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('hello',{room : "2222"});
		console.log("connected");		
        if(APP_STATE.nickname.length > 0){
            UTIL.socket.emit("bubble_login",{room:"2222", "name":APP_STATE.nickname});
        } 
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
}

function preload() {
    soundFormats('mp3', 'ogg');
    SOUNDS.shutter = loadSound('sound/shutter');
    SOUNDS.delete = loadSound('sound/delete');
    SOUNDS.pop = loadSound('sound/pop');
  }

function setup(){
    UTIL.timeout = async ms => new Promise(res => setTimeout(res, ms));

    frameRate(10);
    startCon();

    UTIL.canvas = document.createElement("canvas");
    UTIL.canvas.style.display = 'none';
    UTIL.ctx = UTIL.canvas.getContext("2d");

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    DOM_EL.canvas = createCanvas(APP_STATE.width,APP_STATE.height - titleHeight);


    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginTitleContainer = select("#login-title-container");
    DOM_EL.loginPinInput = select("#login-pin-input");
      DOM_EL.loginPinInput.addClass("no-error");
      DOM_EL.loginPinInput.hide();
    DOM_EL.loginNicknameInput = select("#login-nickname-input");
        DOM_EL.loginNicknameInput.addClass("no-error");
    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(loginEvent);
    DOM_EL.activityContainer = select("#activity-container");
        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityInstructions = select("#activity-instructions");
        DOM_EL.activityContentContainer = select("#activity-content-container");
            DOM_EL.canvas.parent(DOM_EL.activityContentContainer);
    DOM_EL.activityContainer.hide();
    
    try{
        DOM_EL.capture = createCapture({
            audio: false,
            video: {
              facingMode: {
                exact: "environment"
              }
            }
          },(stream)=>{
              console.log(stream);
              console.log("camera allowed successfully");
              APP_STATE.cameraEnabled = true;
          });
    }
    catch{
        // alert("you must allow camera permissions");
        // location.reload();
    }

     DOM_EL.captureOverlay = createDiv();
     DOM_EL.captureOverlay.id("video-overlay");

     DOM_EL.orientationContainer = select("#orientation-container");
     DOM_EL.orientationContainer.hide();
     DOM_EL.orientationContainer.position(0,0);

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
    // DOM_EL.capture.parent(DOM_EL.activityContainer);

    // DOM_EL.capture.hide();

  
    setTimeout(windowResized,1000);
    UTIL.scribble = new Scribble();
    CNV_EL.bubble = new ThoughtBubble(0, 0, width*0.7, width*0.7, "💬<i>say your reply and your wand will capture it!</i>", {R:random(0,255),G:random(0,255),B:random(0,255)}, true)
    
    // checkOrientation();
    APP_STATE.DOMRegistered = true;
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
        // window.location = window.location.href+'?eraseCache=true';
        // location.reload(true);
    }
}

function snapEvent(){
    SOUNDS.shutter.play();

    if(CNV_EL.bubble.orientationScale == 1.0){
        UTIL.canvas.width = DOM_EL.capture.elt.width;
        UTIL.canvas.height = DOM_EL.capture.elt.height;
    }
    else if(CNV_EL.bubble.orientationScale == 0.7){
        UTIL.canvas.width = DOM_EL.capture.elt.height;
        UTIL.canvas.height = DOM_EL.capture.elt.width;
    }

    // CNV_EL.bubble.closeDiv.style("display","flex");

    DOM_EL.captureOverlay.addClass("flash");
    setTimeout(() => DOM_EL.captureOverlay.removeClass("flash"), 100);

    DOM_EL.capture.pause();
    const rectangles = [
        {
          left: 0,
          top: 0,
          width: UTIL.canvas.width,
          height: UTIL.canvas.height/2,
        },
        {
          left: 0,
          top: UTIL.canvas.height/2,
          width: UTIL.canvas.width,
          height: UTIL.canvas.height/2,
        },
      ];
    UTIL.ctx.drawImage(DOM_EL.capture.elt, 0, 0);
    UTIL.dataUrl = UTIL.canvas.toDataURL(0.5);
    console.log(UTIL.dataUrl);
    APP_STATE.contentReady = true;
    if(CNV_EL.bubble.instructionDiv.class().includes("hidden")){
        CNV_EL.bubble.instructionDiv.removeClass("hidden");
    }
    // ocr(UTIL.canvas,rectangles);
}

function closeSnap(){
    APP_STATE.contentReady = false;
    CNV_EL.bubble.closeDiv.hide();
    DOM_EL.capture.play();
    CNV_EL.bubble.instructionDiv.addClass("hidden");
}

function toggleSnap(){
    if(CNV_EL.bubble.bubbleOut){}
    else{
        if(CNV_EL.bubble.closeDiv.html() == "📷"){
            snapEvent();
            CNV_EL.bubble.closeDiv.html("🗑️");
            CNV_EL.bubble.closeDiv.addClass("remove");
        }
        else if(CNV_EL.bubble.closeDiv.html() == "🗑️"){
            SOUNDS.delete.play();
            APP_STATE.contentReady = false;
            CNV_EL.bubble.closeDiv.html("📷");
            DOM_EL.capture.play();
            CNV_EL.bubble.instructionDiv.addClass("hidden");
            CNV_EL.bubble.closeDiv.removeClass("remove");
        }
    }
}


async function ocr(imageLike,rect){
    await UTIL.worker1.load();
    await UTIL.worker2.load();
    await UTIL.worker1.loadLanguage('eng');
    await UTIL.worker2.loadLanguage('eng');
    await UTIL.worker1.initialize('eng');
    await UTIL.worker2.initialize('eng');

    UTIL.scheduler.addWorker(UTIL.worker1);
    UTIL.scheduler.addWorker(UTIL.worker2);
 
    const { data: { text } } = await UTIL.scheduler.addJob('recognize', imageLike);

    console.log(text);
  }
   

function draw(){
    clear();
    CNV_EL.bubble.render();
}


function triggerBubbleAnimation(){
    if(!CNV_EL.bubble.bubbleOut){
        SOUNDS.pop.play();
        CNV_EL.bubble.bubbleOut = true;
        // CNV_EL.bubble.closeDiv.hide();
        CNV_EL.bubble.closeDiv.html("📷");
        CNV_EL.bubble.frameCount = frameCount;
        CNV_EL.bubble.randomSeed = random(-10,10);
    }
    CNV_EL.bubble.instructionDiv.addClass("hidden");
    CNV_EL.bubble.closeDiv.removeClass("remove");

    // DOM_EL.speechBubbleContainer.addClass("float");
}

function init() {

	mm = new MobileMovement();
    
    mm.on("basketball shot", function(info) {
		console.log(info.movement); // Logs the monitored movement object defined by "basketball shot"
		console.log(info.actionKey); // Logs the string "basketball shot"
        console.log(info.event.alpha); // Logs the alpha component of the DeviceOrientation event triggering the callback
        if(UTIL.dataUrl.length !== null && APP_STATE.contentReady == true){
            triggerBubbleAnimation();
        }
	});
}

window.addEventListener("load", init, false);



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
        this.orientationScale = 1.0;
        this.bubbleOut = false;
        this.frameCount;
        this.randomSeed;
        this.color = color;
        this.div = createDiv();
        // this.div.mousePressed(snapEvent);
        this.div.addClass("bubble");
        this.div.parent(DOM_EL.activityContainer);

        this.closeDiv = createDiv("📷");
        this.closeDiv.hide();
        this.closeDiv.id("close-div");
        // this.closeDiv.parent(this.div);
        this.closeDiv.mousePressed(toggleSnap);

        this.instructionDiv = createDiv();
        this.instructionDiv.id("instruction-div")
        this.instructionDiv.addClass("hidden");
        
        this.instructionImage = createImg("image/wand_instruction.gif");
        this.instructionImage.id("instruction-image");
        this.instructionImage.parent(this.instructionDiv);
        
        this.instruction = createDiv("Wave your device to send your speech bubble to the board");
        this.instruction.id("instruction");
        this.instruction.parent(this.instructionDiv);

        DOM_EL.capture.parent(this.div);
        DOM_EL.captureOverlay.parent(this.div);
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
        if(this.orientationScale == 1.0){
            this.shiftX = lerp(this.shiftX, MOVEMENT.xx, 0.1);
            this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
            shiftXMap = this.shiftX * this.width/8;
            scaleXYMap = 1 + this.scaleXY/8;
            this.scaleX = 1- abs(shiftXMap/this.width);
        }
        else if(this.orientationScale == 0.7){
            this.shiftX = lerp(this.shiftX, MOVEMENT.yy, 0.1);
            this.scaleXY = lerp(this.scaleXY, MOVEMENT.zz, 0.2);
            shiftXMap = this.shiftX * this.width/8;
            scaleXYMap = 1 + this.scaleXY/8;
            this.scaleX = 1- abs(shiftXMap/this.width);
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
            UTIL.scribble.scribbleRoundedRect(  this.x + shiftXMap, 
                                                this.y + this.height * scaleXYMap * this.orientationScale, 
                                                this.width * this.scaleX * scaleXYMap * this.orientationScale/9, 
                                                this.height * scaleXYMap * this.orientationScale, 
                                                this.width * this.scaleX * scaleXYMap * this.orientationScale/24 
                                                );
        }
        // strokeWeight();
        stroke(0);
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale);
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale);
        UTIL.scribble.scribbleEllipse( this.x + shiftXMap, this.y, this.width * this.scaleX * scaleXYMap * this.orientationScale, this.height * scaleXYMap * this.orientationScale);
        if(!this.bubbleOut){
            fill(0);
            noStroke();
            text(APP_STATE.nickname + "'s bubble:", this.x + shiftXMap, -this.height * scaleXYMap * this.orientationScale/2 + (this.height - this.height * scaleXYMap * this.orientationScale * sqrt(0.5))/2);
            this.div.position(this.x + shiftXMap + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
            this.div.size(this.width * this.scaleX * scaleXYMap * this.orientationScale -10, this.height  * scaleXYMap * this.orientationScale - 10);
            this.div.style("font-size", width*scaleXYMap * this.orientationScale/30 + 'px');
        }
        else{
            stroke(0);
            UTIL.scribble.scribbleEllipse( 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                // this.y - (frameCount - this.frameCount)*8, 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30), 
                this.width * this.orientationScale + 10* sin(frameCount), 
                this.height * this.orientationScale + 10* cos(frameCount) 
                );

            fill(this.color.R,this.color.G,this.color.B,10);
            stroke(this.color.R,this.color.G,this.color.B,10);

            UTIL.scribble.scribbleEllipse( 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                // this.y - (frameCount - this.frameCount)*8, 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30), 
                this.width * this.orientationScale + 10* sin(frameCount)-3, 
                this.height * this.orientationScale + 10* cos(frameCount) - 3 );

            ellipse(
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                // this.y - (frameCount - this.frameCount)*8, 
                this.y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30), 
                this.width  * this.orientationScale + 10* sin(frameCount) - 3, 
                this.height  * this.orientationScale + 10* cos(frameCount) - 3 );
            fill(0);
            // text(this.contents, this.x + this.randomSeed + sin(frameCount) * random(2,30), this.y - (frameCount - this.frameCount)*8);
            text(
                APP_STATE.nickname + "'s bubble:", 
                this.x + this.randomSeed + sin(frameCount) * random(2,30), 
                // -this.height * scaleXYMap/2 + (this.height - this.height * scaleXYMap * sqrt(0.5))/2 - (frameCount - this.frameCount)*8
                -this.height * scaleXYMap/2 + (this.height - this.height * scaleXYMap  * this.orientationScale * sqrt(0.5))/2 + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
                );
            // this.div.html(this.contentsHTML);    
            this.div.position(
                this.x + shiftXMap + width/2 + this.randomSeed + sin(frameCount) * random(2,30), 
                // this.y + height/2 + DOM_EL.canvas.position().y - (frameCount - this.frameCount)*8
                this.y + height/2 + DOM_EL.canvas.position().y + (((frameCount - this.frameCount) * this.height * -1 - this.y)/30)
                );

            this.div.size(this.width * this.scaleX * this.orientationScale * scaleXYMap - 10, this.height  * scaleXYMap * this.orientationScale -10);
            this.div.style("font-size", width*scaleXYMap * this.orientationScale/30 + 'px');
            // if(this.y + this.height/2 - (frameCount - this.frameCount)*8 < (this.height) * -1 - this.y ){

            if(this.y + this.height/2 + (((frameCount - this.frameCount) * this.height * this.orientationScale * -1 - this.y)/30) < this.height * this.orientationScale * -1.5 - this.y ){
                this.bubbleOut = false;
                DOM_EL.capture.play();
                UTIL.socket.emit("bubble_image",{name: APP_STATE.nickname, message : UTIL.dataUrl, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
                UTIL.speechBubbleContent = "";
                UTIL.dataUrl = null;
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

    // let containerW = document.getElementById('activity-content-container').offsetWidth;
    // let containerH = document.getElementById('activity-content-container').offsetHeight;
    // resizeCanvas(containerW,containerH);

    CNV_EL.bubble.changeDimensions(width*0.7, width*0.7);

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      CNV_EL.bubble.orientationScale = 1.0;
      document.documentElement.style.setProperty('--vmin', `${vw}px`);
      DOM_EL.orientationContainer.style("display", "none");
      CNV_EL.bubble.closeDiv.removeClass("side");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh}px`);
      CNV_EL.bubble.orientationScale = 0.7;
      CNV_EL.bubble.closeDiv.addClass("side");
    //   if(DOM_EL.loginContainer.style("display") == "none"){
    //     DOM_EL.orientationContainer.style("display", "flex");
    //   }  
    }
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


function checkOrientation(){
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    // document.documentElement.style.setProperty('--vh', `${vh}px`);
    // document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
    //   document.documentElement.style.setProperty('--vmin', `${vw}px`);
      CNV_EL.bubble.orientationScale = 1.0;
      DOM_EL.orientationContainer.style("display", "none");
      CNV_EL.bubble.closeDiv.removeClass("side");
    }
    else{
    //   document.documentElement.style.setProperty('--vmin', `${vh}px`);
    //   DOM_EL.orientationContainer.style("display", "flex");
    CNV_EL.bubble.orientationScale = 0.7;
    CNV_EL.bubble.closeDiv.addClass("side");
    }
}
