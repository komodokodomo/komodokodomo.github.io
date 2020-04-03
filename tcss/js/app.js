var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginInput: null,
    loginButton: null,
    slider: null,
    images: [],
    sliderContainer: [],
    sliderImages: []
}

// var CANVAS_EL = {
    // images: []
// }

var APP_STATE = {
    windowWidth: null,
    windowHeight: null,
}

var P5_SOUND = {
    mic: null,
    micLevel: null,
    micThresholdLevel: 0.1,
    micThresholdCross: false
}


function preload(){

    userStartAudio().then(function() {  
        console.log("audio ready");
        P5_SOUND.mic = new p5.AudioIn();
        P5_SOUND.mic.start();
        P5_SOUND.mic.connect();
        setInterval(function(){
            P5_SOUND.micLevel = P5_SOUND.mic.getLevel();
            // if( P5_SOUND.micLevel < P5_SOUND.micThresholdLevel && P5_SOUND.micThresholdCross === false){
            // } else if ( P5_SOUND.micLevel > P5_SOUND.micThresholdLevel && P5_SOUND.micThresholdCross === false){
            //     P5_SOUND.micThresholdCross = true;
            // } else if ( P5_SOUND.micLevel > P5_SOUND.micThresholdLevel && P5_SOUND.micThresholdCross === true){
            // } else if ( P5_SOUND.micLevel < P5_SOUND.micThresholdLevel && P5_SOUND.micThresholdCross === true){
            //     P5_SOUND.micThresholdCross = false;
            //     console.log("move mouth");
            // }
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
DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);

DOM_EL.loginInput = createInput();
DOM_EL.loginButton = createButton();
DOM_EL.slider = createDiv();
DOM_EL.slider.parent(loginContainer);
DOM_EL.slider.class("my-slider");

for( let j = 0; j < 6; j++ ){
    // DOM_EL.sliderContainer[j] = createDiv();
    // DOM_EL.sliderContainer[j].parent(DOM_EL.slider);

    DOM_EL.sliderImages[j] = createImg("img/" + (j*4).toString() + ".png");
    // DOM_EL.sliderImages[j].hide();
    DOM_EL.sliderImages[j].parent(DOM_EL.slider);
}

slider = tns({
    container: '.my-slider',
    items: 1,
    slideBy: 'page',
    nav: false
});

DOM_EL.loginInput.parent(DOM_EL.loginContainer);
DOM_EL.loginButton.parent(DOM_EL.loginContainer);
}

function draw(){
    if(keyIsDown(LEFT_ARROW)){
        posX--;
    }else if(keyIsDown(RIGHT_ARROW)){
        posX++;
    }else if(keyIsDown(UP_ARROW)){
        posY++;
    }else if(keyIsDown(RIGHT_ARROW)){
        posY--;
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
      this.spriteNum = spriteNum;
      this.spriteDefault = sprite[spriteNum];
      this.spriteTalkOne = sprite[spriteNum];
      this.spriteTalkTwo = sprite[spriteNum][2];
      this.spriteAway = sprite[spriteNum][3];
      this.lastRecordedActivity = null;
    }
  
    move(a,b) {
      this.posX = a;
      this.posY = b;
      jitter();
    }
  
    jitter() {
      //randomize scaleX
      //randomise scaleY
    }

    AFK(){
      //if no movement, chat, or audio signal received for 60seconds.
      //change to spriteAway;
      //if anything detected, change back to default
      jitter();
    }

    talk(){
      //toggle between spriteTalkOne and spriteTalkTwo
      jitter();
    }

    resetTimer(){
      lastRecordedActivity = millis();
    }

    display(){
      image()
    }

  }