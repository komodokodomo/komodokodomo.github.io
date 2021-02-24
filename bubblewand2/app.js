

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

    // speechTimer: 0
}

var APP_STATE = {
    width: null,
    height: null,
    nickname: ""
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
    }
  }
  
  function showLoginError(){
    DOM_EL.loginPinInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginPinInput.addClass("no-error");
    },300);
  }

function startCon()
{
  UTIL.socket = io('fhss.ml', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('hello',{room : "1234"});
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

function setup(){
    frameRate(10);
    startCon();

    UTIL.canvas = document.createElement("canvas");
    UTIL.ctx = UTIL.canvas.getContext("2d");

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    DOM_EL.canvas = createCanvas(APP_STATE.width,APP_STATE.height - titleHeight);

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
    
    DOM_EL.capture = createCapture({
        audio: false,
        video: {
          facingMode: {
            exact: "environment"
          }
        }
      });
     DOM_EL.captureOverlay = createDiv();
     DOM_EL.captureOverlay.id("video-overlay");
    // DOM_EL.capture.parent(DOM_EL.activityContainer);

    // DOM_EL.capture.hide();
  

    UTIL.scribble = new Scribble();
    CNV_EL.bubble = new ThoughtBubble(0, 0, width*0.7, width*0.7, "💬<i>say your reply and your wand will capture it!</i>", {R:random(0,255),G:random(0,255),B:random(0,255)}, true)
}

function snapEvent(){
    UTIL.canvas.width = DOM_EL.capture.elt.width;
    UTIL.canvas.height = DOM_EL.capture.elt.height;

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
    ocr(UTIL.canvas,rectangles);
}

// function ocr(imageLike) {
//     Tesseract.recognize(
//         imageLike,
//         'eng',
//         { logger: m => console.log(m) }
//       ).then(({ data: { text } }) => {
//         console.log(text);
//       })
//   }

async function ocr(imageLike,rect){
    await UTIL.worker1.load();
    await UTIL.worker2.load();
    await UTIL.worker1.loadLanguage('eng');
    await UTIL.worker2.loadLanguage('eng');
    await UTIL.worker1.initialize('eng');
    await UTIL.worker2.initialize('eng');

    UTIL.scheduler.addWorker(UTIL.worker1);
    UTIL.scheduler.addWorker(UTIL.worker2);
    // const results = await Promise.all(rect.map((rect) => (
    //     UTIL.scheduler.addJob('recognize', imageLike, { rect })
    //   )));
    const { data: { text } } = await UTIL.scheduler.addJob('recognize', imageLike);

    console.log(text);
    // await UTIL.scheduler.terminate(); // It also terminates all workers.
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
    // DOM_EL.speechBubbleContainer.addClass("float");
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
        this.div.mousePressed(snapEvent);
        this.div.addClass("bubble");
        this.div.parent(DOM_EL.activityContainer);

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
            // this.div.html(this.contentsHTML);
            this.div.position(this.x + shiftXMap + width/2, this.y + height/2 + DOM_EL.canvas.position().y);
            this.div.size(this.width * this.scaleX * scaleXYMap -10, this.height  * scaleXYMap - 10);
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
            // this.div.html(this.contentsHTML);
            this.div.position(this.x + shiftXMap + width/2 + this.randomSeed + sin(frameCount) * random(2,30), this.y + height/2 + DOM_EL.canvas.position().y - (frameCount - this.frameCount)*8);
            this.div.size(this.width * this.scaleX * scaleXYMap - 10, this.height  * scaleXYMap -10);
            this.div.style("font-size", width*scaleXYMap/30 + 'px');
            if(this.y + this.height/2 - (frameCount - this.frameCount)*5 < (this.height) * -1 - this.y ){
                this.bubbleOut = false;
                UTIL.socket.emit("bubble_image",{name: APP_STATE.nickname, message : UTIL.speechBubbleContent, color: {R:this.color.R,G:this.color.G,B:this.color.B}});
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
