
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

  GLOBAL_DOM.wheelCanvas = document.getElementById("wheel-canvas");
  GLOBAL_DOM.animationCanvas = document.getElementById("animation-canvas");


  GLOBAL_DOM.wheelConfigContainer = document.getElementById("wheel-config-container");
  GLOBAL_DOM.wheelConfigSaveContainer = document.getElementById("wheel-config-save-container");
  GLOBAL_DOM.wheelConfigSaveContainer.onclick = () => {
    GLOBAL_DOM.wheelConfigContainer.classList.toggle("hidden-right");
    GLOBAL_DOM.instruction.innerHTML = "Spin the wheel to choose an activity"
    SKETCHES.wheel.pie = [];
    let x = GLOBAL_DOM.wheelConfigListIncluded.childElementCount
    for(let i = 0; i < x; i++){
      SKETCHES.wheel.createWheel(i,x,GLOBAL_DOM.wheelConfigListIncluded.children[i].firstElementChild.innerHTML);
    }

  };

  GLOBAL_DOM.wheelConfig = document.getElementById("wheel-change");
  GLOBAL_DOM.wheelConfig.onclick = () => {
    GLOBAL_DOM.wheelConfigContainer.classList.toggle("hidden-right");
    GLOBAL_DOM.instruction.innerHTML = "Choose a preset or customize which activities to randomize!"
  };

  GLOBAL_DOM.wheelConfigPresetSlow = document.getElementById("wheel-config-preset-slow");
  GLOBAL_DOM.wheelConfigPresetSlow.onclick = () => {
    for(let i = 0; i < Object.keys(CHOICES).length; i++){
      if(Object.keys(CHOICES)[i].includes("b_") || Object.keys(CHOICES)[i].includes("f_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
          GLOBAL_DOM.wheelConfigListIncluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
          // GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
          // GLOBAL_DOM.wheelConfigListExcluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          // GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }
      }else if(Object.keys(CHOICES)[i].includes("s_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
          // GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
          // GLOBAL_DOM.wheelConfigListIncluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          // GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
          GLOBAL_DOM.wheelConfigListExcluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }
      }
    }
  }

  GLOBAL_DOM.wheelConfigPresetFast = document.getElementById("wheel-config-preset-fast");
  GLOBAL_DOM.wheelConfigPresetFast.onclick = () => {
    for(let i = 0; i < Object.keys(CHOICES).length; i++){
      if(Object.keys(CHOICES)[i].includes("b_") || Object.keys(CHOICES)[i].includes("s_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
          GLOBAL_DOM.wheelConfigListIncluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
        }
      }else if(Object.keys(CHOICES)[i].includes("f_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
          GLOBAL_DOM.wheelConfigListExcluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }
      }
    }
  };
  GLOBAL_DOM.wheelConfigPresetBoth = document.getElementById("wheel-config-preset-both");
  GLOBAL_DOM.wheelConfigPresetBoth.onclick = () => {
    for(let i = 0; i < Object.keys(CHOICES).length; i++){
      if(Object.keys(CHOICES)[i].includes("s_") || Object.keys(CHOICES)[i].includes("f_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
          GLOBAL_DOM.wheelConfigListIncluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
        }
      }else if(Object.keys(CHOICES)[i].includes("b_")){
        if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
          console.log("alr here no need to change");
        }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
          console.log("change to included list");
          GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
          GLOBAL_DOM.wheelConfigListExcluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
          GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
        }
      }
    }
  };


  GLOBAL_DOM.wheelConfigListIncluded = document.getElementById("wheel-config-list-included");
  GLOBAL_DOM.wheelConfigListExcluded = document.getElementById("wheel-config-list-excluded");


  for(let i = 0; i < Object.keys(CHOICES).length; i++){
    GLOBAL_DOM.wheelConfigList[i] = document.createElement("div");
    GLOBAL_DOM.wheelConfigList[i].classList.add("config-list");

    GLOBAL_DOM.wheelConfigListTitle[i] = document.createElement("div");
    GLOBAL_DOM.wheelConfigListTitle[i].classList.add("config-list-title");

    GLOBAL_DOM.wheelConfigListRemove[i] = document.createElement("div");
    GLOBAL_DOM.wheelConfigListRemove[i].classList.add("config-list-control");

    GLOBAL_DOM.wheelConfigListRemove[i].onclick = () => {
      if(GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "exclude"){
        GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
        GLOBAL_DOM.wheelConfigListIncluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
        GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
      }else if (GLOBAL_DOM.wheelConfigListRemove[i].innerHTML == "include"){
        GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
        GLOBAL_DOM.wheelConfigListExcluded.removeChild(GLOBAL_DOM.wheelConfigList[i]);
        GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
      }
    };

    let titleContent = document.createTextNode(CHOICES[Object.keys(CHOICES)[i]].name);
    GLOBAL_DOM.wheelConfigListTitle[i].appendChild(titleContent);

    GLOBAL_DOM.wheelConfigList[i].appendChild(GLOBAL_DOM.wheelConfigListTitle[i]);
    GLOBAL_DOM.wheelConfigList[i].appendChild(GLOBAL_DOM.wheelConfigListRemove[i]);

    if(Object.keys(CHOICES)[i].includes("b_")){
      GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
      GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
    }else if(Object.keys(CHOICES)[i].includes("f_")){
      GLOBAL_DOM.wheelConfigListExcluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
      GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "include";
    }else if(Object.keys(CHOICES)[i].includes("s_")){
      GLOBAL_DOM.wheelConfigListIncluded.appendChild(GLOBAL_DOM.wheelConfigList[i]);
      GLOBAL_DOM.wheelConfigListRemove[i].innerHTML = "exclude";
    }
  }

  GLOBAL_DOM.instruction = document.getElementById('instruction');

}

var SKETCHES = {
  play: null,
  spin: null,
  transition: null,
  wheel: null,
  animation: null,
}

var GLOBAL_APP_STATE = {
  timerStartingValue: 10,
  timerValue: 10,
  chosenPie: null,
  filterMode : 0, //0: CHILLOUT 1: WAKE UP 2: CUSTOM
}

var GLOBAL_DOM = {
  wheelCanvas: null,
  animationCanvas: null,
  wheelConfigContainer: null,
  wheelConfigSaveContainer: null,
  wheelConfig: null,
  wheelConfigPresetSlow: null,
  wheelConfigPresetFast: null,
  wheelConfigPresetBoth: null,
  wheelConfigListIncluded: null,
  wheelConfigListExcluded: null,
  wheelConfigList: [],
  wheelConfigListTitle: [],
  wheelConfigListRemove: [],
  // spinContainer
  instruction: null,
}

var CHOICES  = {
  "b_mouse" : {
    name : "Fast / Slow 🐭",
  },
  "b_dog" : {
    name : "Fast / Slow 🐶",
  },
  "b_cat" : {
    name : "Fast / Slow 🐭",
  },
  "b_fish" : {
    name : "Fast / Slow 🐡",
  },
  "b_bird" : {
    name : "Fast / Slow 🐦",
  },
  "b_bunny" : {
    name : "Fast / Slow 🐰",
  },
  "f_mouse" : {
    name : "Fast 🐭",
  },
  "f_dog" : {
    name : "Fast 🐶",
  },
  "f_cat" : {
    name : "Fast 🐭",
  },
  "f_fish" : {
    name : "Fast 🐡",
  },
  "f_bird" : {
    name : "Fast 🐦",
  },
  "f_bunny" : {
    name : "Fast 🐰",
  },
  "s_mouse" : {
    name : "Slow 🐭",
  },
  "s_dog" : {
    name : "Slow 🐶",
  },
  "s_cat" : {
    name : "Slow 🐭",
  },
  "s_fish" : {
    name : "Slow 🐡",
  },
  "s_bird" : {
    name : "Slow 🐦",
  },
  "s_bunny" : {
    name : "Slow 🐰",
  },
}

let animation = ( s ) => {

  // s.imageAssets = {};
  s.APP_STATE = {
    width: null,
    height: null,
    smallerSide: null,
    play: false
  }

  s.img = [];

  s.preload = () => {

    
  }

  s.windowResized = () => {
    s.APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
    s.APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
    if(s.APP_STATE.width > s.APP_STATE.height){
      s.APP_STATE.smallerSide = s.APP_STATE.height;
    }else{
      s.APP_STATE.smallerSide = s.APP_STATE.width;
    }
    s.resizeCanvas(s.APP_STATE.width, s.APP_STATE.height);
  }

  s.loadAsset = (value) => {
    console.log(value);
    let currentKey;
    let directory1,directory2;
    let animal;
    let file = [];

    for(let i = 0; i< Object.keys(CHOICES).length; i++){
      if(CHOICES[Object.keys(CHOICES)[i]].name == value){
        currentKey = Object.keys(CHOICES)[i];
        animal = currentKey.split("_")[1];
        console.log(currentKey);
        break;
      }
    }

    if(currentKey.split("_")[0] == "s"){
      chosenFile1 = "S1.gif"
      chosenFile2 = "S2.gif"
    }else if(currentKey.split("_")[0] == "f"){
      chosenFile1 = "F1.gif"
      chosenFile2 = "F2.gif"
    }else if(currentKey.split("_")[0] == "b"){
      file[0] = "S1.gif"
      file[1] = "F1.gif" 
      file[2] = "S2.gif"
      file[3] = "F2.gif" 
      chosenFile1 = file[s.round(s.random(0,1))];
      chosenFile2 = file[s.round(s.random(2,3))];
    }
    directory1 = "assets/" + animal + "/" + chosenFile1;
    directory2 = "assets/" + animal + "/" + chosenFile2;
    console.log(directory1);

    s.loadImage(directory1, img => {
      // s.image(img, s.width/4, s.height/2, s.width/2, s.height/2);
      s.img[0] = img;
    });
    s.loadImage(directory2, img => {
      // s.image(img, 3 * s.width/4, s.height/2, s.width/2, s.height/2);
      s.img[1] = img;
    });

    // s.img[0] = s.loadImage(directory1);
    // s.img[1] = s.loadImage(directory2);
  }

  s.setup = () => {
    s.APP_STATE.width = document.getElementById('canvas-container').offsetWidth;
    s.APP_STATE.height = document.getElementById('canvas-container').offsetHeight;
    s.createCanvas(s.APP_STATE.width,s.APP_STATE.height);
    s.imageMode(s.CENTER);
  }

  s.draw = () => {
    if(s.play){
      s.image(s.img[0], s.width/4, s.height/2, s.width/2, s.height/2);
      s.image(s.img[1], 3 * s.width/4, s.height/2, s.width/2, s.height/2);
    }else{
      clear();
    }
  }
}

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
        SKETCHES.animation.play = true;
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
        SKETCHES.animation.play = false;

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
          DOM_EL.timer.html(GLOBAL_APP_STATE.timerValue);
          GLOBAL_DOM.instruction.innerHTML = "Spin the wheel to choose an activity"
          document.getElementById("spin-transition").classList.toggle('hidden-right');
          document.getElementById("wheel-transition").classList.toggle('hidden-right');
          document.getElementById("instruction-transition").classList.toggle('hidden-right');
        }, 
        1000, 
        );
        
      }
    }
  } 
  


  
  
  let wheel = ( sketch ) => {
    sketch.pie = [];
  
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
      for(let i = 0; i < sketch.pie.length; i++){
        sketch.pie[i].pX = sketch.APP_STATE.width/2;
        sketch.pie[i].pY = sketch.APP_STATE.height/2;
        sketch.pie[i].radius = sketch.APP_STATE.smallerSide*0.8;
      }
    }

    sketch.createWheel = (index,length,content) => {
      sketch.pie[index] = new Wheel(sketch.width/2,
        sketch.height/2, 
        360 * index / length,
        0,
        360 / length,
        sketch.APP_STATE.smallerSide*0.8,
        content,
        sketch.colors[index % length]);
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
        sketch.pie[i] = new Wheel(sketch.width/2,
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
      for(let i = 0; i < sketch.pie.length; i++){
        sketch.pie[i].rotation = spinValue;
        sketch.pie[i].rotationTarget = spinValueTarget;
      }
    }
    sketch.draw = () => {
      // sketch.background(220);
      sketch.clear();
      tickerDeflection = sketch.lerp(tickerDeflection,0,0.1);
      for(let i = 0; i < sketch.pie.length; i++){
        sketch.pie[i].rotation = sketch.lerp(sketch.pie[i].rotation,sketch.pie[i].rotationTarget,0.02);
        sketch.pie[i].drawPie();
      }
      for(let i = 0; i < sketch.pie.length; i++){
        sketch.pie[i].drawText();
        sketch.pie[i].drawPeg();
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
      if(sketch.APP_STATE.spinStarted && (sketch.abs(sketch.pie[0].rotation - sketch.pie[0].rotationTarget)<1)){
        sketch.APP_STATE.spinStarted = false;
          console.log("spin stopped");
          console.log(GLOBAL_APP_STATE.chosenPie);
          document.getElementById('instruction').innerHTML = "Stand up and get ready!<br><br>Press play when ready!"
          GLOBAL_DOM.wheelCanvas.style.display = "none";
          GLOBAL_DOM.animationCanvas.style.display = "block";
          SKETCHES.animation.loadAsset(GLOBAL_APP_STATE.chosenPie);

          SKETCHES.animation.loadAsset(GLOBAL_APP_STATE.chosenPie);

          document.getElementById("spin-transition").classList.toggle('hidden-right');
          document.getElementById("wheel-transition").classList.toggle('hidden-right');
          document.getElementById("instruction-transition").classList.toggle('hidden-right');


          setTimeout(() => {
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


  SKETCHES.wheel = new p5(wheel,'wheel-canvas');
  SKETCHES.animation = new p5(animation,'animation-canvas');

  let content = new p5(SKETCHES.play);
 

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }







