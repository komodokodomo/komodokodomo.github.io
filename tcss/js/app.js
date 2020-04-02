var DOM_EL = {
    loginContainer: null,
    loginInput: null,
    loginButton: null,
}

function preload(){
    for( var i = 0; i < 5; i++ ){
        for( var j = 0; j < 4; j++ ){
            //load images for choosing
        }
    }
}

function setup(){

}

function draw(){

}

export class Avatar {  //own avatar and other people's avatars
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