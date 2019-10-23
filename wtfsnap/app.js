
let current;
let cameras = "";

let sampleImage;
let canvas,clone;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;

var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false

};

var itemsText = [];

let video;
let yolo = ml5.YOLO(modelReady);
// let yolo;

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

  w = window.innerWidth;
  h = window.innerHeight;

  canvas = createCanvas(w, h);
  canvas.id("canvas");
  sampleImage = createImage(w,h);

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  sampleImage = createImage(w,h);

  prevX = mouseX;
}

function modelReady() {
  console.log("model Ready!")
  status = true;
  setInterval(function(){
    yolo.detect(sampleImage.ImageData, detect);
    console.log("sampling"); }
    , 500);
}



function draw() {
 background(255);
 imageMode(CENTER);

if(w>h){
 image(video, w/2, h/2, h*videoWidth/videoHeight, h);
}
else{
image(video, w/2, h/2,w,h);
}

// sampleImage.loadPixels();
sampleImage = video.get();
// sampleImage.updatePixels();

 fill(0);
 noStroke();
 text(frameRate(),30,30);
 text(cameras,30,50);
 if(status){
  text("model loaded",30,70); 
 }

 for (let i = 0; i < objects.length; i++) {
  noStroke();
  fill(0, 255, 0);
  text(objects[i].label, objects[i].x * width, objects[i].y * height - 5);
  noFill();
  strokeWeight(4);
  stroke(0, 255, 0);
  rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
}
}


function detect(err, results) {
  if (err) {
    console.error(err);
  }
  if(results.length!==0)
  {
    console.log(results);
    objects = results;
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
    // console.log(event);
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