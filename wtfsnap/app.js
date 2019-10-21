
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
// let yolo;

let objects = [];
var starting = false;

let status;

var videoWidth = 1280;
var videoHeight = 720;

var video2,dataURL;

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
  sampleImage = createImg(sampleImageSrc);
  sampleImage.id("sampleImage");

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  // var ref = document.querySelector('canvas');
  var ref = document.getElementById('canvas');
  video2 = document.getElementById('sampleImage');
  dataUrl = ref.toDataURL();
  video2.src = dataUrl;
// video2 = document.getElementById('sampleImage');
// var stream = ref.captureStream(25);
// video2.srcObject = stream;
  
  // yolo = ml5.YOLO(sampleImage, 
  //   // { filterBoxesThreshold: 0.01, IOUThreshold: 0.3, classProbThreshold: 0.25 },
  //   detect);
  // yolo = ml5.YOLO(video, detect,modelReady);
  prevX = mouseX;
}

function modelReady() {
  console.log("model Ready!")
  status = true;
  setInterval(function(){
    var ref = document.getElementById('canvas');
    video2 = document.getElementById('sampleImage');
    dataUrl = ref.toDataURL();
    video2.src = dataUrl;
    yolo.detect(video2, detect);
    console.log("sampling"); }
    , 300);
  
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

// background(255);
// image(video2, w/2, h/2,w,h);

// if(status){
// sampleImage.loadPixels();
// console.log("image captured");
// sampleImage = canvas.get();

//LOOK INTO CAPTURESTREAM

// var test = document.getElementById('sampleImage');
// var dataURL = test.toDataURL();
// console.log(dataURL);

// background(255);
// tint(0,255,0);
// image(sampleImage,w/2,h/2,w,h);
// sampleImage.updatePixels();
// yolo.detect(sampleImage, detect);
// }

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


// var canvas = document.getElementById("yourCanvasID");
// var url = canvas.toDataURL();

// var newImg = document.createElement("img"); // create img tag
// newImg.src = url;
// document.body.appendChild(newImg); // add to end of your document

// function detect() {
//   yolo.detect(function(err, results) {
//     objects = results;
//     if(objects.length!==0){console.log(objects);}
//     setTimeout(detect, 300);
//   });
// }
// }
function detect(err, results) {
  if (err) {
    console.log(err);
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