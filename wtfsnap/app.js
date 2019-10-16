
let current;
let cameras = "";

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;

var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false

};

var itemsText = [];

let video;
let yolo;
let objects = [];
var starting = false;


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
  createCanvas(w, h);

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  
  yolo = ml5.YOLO(video, 
    // { filterBoxesThreshold: 0.01, IOUThreshold: 0.3, classProbThreshold: 0.25 },
    detect);
  prevX = mouseX;


}



function draw() {
 background(255);
 imageMode(CENTER);
//  checkSwipe();
 image(video, w/2, h/2, h*videoWidth/videoHeight, h);
 text(frameRate(),30,30);
 text(cameras,30,50);
}


function detect() {
// if(millis() - sampleTimer > 300){
  yolo.detect(function(err, results) {
    objects = results;
    if(objects.length!==0){console.log(objects);}
    setTimeout(detect, 200);
  });
// }
// else{detect();}
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