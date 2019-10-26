var jsonData;

let current;
let cameras = "";
let density;

let canvas;

var lensContainer, lensList;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;

var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};

var itemsText = [];

let video;

let objects = [];
var starting = false;

let status;

var videoWidth = 1280;
var videoHeight = 720;

var w,h;

var mode = 0;

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

function setup() {
  console.log(jsonData);

  w = window.innerWidth;
  h = window.innerHeight;

  density = pixelDensity();
  console.log("width: " + w + " height: " + h + " pixelDensity: " + pixelDensity());

  canvas = createCanvas(w, h);
  canvas.id("canvas");

  lensContainer = createDiv();
  lensContainer.id("lensContainer")

  lensList = createElement("ul");
  lensList.id("lensList")

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  var test = document.getElementById('canvas');

  cocoSsd.load().then(model => {
    console.log("model loaded!");
    status = true;
    setInterval(function(){
      model.detect(test).then(predictions => {
        if(predictions.length > 0){  
        objects = [];
        for (let i = 0; i < predictions.length; i++) {
          objects[i]=predictions[i];
        }
      }
      });
    }
      , 200);

  });

  prevX = mouseX;
}

/* 
<div id="lens-container">
<ul id="lens-list">
<li></li>
<li></li>
<li></li>
<li></li>
</ul>
</div>

<div id="related-content-container">
<h2 id="object-label"></h2>
<p id="content"></p>
<span id="trying">Trying to identify...</span>
</div> 
*/


function preload(){
  let url = 'https://api.sheety.co/b440651f-ff2f-4d19-8698-6ae801475966';
  jsonData = loadJSON(url);
}

function draw() {
 background(255);
 imageMode(CENTER);

if(w>h){
 image(video, w/2, h/2, h*videoWidth/videoHeight, h);
//  image(video, w/2, h/2, w, w*videoHeight/videoWidth);

}
else{
// image(video, w/2, h/2,w,h);
image(video, w/2, h/2, w, w*h/videoWidth);
}


 fill(0);
 noStroke();
 text(frameRate(),30,30);
 text(cameras,30,50);
 text(w + " x " +h,30,70);
 if(status){
text("model loaded",30,90);
 }

 
 for(var i=0; i<objects.length ;i++){
  rectMode(CORNER);
  stroke(0,255,0);
  strokeWeight(5);
  noFill();
  rect(objects[i].bbox[0]/density,objects[i].bbox[1]/density,objects[i].bbox[2]/density,objects[i].bbox[3]/density);
}

}


function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
}


function touchStarted(){
 if(!starting){
    starting = true;
    fullscreen(true);
}
prevX = mouseX;
}

function touchMoved(event) {
    swipeTimer = millis();
    swipeDisplacement+=(mouseX - prevX);
    prevX = mouseX;
}

function checkSwipe(){

  if( millis() - swipeTimer > 400){
    if(swipeDisplacement>50){mode++;console.log("right");}
    else if(swipeDisplacement<-50){mode--;console.log("left");}
    if(mode<0){mode = 2;}
    if(mode>2){mode=0;}
    swipeDisplacement = 0;
    }

}