
let current;
let cameras = "";

let sampleImage,sampleImageSrc = "";
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
      console.log(cameras);
    console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
              }
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

function setup() {

  w = window.innerWidth;
  h = window.innerHeight;
  canvas = createCanvas(w, h);
  canvas.id("canvas");
  sampleImage = createVideo(sampleImageSrc);
  sampleImage.id("sampleImage");
  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  
  // yolo = ml5.YOLO(sampleImage, 
  //   // { filterBoxesThreshold: 0.01, IOUThreshold: 0.3, classProbThreshold: 0.25 },
  //   detect);
  // yolo = ml5.YOLO(sampleImage, detect,modelReady);
  prevX = mouseX;
}

function modelReady() {
  console.log("model Ready!")
  status = true;
  // yolo.detect(sampleImage, detect);
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

var ref = document.querySelector('canvas');
var video = document.getElementById('sampleImage');
var stream = ref.captureStream(25);
video.srcObject = stream;

if(status){
// sampleImage.loadPixels();
// console.log("image captured");
// sampleImage = canvas.get();

//LOOK INTO CAPTURESTREAM

var test = document.getElementById('sampleImage');
var dataURL = test.toDataURL();
console.log(dataURL);

// background(255);
// tint(0,255,0);
// image(sampleImage,w/2,h/2,w,h);
// sampleImage.updatePixels();
// yolo.detect(sampleImage, detect);
}

 fill(0);
 noStroke();
 text(frameRate(),30,30);
 text(cameras,30,50);

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


// function detect() {
//   yolo.detect(function(err, results) {
//     objects = results;
//     if(objects.length!==0){console.log(objects);}
//     setTimeout(detect, 200);
//   });
// }

function detect(err, results) {
  if (err) {
    console.log(err);
  }
  console.log(results)
  objects = results;
  // setTimeout(yolo.detect(sampleImage, detect), 200);
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