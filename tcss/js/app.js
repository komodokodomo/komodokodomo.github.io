var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginInput: null,
    loginButton: null,
    images: []
}

var APP_STATE = {
    windowWidth = null,
    windowHeight = null;
}

function preload(){
    for( var i = 1; i <= 5; i++ ){
        let buf = [];
        for( var j = 0; j < 4; j++ ){
            buf[j] = createImg("img/faces" + (i*j).toString() + ".png");
        }
        images[i].push(buf);
    }
    console.log(images);
}

function setup(){
canvas = createCanvas();
canvas.id("canvas");
    userStartAudio().then(function() {  
        console.log("audio ready");
    });
}

function draw(){
}

function windowResized(){
    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;
    // resizeCanvas(w, h);
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