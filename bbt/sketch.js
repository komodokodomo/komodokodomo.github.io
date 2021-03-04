window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  updateCSSVar();
  // registerSketches();
});

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

var SKETCHES = {
  play: null,
  spin: null,
}

  SKETCHES.play = ( s ) => {
    var DOM_EL = {
      contentContainer: null,
      canvasContainer: null,
      timerContainer: null,
      playContainer: null,
      restartContainer: null,
    }
  
    var UTIL = {
      timer: null,
    }
  
    var APP_STATE = {
      timerValue: 60,
    }
  
    s.registerDOM = () => {
      DOM_EL.timerContainer = s.select("timer-container");
      DOM_EL.playContainer = s.select("play-container");
      DOM_EL.playContainer.mousePressed(s.playEvent);
      DOM_EL.restartContainer = s.select("restart-container");
    }
  
    s.setup = () =>{
      s.noCanvas();
      s.registerDOM();
    }
  
    s.playEvent = () => {
      if(DOM_EL.playContainer.class().includes("play")){
        UTIL.timer = setInterval(s.updateTimer, 1000);
      }else{
        clearInterval(UTIL.timer);
      }
      DOM_EL.playContainer.toggleClass("play");
    }
  
    s.updateTimer = () => { 
      console.log("1s pass");
    }
  } 
  
  
  
  SKETCHES.spin = ( sketch ) => {
    let pie = [];
  
    let choices = [
    "Fast/Slow🐭","Fast/Slow🐶",
    "Fast/Slow🐡","Fast/Slow🐦",
    "Fast🐭","Fast😺",
    "Fast🐰","Fast🐶",
    "Fast🐡","Fast🐦"
    ]
  
    let colors = [
        '#a94fca', '#EE4266', '#FFD23F', '#3BCEAC', '#2765d4', '#FF715B'
    ];
    
    let button;
    let clickSound;
    let spinStarted = false;
    let chosenPie;
    let tickerDeflection = 0;
    
    let APP_STATE = {
      width: null,
      height: null,
      smallerSide: null
    }
    
    sketch.preload = () => {
      clickSound = sketch.loadSound('assets/click.mp3');
    }
    
    sketch.windowResized = () => {
      APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
      APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
      console.log(APP_STATE.width + ", " + APP_STATE.height);
      if(APP_STATE.width>APP_STATE.height){
        APP_STATE.smallerSide = APP_STATE.height;
      }else{
        APP_STATE.smallerSide = APP_STATE.width;
      }
      updateCSSVar();
  
      sketch.resizeCanvas(APP_STATE.width, APP_STATE.height);
      for(let i = 0; i < pie.length; i++){
        pie[i].pX = APP_STATE.width/2;
        pie[i].pY = APP_STATE.height/2;
        pie[i].radius = APP_STATE.smallerSide*0.8;
      }
    }
    
    sketch.setup = () => {
      APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
      APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
      if(APP_STATE.width>APP_STATE.height){
        APP_STATE.smallerSide = APP_STATE.height;
      }else{
        APP_STATE.smallerSide = APP_STATE.width;
      }
  
      sketch.angleMode(sketch.DEGREES);
      sketch.textAlign(sketch.RIGHT,sketch.CENTER);
      sketch.createCanvas(APP_STATE.width, APP_STATE.height);
      for(let i = 0; i < choices.length; i++){
        pie[i] = new Wheel(sketch.width/2,
                           sketch.height/2, 
                           360*i/choices.length,
                           0,
                           360/choices.length,
                           APP_STATE.smallerSide*0.8,
                           choices[i],
                           colors[i%colors.length]);
      }
      button = sketch.select("#play-image");
      button.mousePressed(sketch.spin);
    };
    sketch.spin = () => {
      console.log("spin now");
      spinStarted = true;
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
        sketch.ellipse(sketch.width/2,sketch.height/2 - APP_STATE.smallerSide*0.4 - 5 - tickerDeflection,20,20);
        sketch.ellipse(sketch.width/2,sketch.height/2 ,30,30);
      if(spinStarted && (sketch.abs(pie[0].rotation-pie[0].rotationTarget)<1)){
         spinStarted = false;
          console.log("spin stopped");
          console.log(chosenPie);
          sketch.select("#wheel-canvas").hide();
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
          chosenPie = this.content;
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
 







