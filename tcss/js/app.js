var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginTitle: null,
    loginInstruction: null,
    loginSliderImageContainer: null,
    loginSliderLeftContainer: null,
    loginSliderRightContainer: null,
    loginSliderArrowLeft: null,
    loginSliderArrowRight: null,
    images: [],
    loginInput: null,
    loginButton: null
    // shiftLeft: null,
    // shiftRight: null
}

var APP_STATE = {
    windowWidth: null,
    windowHeight: null,
    nickname: null,
    loginSuccess: false,
    spriteNum: 0,
    numSprites: 6
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
}

function setup(){
    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;
    DOM_EL.canvas = createCanvas( APP_STATE.windowWidth, APP_STATE.windowHeight);
    DOM_EL.canvas.id("canvas");

    DOM_EL.loginContainer = createDiv();
    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.id("login-container");
    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);

    DOM_EL.loginTitle = createDiv("VROOM");
    DOM_EL.loginTitle.id("login-title");
    DOM_EL.loginTitle.parent(DOM_EL.loginContainer);
    DOM_EL.loginTitle.position(0,0);
    DOM_EL.loginTitle.size(APP_STATE.windowWidth,APP_STATE.windowHeight/10);

    DOM_EL.loginSliderLeftContainer = createDiv();
    DOM_EL.loginSliderLeftContainer.id("login-slider-left-container");
    DOM_EL.loginSliderLeftContainer.position(0,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderLeftContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderImageContainer = createDiv();
    DOM_EL.loginSliderImageContainer.id("slider");
    DOM_EL.loginSliderImageContainer.position(APP_STATE.windowWidth/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderImageContainer.size(APP_STATE.windowWidth*3/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderRightContainer = createDiv();
    DOM_EL.loginSliderRightContainer.id("login-slider-right-container");
    DOM_EL.loginSliderRightContainer.position(APP_STATE.windowWidth*4/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderRightContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    for( let i = 0; i < (APP_STATE.numSprites)*4; i++ ){
        DOM_EL.images[i] = createImg("img/" + i.toString() + ".png");
        DOM_EL.images[i].hide();
        if( i % 4 === 0 ){
            DOM_EL.images[i].parent(DOM_EL.loginSliderImageContainer);
            DOM_EL.images[i].class("slider-image");
        }
    }

    DOM_EL.images[0].show();

    DOM_EL.loginSliderArrowLeft = createImg('img/left.png');
    DOM_EL.loginSliderArrowLeft.id("login-slider-arrow-left");
    DOM_EL.loginSliderArrowLeft.parent(DOM_EL.loginSliderLeftContainer);

    DOM_EL.loginSliderArrowRight = createImg('img/right.png');
    DOM_EL.loginSliderArrowRight.id("login-slider-arrow-right");
    DOM_EL.loginSliderArrowRight.parent(DOM_EL.loginSliderRightContainer);

    // DOM_EL.shiftRight = document.getElementsByClassName("right");
    // DOM_EL.shiftLeft = document.getElementsByClassName("left");

    DOM_EL.loginInstruction = createDiv("swipe to customise your character");
    DOM_EL.loginInstruction.id("login-instruction");
    DOM_EL.loginInstruction.parent(DOM_EL.loginContainer);
    DOM_EL.loginInstruction.position( 0 , APP_STATE.windowHeight * 5.1 / 10 );
    DOM_EL.loginInstruction.size( APP_STATE.windowWidth, APP_STATE.windowHeight * 1 / 10 );

    DOM_EL.loginInput = createInput();
    DOM_EL.loginInput.id("login-input");
    DOM_EL.loginInput.input(nickname);
    DOM_EL.loginInput.center("horizontal");
    DOM_EL.loginInput.attribute("placeholder", "ENTER NICKNAME");
    DOM_EL.loginInput.position(APP_STATE.windowWidth*2/10,APP_STATE.windowHeight*6/10);
    DOM_EL.loginInput.size(APP_STATE.windowWidth*6/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginButton = createButton("JOIN!");
    DOM_EL.loginButton.id("login-button");
    DOM_EL.loginButton.mousePressed(login);
    DOM_EL.loginButton.center("horizontal");
    DOM_EL.loginButton.position(APP_STATE.windowWidth*3/10,APP_STATE.windowHeight*7.3/10);
    DOM_EL.loginButton.size(APP_STATE.windowWidth*4/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginInput.parent(DOM_EL.loginContainer);
    DOM_EL.loginButton.parent(DOM_EL.loginContainer);

    var mc = new Hammer(slider);
    mc.on("swipeleft swiperight tap press", function(ev) {
        console.log(ev.type +" gesture detected.");
        if(ev.type == "swipeleft") {
            DOM_EL.images[APP_STATE.spriteNum*4].addClass("left");
            setTimeout(function(){
                let temp = overflow(APP_STATE.spriteNum - 1);
                console.log(temp);
                DOM_EL.images[temp * 4].hide();
                // while (DOM_EL.shiftLeft.length){
                //     DOM_EL.shiftLeft[0].classList.remove("left");
                // }
                DOM_EL.images[temp * 4].removeClass("left");
            }
            ,300);
            APP_STATE.spriteNum++;  
            APP_STATE.spriteNum = overflow(APP_STATE.spriteNum);
            DOM_EL.images[APP_STATE.spriteNum*4].show();

        } else if(ev.type == "swiperight") {
            DOM_EL.images[APP_STATE.spriteNum].addClass("right");
            setTimeout(function(){
                let temp2 = overflow(APP_STATE.spriteNum + 1);
                console.log(temp2);
                DOM_EL.images[temp2 * 4].hide();
                // while (DOM_EL.shiftRight.length){
                //     DOM_EL.shiftRight[0].classList.remove("right");
                // }
                DOM_EL.images[temp2 * 4].removeClass("right");
            }
            ,300);
            APP_STATE.spriteNum--;  
            APP_STATE.spriteNum = overflow(APP_STATE.spriteNum);  
            DOM_EL.images[APP_STATE.spriteNum*4].show();
        }
        // APP_STATE.spriteNum = overflow(APP_STATE.spriteNum);
        // console.log(APP_STATE.spriteNum);
    });
}

const overflow = function(i){
    if (i < 0) { i = i%(APP_STATE.numSprites - 1) + APP_STATE.numSprites; }
    else if (i > APP_STATE.numSprites - 1) { i = i%(APP_STATE.numSprites - 1) - 1; }
    return i;
  }

function nickname(){
    APP_STATE.nickname = this.value();
    console.log(APP_STATE.nickname);
}

function login(){
    console.log("enter socketIO server here");
    console.log("Feed in char number + nickname to both local cache and server");
    APP_STATE.loginSuccess = true;
    AVATAR.own = new Avatar(APP_STATE.spriteNum);
    setInterval(function(){
        AVATAR.own.update();
    },50);
    DOM_EL.loginInput.hide();
    DOM_EL.loginButton.hide();
    DOM_EL.loginInstruction.hide();
    DOM_EL.loginTitle.hide();
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

    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);

    DOM_EL.loginTitle.position(0,0);
    DOM_EL.loginTitle.size(APP_STATE.windowWidth,APP_STATE.windowHeight/10);

    DOM_EL.loginSliderContainer.position(0,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderLeftContainer.position(0,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderLeftContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderImageContainer.position(APP_STATE.windowWidth/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderImageContainer.size(APP_STATE.windowWidth*3/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderRightContainer.position(APP_STATE.windowWidth*4/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderRightContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginInstruction.position( 0 , APP_STATE.windowHeight * 5.1 / 10 );
    DOM_EL.loginInstruction.size( APP_STATE.windowWidth, APP_STATE.windowHeight * 1 / 10 );

    DOM_EL.loginInput.position(APP_STATE.windowWidth*2/10,APP_STATE.windowHeight*6/10);
    DOM_EL.loginInput.size(APP_STATE.windowWidth*6/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginButton.position(APP_STATE.windowWidth*3/10,APP_STATE.windowHeight*7.3/10);
    DOM_EL.loginButton.size(APP_STATE.windowWidth*4/10,APP_STATE.windowHeight*1/10);

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