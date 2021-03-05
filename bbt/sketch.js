window.addEventListener('DOMContentLoaded', (event) => {
  updateCSSVar();
  registerDOM();
  console.log('DOM fully loaded and parsed');
});

window.addEventListener("resize", updateCSSVar);


function updateCSSVar(){
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;

  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);

  if(vh > vw){
    document.documentElement.style.setProperty('--vmin', `${vw}px`);
    document.documentElement.style.setProperty('--vmax', `${vh}px`);
  }
  else{
    document.documentElement.style.setProperty('--vmin', `${vh}px`);
    document.documentElement.style.setProperty('--vmax', `${vw}px`);
  }
}

function registerDOM(){

  GLOBAL_DOM.wheelConfigContainer = document.getElementById("wheel-config-container");
  GLOBAL_DOM.wheelConfigSaveContainer = document.getElementById("wheel-config-save-container");
  GLOBAL_DOM.wheelConfigSaveContainer.onclick = () => {
    GLOBAL_DOM.wheelConfigContainer.classList.toggle("hidden-right");
    GLOBAL_DOM.instruction.innerHTML = "Spin the wheel to choose an activity"
  };

  GLOBAL_DOM.wheelConfig = document.getElementById("wheel-change");
  GLOBAL_DOM.wheelConfig.onclick = () => {
    GLOBAL_DOM.wheelConfigContainer.classList.toggle("hidden-right");
    GLOBAL_DOM.instruction.innerHTML = "Choose a preset or customize which activities to randomize!"
  };

  GLOBAL_DOM.instruction = document.getElementById('instruction');

}

var SKETCHES = {
  play: null,
  spin: null,
  transition: null,
}

var GLOBAL_APP_STATE = {
  timerStartingValue: 10,
  timerValue: 10,
  chosenPie: null
}

var GLOBAL_DOM = {
  wheelConfigContainer: null,
  wheelConfigSaveContainer: null,
  wheelConfig: null,

  // spinContainer
  instruction: null,
}


// SKETCHES.transition = ( s ) => {

//   s.showAnimation = false;

//   s.setup = () => {
//     s.createCanvas();
//   }
//   s.draw = () => {
//     if(s.showAnimation){
//       clear();
//     } else{

//     }
//   }
// }

  SKETCHES.play = ( s ) => {
    var DOM_EL = {
      contentContainer: null,
      instructionContainer: null,
        instruction: null,
      canvasContainer: null,
        wheelCanvas: null,
        wheelCanvasConfig: null,
      timerContainer: null,
        timer: null,
      playContainer: null,
      restartContainer: null,
    }
  
    var UTIL = {
      timer: null,
    }
  

  
    s.registerDOM = () => {
      DOM_EL.instructionContainer = s.select("#instruction-container");
        DOM_EL.instruction = s.select("#instruction");

      DOM_EL.timerContainer = s.select("#timer-container");
        DOM_EL.timer = s.select("#timer");
      DOM_EL.playContainer = s.select("#play-container");
      DOM_EL.playContainer.mousePressed(s.playEvent);
      DOM_EL.restartContainer = s.select("#restart-container");
    }
  
    s.setup = () =>{
      s.noCanvas();
      s.registerDOM();
    }
  
    s.playEvent = () => {
      if(DOM_EL.playContainer.class().includes("play")){
        UTIL.timer = setInterval(s.updateTimer, 1000);
        document.getElementById('instruction').innerHTML = "Follow my actions!"
      }else{
        clearInterval(UTIL.timer);
      }
      DOM_EL.playContainer.toggleClass("play");
    }
  
    s.updateTimer = () => { 
      console.log("1s pass");
      GLOBAL_APP_STATE.timerValue--;
      DOM_EL.timer.html(GLOBAL_APP_STATE.timerValue);
      if(GLOBAL_APP_STATE.timerValue == 0){
        clearInterval(UTIL.timer);

        document.getElementById("timer-transition").classList.toggle('hidden-right');
        document.getElementById("play-transition").classList.toggle('hidden-right');
        document.getElementById("restart-transition").classList.toggle('hidden-right');

        document.getElementById("wheel-transition").classList.toggle('hidden-right');
        document.getElementById("instruction-transition").classList.toggle('hidden-right');

        setTimeout(() => {
          document.getElementById("spin-container").classList.toggle('hidden');
        }, 
        950, 
        );


        setTimeout(() => {
          GLOBAL_APP_STATE.timerValue = GLOBAL_APP_STATE.timerStartingValue;
          document.getElementById("spin-transition").classList.toggle('hidden-right');
          document.getElementById("wheel-transition").classList.toggle('hidden-right');
          document.getElementById("instruction-transition").classList.toggle('hidden-right');
        }, 
        1000, 
        );
        
        // document.getElementById('instruction').innerHTML = "Sit down and focus";
        // document.getElementById("spin-container").classList.toggle('hidden');
        // document.getElementById("timer-container").classList.toggle('hidden');
        // document.getElementById("play-container").classList.toggle('hidden');
        // document.getElementById("restart-container").classList.toggle('hidden');
      }
    }
  } 
  


  
  
  SKETCHES.spin = ( sketch ) => {
    let pie = [];
  
    sketch.choices = [
    "Fast / Slow 🐭","Fast / Slow 🐶",
    "Fast / Slow 🐡","Fast / Slow 🐦",
    "Fast 🐭","Fast 😺",
    "Fast 🐰","Fast 🐶",
    "Fast 🐡","Fast 🐦"
    ]
  
    sketch.colors = [
        '#a94fca', '#EE4266', '#FFD23F', '#3BCEAC', '#2765d4', '#FF715B'
    ];
    
    let button;
    let clickSound;
    let tickerDeflection = 0;
    
    sketch.APP_STATE = {
      width: null,
      height: null,
      smallerSide: null,
      spinStarted: false
    }
    
    sketch.preload = () => {
      clickSound = sketch.loadSound('assets/click.mp3');
    }
    
    sketch.windowResized = () => {
      sketch.APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
      sketch.APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
      console.log(sketch.APP_STATE.width + ", " + sketch.APP_STATE.height);
      if(sketch.APP_STATE.width > sketch.APP_STATE.height){
        sketch.APP_STATE.smallerSide = sketch.APP_STATE.height;
      }else{
        sketch.APP_STATE.smallerSide = sketch.APP_STATE.width;
      }
      // updateCSSVar();
  
      sketch.resizeCanvas(sketch.APP_STATE.width, sketch.APP_STATE.height);
      for(let i = 0; i < pie.length; i++){
        pie[i].pX = sketch.APP_STATE.width/2;
        pie[i].pY = sketch.APP_STATE.height/2;
        pie[i].radius = sketch.APP_STATE.smallerSide*0.8;
      }
    }
    
    sketch.setup = () => {
      sketch.textFont('Roboto');

      sketch.APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
      sketch.APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
      if(sketch.APP_STATE.width > sketch.APP_STATE.height){
        sketch.APP_STATE.smallerSide = sketch.APP_STATE.height;
      }else{
        sketch.APP_STATE.smallerSide = sketch.APP_STATE.width;
      }
  
      sketch.angleMode(sketch.DEGREES);
      sketch.textAlign(sketch.RIGHT,sketch.CENTER);
      sketch.createCanvas(sketch.APP_STATE.width, sketch.APP_STATE.height);
      for(let i = 0; i < sketch.choices.length; i++){
        pie[i] = new Wheel(sketch.width/2,
                           sketch.height/2, 
                           360*i/sketch.choices.length,
                           0,
                           360/sketch.choices.length,
                           sketch.APP_STATE.smallerSide*0.8,
                           sketch.choices[i],
                           sketch.colors[i%sketch.colors.length]);
      }
      button = sketch.select("#spin");
      button.mousePressed(sketch.spin);
    };
    sketch.spin = () => {
      console.log("spin now");
      sketch.APP_STATE.spinStarted = true;
      let spinValue = sketch.random(720,1440);
      let spinValueTarget = sketch.random(0,360);
      for(let i = 0; i < pie.length; i++){
        pie[i].rotation = spinValue;
        pie[i].rotationTarget = spinValueTarget;
      }
    }
    sketch.draw = () => {
      // sketch.background(220);
      sketch.clear();
      tickerDeflection = sketch.lerp(tickerDeflection,0,0.1);
      for(let i = 0; i < pie.length; i++){
        pie[i].rotation = sketch.lerp(pie[i].rotation,pie[i].rotationTarget,0.02);
        pie[i].drawPie();
      }
      for(let i = 0; i < pie.length; i++){
        pie[i].drawText();
        pie[i].drawPeg();
      }
        sketch.strokeWeight(2);
        sketch.ellipse(
              sketch.width/2,
              sketch.height/2 - sketch.APP_STATE.smallerSide*0.4 - 5 - tickerDeflection,
              sketch.APP_STATE.smallerSide*0.05, 
              sketch.APP_STATE.smallerSide*0.05
              );
        sketch.ellipse(
              sketch.width/2,
              sketch.height/2 ,
              sketch.APP_STATE.smallerSide*0.05, 
              sketch.APP_STATE.smallerSide*0.05
              );
      if(sketch.APP_STATE.spinStarted && (sketch.abs(pie[0].rotation-pie[0].rotationTarget)<1)){
        sketch.APP_STATE.spinStarted = false;
          console.log("spin stopped");
          console.log(GLOBAL_APP_STATE.chosenPie);
          document.getElementById('instruction').innerHTML = "Stand up and get ready!<br><br>Press play when ready!"
          // sketch.select("#wheel-canvas").hide();
          // Array.from(document.getElementsByClassName("transition-canvas")).forEach(element => {
            // element.classList.toggle('hidden-right');
            // element.classList.toggle('hidden-left');
            // setTimeout((e) => {
            //   e.classList.toggle('hidden-left');
            // }, 
            // 600, 
            // element
            // );
          // });

          document.getElementById("spin-transition").classList.toggle('hidden-right');
          document.getElementById("wheel-transition").classList.toggle('hidden-right');
          document.getElementById("instruction-transition").classList.toggle('hidden-right');


          setTimeout(() => {
            // document.getElementById("timer-container").classList.toggle('hidden');
            // document.getElementById("play-container").classList.toggle('hidden');
            // document.getElementById("restart-container").classList.toggle('hidden');
            document.getElementById("spin-container").classList.toggle('hidden');


            document.getElementById("timer-transition").classList.toggle('hidden-right');
            document.getElementById("play-transition").classList.toggle('hidden-right');
            document.getElementById("restart-transition").classList.toggle('hidden-right');
            document.getElementById("wheel-transition").classList.toggle('hidden-right');
            document.getElementById("instruction-transition").classList.toggle('hidden-right');
          }, 
          1000, 
          );
         }
      };
    
    class Wheel {
    constructor(pX,pY,rotationAngle,startingAngle,endingAngle,radius,content,col){
      this.pX = pX;
      this.pY = pY;
      this.rotationOffset = rotationAngle;
      this.startingAngle = startingAngle;
      this.endingAngle = endingAngle;
      this.radius = radius;
      this.content = "" + content;
      this.color = col;
      this.rotation = 0;
      this.rotationTarget = 0;
      this.clickPlayed = false;
    }
    drawPie(){
      sketch.push();
        sketch.strokeWeight(2);
        sketch.fill(this.color);
        sketch.translate(this.pX, this.pY);
        sketch.rotate(this.rotationOffset);
        sketch.arc(0, 0, this.radius, this.radius, this.startingAngle + this.rotation, this.endingAngle + this.rotation,sketch.PIE);
      sketch.pop();
    }
    drawText(){
      sketch.push();
        sketch.translate(this.pX, this.pY);
        sketch.rotate(this.rotationOffset + this.endingAngle/2 + this.rotation);
        sketch.textAlign(sketch.RIGHT,sketch.CENTER);
        sketch.textSize(sketch.width/30);
        sketch.text(this.content,this.radius/2 - this.radius/16,0);
      sketch.pop();
    }
      drawPeg(){
      // let multiplier = 1.0;
      sketch.push();
        sketch.translate(this.pX, this.pY);
        sketch.rotate(this.rotationOffset + this.rotation);
        if((this.rotationOffset +90 + this.rotation)%360 < 5 && this.clickPlayed == false){
          clickSound.play();
          GLOBAL_APP_STATE.chosenPie = this.content;
          this.clickPlayed = true;
          tickerDeflection = this.radius/32;
        }else if((this.rotationOffset +90 + this.rotation)%360 < 5 && this.clickPlayed){
        }else if((this.rotationOffset +90 + this.rotation)%360 > 5 && this.clickPlayed){
          this.clickPlayed = false;
        }
        
        sketch.ellipse(this.radius/2,0,this.radius/32);
      sketch.pop();
    }
  }
  };


  let myp5 = new p5(SKETCHES.spin,'wheel-canvas');
  let content = new p5(SKETCHES.play);
 







