var jsonData,jsonDataLength;

var classToExplore = "";
var jsonDataIndex;

var subjects = [];

let button,hideButton = false;
let buttonSizeRatio = 1.0;
let buttonClick;

let loginStatus = false;

let current;
let cameras = "";
let density;

let counter = 0;
let swipeX = null;
let screenToggle,screenToggle2;
let loginWrapper, onboardingFlow;
let currScreen = 0;

let maxBoxes = 1;

let canvas;

var lerpValue = 0.3;

var rounded = false;

var lensContainer, lensList, contentContainer, contentLabel, contentText, contentTrying, contentFrame, contentClose;
var lensNumber;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;

var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};


let debug = false;

var itemsText = [];
let video;

var prevX,prevY,prevW,prevH;

let objects = [];
var starting = false;

let status;

var videoWidth = 1280;
var videoHeight = 720;

var w,h;

var mode = 0;

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loginWrapper = document.getElementsByClassName('login')[0];
  onboardingFlow = document.getElementsByClassName('onboarding')[0];
  skipButtons = document.getElementsByClassName('skip-button');
  onboardingScreenArr = document.getElementsByClassName('onboarding-screen');
  contentContainer = document.getElementById("related-content-container");
  lensContainer = document.getElementById("lens-container");
  triggerButton = document.getElementById("trigger-button");
  contentFrame = document.getElementById("content-frame");

  onboardingFlow.addEventListener('touchstart', lock, false);
  onboardingFlow.addEventListener('touchend', move, false);
  onboardingFlow.addEventListener('click', clickHandler, false);

  triggerButton.addEventListener('click', trigger, false);

  // onboardingFlow.addEventListener("click", swipeHandler, false);
  for (let i = 0; i < skipButtons.length; i++) {
    skipButtons[i].addEventListener("click", skipHandler, false);
  }
});

var enumeratorPromise = navigator.mediaDevices.enumerateDevices().then(function(devices) {
  devices.forEach(function(device) {
    if(device.kind == "videoinput"){
      cameras += device.label;
      cameras += "***";  
    }
  });
  console.log(cameras);
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

function preload(){
  let url = 'https://api.sheety.co/b440651f-ff2f-4d19-8698-6ae801475966';
  jsonData = loadJSON(url);
}

function trigger() {
  console.log('button clicked!');
  lensContainer.style("display","flex");
  contentContainer.style("display","flex");
  contentContainer.classList.add("active");
  
  triggerButton.css("display", "none");
  hideButton = true;
  classToExplore = objects[0].class;
  contentLabel.html(classToExplore);
  if(lensNumber == undefined){
    contentText.html("choose a lens to start exploring!");
  }
  else{
      contentText.html(lensNumber.toString());
  }
  console.log(objects[0].class);
}

function loginHandler(el) {
  loginStatus = true;
  loginWrapper.setAttribute("style", "display: none;");
  onboardingFlow.setAttribute("style", "display: flex;");
}

function lock(e) {
  e.changedTouches ? swipeX = e.changedTouches[0].clientX : swipeX = e.clientX;
}

function move(e) {
  if (swipeX || swipeX === 0) {
    var dx = null;
    e.changedTouches ? dx = e.changedTouches[0].clientX - swipeX : e.clientX - swipeX;
    let s = Math.sign(dx);
    if (s > 0 && currScreen !== 0) {
      // swipe right
      onboardingScreenArr[currScreen - 1].setAttribute("style", `transform: translateX(0px);`);
      currScreen--;
    } else if (s < 0 && currScreen !== onboardingScreenArr.length - 1) {
      // swipe left
      onboardingScreenArr[currScreen].setAttribute("style", `transform: translateX(-${window.innerWidth}px);`);
      currScreen++;
    }
  }
  preventDefault();
}

function clickHandler() {
  if (currScreen === onboardingScreenArr.length - 1) {
    onboardingFlow.setAttribute("style", "display: none;");
    return
  }
  onboardingScreenArr[currScreen].setAttribute("style", `transform: translateX(-${window.innerWidth}px);`);
  currScreen++;
}

function skipHandler() {
  onboardingFlow.setAttribute("style", "display: none;");
}

function startHandler() {
  onboardingFlow.setAttribute("style", "display: none;");
  // reset translates
  for (let i = 0; i < onboardingScreenArr.length; i++) {
    onboardingScreenArr[i].setAttribute("style", `transform: translateX(0px);`);
  }
}

function toggleScreen() {
  fullscreen(true);
  console.log("fullscreen");
  screenToggle.setAttribute("display", "none");
  // screenToggle2.show(); 
}

function toggleScreen2() {
  fullscreen(false);
  console.log("non-fullscreen");
  screenToggle.setAttribute("display", "block");
  screenToggle2.setAttribute("display", "none");
}

function closeContent(){
  contentContainer.classList.remove("active");
  contentContainer.setAttribute("display", "none");
  lensContainer.setAttribute("display", "none");
  hideButton = false;
  lensNumber = undefined;
  contentFrame.setAttribute("display", "none");
}

function setup() {
  console.log(jsonData);
  jsonDataLength = Object.keys(jsonData).length;
  
  w = window.innerWidth;
  h = window.innerHeight;

  density = pixelDensity();
  console.log("width: " + w + " height: " + h + " pixelDensity: " + pixelDensity());

  canvas = createCanvas(w, h);
  canvas.id("canvas");

  contentLabel = createElement("h2");
  contentLabel.id("object-label");
  contentLabel.parent(contentContainer);

  contentText = createP();
  contentText.id("content");
  contentText.parent(contentContainer);

  contentClose = createA('#', '');
  contentClose.parent(contentContainer);
  contentClose.class('close');
  contentClose.mouseClicked(closeContent);

  lensList = createElement("ul");
  lensList.parent(lensContainer);
  lensList.id("lens-list");
  lensList.style("height","100%");

  buttonClick = createImg("300ppi/click.png","click me");
  buttonClick.parent(triggerButton);
  buttonClick.style("width","20%");
  buttonClick.style("position","absolute");
  buttonClick.style("top","50%");
  buttonClick.style("left","50%");
  buttonClick.style("transform", "translate(-50%, -50%)");

  for(let i = 0; i<jsonDataLength; i++){
    subjects[i] = createElement("li",jsonData[i].subject);
    subjects[i].parent(lensList);
    subjects[i].id("li"+i.toString());

    if (i === jsonDataLength - 1) {
      // Students tab
      addContentButton = createElement("button", "Add your own");
      addContentButton.parent(contentContainer);
      addContentButton.id("add-content");
    }

    document.getElementById("li"+i.toString()).onclick = function(){
      console.log("you clicked: " + i.toString());
      lensNumber = i;
      for(let j = 0; j<jsonDataLength; j++){
        document.getElementById("li"+j.toString()).classList.remove("active");
      }
      document.getElementById("li"+i.toString()).classList.add("active");
      if(hideButton){
        if(jsonData[lensNumber][objects[0].class]!== null){
          let stuff = jsonData[lensNumber][objects[0].class].toString();
          let stuffs = stuff.split("\\");
          let things = "";

          if(stuffs.length>0){
          for(var k=0; k<stuffs.length; k++){
            // let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\" onclick=\"loadIFRAME(event, this)\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
            let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
            things += addon;
          }
          console.log("split success");
          console.log(stuffs[0].split("(")[0]);
          console.log(stuffs[0].split("(")[1].split(")")[0]);
        }
          //  let testing = "<a href=\""+ stuffs[0].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[0].split("(")[0] + "</a>";
          console.log(things); 
          //  stuff = stuff.replace('\\','<br><br>');
          contentText.html(things);
        } else {
          contentText.html("no content for now...");
        }
      }
    };
  }

  screenToggle = createImg("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1N9_nJChavTNQ6FTE4fEIfV5NcPc4yvVn",'toggle fullscreen');
  screenToggle.style("width","16px");
  screenToggle.style("height","16px");
  // screenToggle.style("left","32px");
  // screenToggle.style("top","32px");
  // screenToggle.size(w/16,w/16);
  screenToggle.position(16,16);
  screenToggle.mouseClicked(toggleScreen);

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();
  var test = document.getElementById("canvas");

  cocoSsd.load().then(model => {
    console.log("model loaded!");
    status = true;

    setInterval(function() {

      if(!hideButton) {
        model.detect(test,maxBoxes).then(predictions => {
          // console.log(predictions);
          objects = [];
          if(predictions.length > 0){
          counter++;
          if(counter>2){counter=2;}
          for (let i = 0; i < predictions.length; i++) {
            objects[i]=predictions[i];
          }
        }
        else{
          counter = 0;
          triggerButton.setAttribute("display", "none");
        }
        });
      }
    }, 250);
  });
}

function draw() {
  if(!loginStatus){
    background(215);
  } else {
    background(255);
    imageMode(CENTER);

    if (w>h) {
      if((w/h)>(video.width/video.height)) {
        image(video, w/2, h/2, w, w*video.height/video.width);
      } else {
        image(video, w/2, h/2, h*video.width/video.height, h);
      }
    } else {
      if((videoHeight/videoWidth)<(w/h)) {
        image(video, w/2, h/2, w, (w/videoHeight)*videoWidth);
      } else {
        image(video, w/2, h/2, (h/videoWidth)*videoHeight, h);
      }
    }

    if(debug){
      fill(0);
      noStroke();
      text(frameRate(),30,30);
      text(cameras,30,50);
      text("display: " + w + " x " +h,30,70);
      text("cam: " + video.width + " x " +video.height,30,90);
      if(status){
        text("model loaded",30,110);
      }
    }

    for(var i=0; i<objects.length ;i++){
      if(abs(objects[i].bbox[0]/density - prevX)>50){counter = 0;}
      if(abs(objects[i].bbox[1]/density - prevY)>50){counter = 0;}

      if(counter > 0){
        let lerpX = lerp(objects[i].bbox[0]/density,prevX,lerpValue);
        let lerpY = lerp(objects[i].bbox[1]/density,prevY,lerpValue);
        let lerpW = lerp(objects[i].bbox[2]/density,prevW,lerpValue);
        let lerpH = lerp(objects[i].bbox[3]/density,prevH,lerpValue);

        button.size(lerpW*buttonSizeRatio,lerpH*buttonSizeRatio);
        button.position(lerpX+(lerpW*(1-buttonSizeRatio))/2,lerpY+(lerpH*(1-buttonSizeRatio))/2);
      } else {
        button.size(objects[i].bbox[2]*buttonSizeRatio/density,objects[i].bbox[3]*buttonSizeRatio/density);  //default
        button.position(objects[i].bbox[0]/density+(objects[i].bbox[2]/density*(1-buttonSizeRatio))/2   ,objects[i].bbox[1]/density+(objects[i].bbox[3]/density*(1-buttonSizeRatio))/2);
      }

      prevX = objects[i].bbox[0]/density;
      prevY = objects[i].bbox[1]/density;
      prevW = objects[i].bbox[2]/density;
      prevH = objects[i].bbox[3]/density;

      if(hideButton == false){
        triggerButton.css("display", "block");
      }

      rectMode(CORNER);
      stroke(0,255,0);
      strokeWeight(5);
      noFill();
    }
  }
}

function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
    lensContainer.size(w,h/10);
    lensContainer.position(0,9*h/10);
    contentContainer.size(w,9*h/10);
}


