var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginTitle: null,
    loginInstruction: null,
    loginSliderContainer: null,
    images: [],
    loginInput: null,
    loginButton: null
}

var APP_STATE = {
    windowWidth: null,
    windowHeight: null,
    nickname: null,
    loginSuccess: false,
}

var AVATAR ={
    own: null,
    others: []
}

var P5_SOUND = {
    mic: null,
    micLevel: null,
    micThresholdLevel: 0.01,
    micThresholdCross: false
}


function preload(){

    userStartAudio().then(function() {  
        console.log("audio ready");
        P5_SOUND.mic = new p5.AudioIn();
        P5_SOUND.mic.start();
        setInterval(function(){
            P5_SOUND.micLevel = lerp(P5_SOUND.micLevel,P5_SOUND.mic.getLevel(),0.5);
            if( P5_SOUND.micLevel > P5_SOUND.micThresholdLevel ){
                P5_SOUND.micThresholdCross = true;
            }
            else{
                P5_SOUND.micThresholdCross = false;
            }
        },50);
    });

    for( let i = 0; i < 24; i++ ){
        DOM_EL.images[i] = createImg("img/" + i.toString() + ".png");
        DOM_EL.images[i].hide();
    }
}

function setup(){
    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;
    DOM_EL.canvas = createCanvas( APP_STATE.windowWidth, APP_STATE.windowHeight);
    DOM_EL.canvas.id("canvas");

    DOM_EL.loginContainer = createDiv();
    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.id("login-container");
    DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);

    DOM_EL.loginTitle = createDiv("VROOM");
    DOM_EL.loginTitle.id("login-title");
    DOM_EL.loginTitle.parent(DOM_EL.loginContainer);

    DOM_EL.loginInstruction = createDiv("swipe to customise your character");
    DOM_EL.loginInstruction.id("login-instruction");
    DOM_EL.loginInstruction.parent(DOM_EL.loginContainer);

    DOM_EL.loginSliderContainer = createDiv();
    DOM_EL.loginSliderContainer.id("login-slider-container");
    DOM_EL.loginSliderContainer.parent(DOM_EL.loginContainer);

    DOM_EL.loginInput = createInput();
    DOM_EL.loginInput.id("login-input");
    DOM_EL.loginInput.input(nickname);

    DOM_EL.loginButton = createButton("JOIN!");
    DOM_EL.loginButton.id("login-button");
    DOM_EL.loginButton.mousePressed(login);

    DOM_EL.loginInput.parent(DOM_EL.loginContainer);
    DOM_EL.loginButton.parent(DOM_EL.loginContainer);

    var mc = new Hammer("login-slider-container");

    mc.on("panleft panright tap press", function(ev) {
        console.log(ev.type +" gesture detected.");
    });
}

function nickname(){
    APP_STATE.nickname = this.value();
    console.log(APP_STATE.nickname);
}

function login(){
    console.log("enter socketIO server here");
    console.log("Feed in char number + nickname to both local cache and server");
    APP_STATE.loginSuccess = true;
    AVATAR.own = new Avatar(0);
    setInterval(function(){
        AVATAR.own.update();
    },50);
    DOM_EL.loginInput.hide();
    DOM_EL.loginButton.hide();
}

function draw(){
    if(APP_STATE.loginSuccess){
        if(keyIsDown(LEFT_ARROW)){
            AVATAR.own.posX -= 5;
        }else if(keyIsDown(RIGHT_ARROW)){
            AVATAR.own.posX += 5;
        }else if(keyIsDown(UP_ARROW)){
            AVATAR.own.posY -= 5;
        }else if(keyIsDown(DOWN_ARROW)){
            AVATAR.own.posY += 5;
        }
    }
}

function windowResized(){
    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;
    resizeCanvas(APP_STATE.windowWidth, APP_STATE.windowHeight);
}

class Avatar {  //own avatar and other people's avatars 
    constructor(spriteNum) {
      this.posX = random(width);
      this.posY = random(height);
      this.scaleX = random(0.9,1.1);
      this.scaleY = random(0.9,1.1);
      this.spriteNum = spriteNum;
      this.spriteNumModifier = 0;
      this.lastRecordedActivity = 0;
      this.talkToggleTimer = null;
    //   this.timeoutFunc = null;
    }
  

    update(){ //(X,Y,MIC,)
        clear();
        // if( P5_SOUND.micThresholdCross === true && millis() - this.lastRecordedActivity < 30000){
        if( P5_SOUND.micThresholdCross === true ) {
            console.log("audio detected, toggle faces");
            this.lastRecordedActivity = millis();
            if(millis() - this.talkToggleTimer > 300){
                this.talkToggleTimer = millis();
                if(this.spriteNumModifier == 1){
                    this.spriteNumModifier = 2;
                }
                else{
                    this.spriteNumModifier = 1;
                }
            }
        }
        else if( P5_SOUND.micThresholdCross === false && millis() - this.lastRecordedActivity > 30000){
            this.spriteNumModifier = 3;
            console.log("no activity detected, show AFK face");
        }
        else{
            console.log("no audio detected, show default face");
            this.spriteNumModifier = 0;
        }
        DOM_EL.images[this.spriteNum*4 + this.spriteNumModifier].show();
        DOM_EL.images[this.spriteNum*4 + this.spriteNumModifier].position(this.posX, this.posY);
        // image(DOM_EL.images[this.spriteNum*4 + this.spriteNumModifier],this.posX, this.posY);         
    }
  }