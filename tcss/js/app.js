var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginInput: null,
    loginButton: null,
    slider: null
}

var CANVAS_EL = {
    images: []
}

var APP_STATE = {
    windowWidth: null,
    windowHeight: null
}

function preload(){

    userStartAudio().then(function() {  
        console.log("audio ready");
    });

    for( var i = 0; i < 6; i++ ){
        let buf = [];
        for( var j = 0; j < 4; j++ ){
            buf[j] = createImg("img/" + ((i*4)+j).toString() + ".png");
        }
        CANVAS_EL.images.push(buf);
    }
    // DOM_EL.images.hide();
    console.log(CANVAS_EL.images);
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
DOM_EL.slider.class("my-slider");

slider = tns({
    container: '.my-slider',
    items: 3,
    slideBy: 'page',
    autoplay: true
});

DOM_EL.loginInput.parent(DOM_EL.loginContainer);
DOM_EL.loginButton.parent(DOM_EL.loginContainer);
}

function draw(){
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
      this.spriteDefault = sprite[spriteNum][0];
      this.spriteTalkOne = sprite[spriteNum][1];
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