var jsonData,jsonDataLength;

var subjects = [];

let button;

let current;
let cameras = "";
let density;

let counter = 0;

let maxBoxes = 1;

let canvas;

var lensContainer, lensList, contentContainer, contentLabel, contentText, contentTrying, contentFrame;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;
// var test;
var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};

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

// window.addEventListener('DOMContentLoaded', (event) => {
//   console.log('DOM fully loaded and parsed');
// });

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


function doSomething(){
  console.log("subject chosen");
}

function trigger() {
  console.log('uxRect just got clicked!');
  lensContainer.style("display","flex");
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

  lensContainer = createDiv();
  lensContainer.size(w,h/10);
  lensContainer.position(0,9*h/10);
  lensContainer.id("lens-container")
  lensContainer.hide();

  lensList = createElement("ul");
  lensList.parent(lensContainer);
  lensList.id("lens-list");
  lensList.style("height","100%");

  contentContainer = createDiv();
  contentContainer.size(w,h/2);
  contentContainer.position(0,4*h/10);
  contentContainer.id("related-content-container");

  contentLabel = createElement("h2");
  contentLabel.id("object-label");
  contentLabel.parent(contentContainer);

  contentText = createP();
  contentText.id("content");
  contentText.parent(contentContainer);

  contentTrying = createSpan("Trying to identify...");
  contentTrying.id("trying");
  contentTrying.parent(contentContainer);

  button = createDiv();
  button.mouseClicked(trigger);
  button.size(0,0);
  button.position(0,0);
  button.style("border-style","dashed");
  button.style("border-radius","50%");
  button.style("border-color","white");
  button.style("border-width","0.3rem");
  button.style("background-color","transparent");
  button.hide();

  for(let i = 0; i<jsonDataLength; i++){
    subjects[i] = createElement("li",jsonData[i].subject);
    subjects[i].parent(lensList);
    subjects[i].id("li"+i.toString());
    document.getElementById("li"+i.toString()).onclick = function(){
      console.log("you clicked: " + i.toString());
      for(let j = 0; j<jsonDataLength; j++){
        document.getElementById("li"+j.toString()).classList.remove("active");
      }
      document.getElementById("li"+i.toString()).classList.add("active");
    };
    // subjects[i].style("display","inline");
    // subjects[i].show();
  }

//   <div id="related-content-container">
//   <h2 id="object-label"></h2>
//   <p id="content"></p>
//   <span id="trying">Trying to identify...</span>
// </div>


  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();
  var test = document.getElementById("canvas");


  cocoSsd.load().then(model => {
    console.log("model loaded!");
    status = true;

    setInterval(function(){
      // console.log(test);

      model.detect(test,maxBoxes).then(predictions => {
        console.log(predictions);
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
        button.hide();
        lensContainer.hide();
      }
      });
    }
    , 200);
  }
  );

}


function draw() {
 background(255);
 imageMode(CENTER);

if(w>h){
if((w/h)>(video.width/video.height))
{
  image(video, w/2, h/2, w, w*video.height/video.width);
}
else{
  image(video, w/2, h/2, h*video.width/video.height, h);
}
//  image(video, w/2, h/2, w, w*videoHeight/videoWidth);

}
else{
// image(video, w/2, h/2,w,h);
image(video, w/2, h/2, w, (w/video.height)*video.width);
// image(video, w/2, h/2, w, w*h/videoWidth);
}


 fill(0);
 noStroke();
 text(frameRate(),30,30);
 text(cameras,30,50);
 text("display: " + w + " x " +h,30,70);
 text("cam: " + video.width + " x " +video.height,30,90);
 if(status){
 text("model loaded",30,110);
 }

//  console.log(objects.length);
 for(var i=0; i<objects.length ;i++){

  if(counter > 0){
  let lerpX = lerp(objects[i].bbox[0]/density,prevX,0.3);
  let lerpY = lerp(objects[i].bbox[1]/density,prevY,0.3);
  let lerpW = lerp(objects[i].bbox[2]/density,prevW,0.3);
  let lerpH = lerp(objects[i].bbox[3]/density,prevH,0.3);
  if(lerpW>lerpH){ //W>H
    button.size(lerpW,lerpW);
  }
  else{
    button.size(lerpH,lerpH);
  }
  button.position(lerpX,lerpY);
  }

  else{
  // console.log("drawing");
  if(objects[i].bbox[2]/density>objects[i].bbox[3]/density){ //W>H
    button.size(objects[i].bbox[2]/density,objects[i].bbox[2]/density);
  }
  else{
    button.size(objects[i].bbox[3]/density,objects[i].bbox[3]/density); //H>W
  }
  // button.size(objects[i].bbox[2]/density,objects[i].bbox[3]/density);  //default
  button.position(objects[i].bbox[0]/density,objects[i].bbox[1]/density);
  }

  prevX = objects[i].bbox[0]/density;
  prevY = objects[i].bbox[1]/density;
  prevW = objects[i].bbox[2]/density;
  prevH = objects[i].bbox[3]/density;

  button.show();
  rectMode(CORNER);
  stroke(0,255,0);
  strokeWeight(5);
  noFill();
  // button = uxRect(objects[i].bbox[0]/density,objects[i].bbox[1]/density,objects[i].bbox[2]/density,objects[i].bbox[3]/density);
  // button.uxEvent("click",trigger);
  // button.uxRender();
  // rect(objects[i].bbox[0]/density,objects[i].bbox[1]/density,objects[i].bbox[2]/density,objects[i].bbox[3]/density);
}

}


function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
    lensContainer.size(w,h/10);
    lensContainer.position(0,9*h/10);
}


// function touchStarted(){
//  if(!starting){
//     starting = true;
//     fullscreen(true);
// }
// prevX = mouseX;
// }

// function touchMoved(event) {
//     swipeTimer = millis();
//     swipeDisplacement+=(mouseX - prevX);
//     prevX = mouseX;
// }

// function checkSwipe(){

//   if( millis() - swipeTimer > 400){
//     if(swipeDisplacement>50){mode++;console.log("right");}
//     else if(swipeDisplacement<-50){mode--;console.log("left");}
//     if(mode<0){mode = 2;}
//     if(mode>2){mode=0;}
//     swipeDisplacement = 0;
//     }

// }