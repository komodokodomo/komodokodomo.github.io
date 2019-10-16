
let current;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;



var itemsText = [];

let video;
let yolo;
let objects = [];
var starting = false;


var videoWidth = 1280;
var videoHeight = 720;

var w,h;

var sample = false;
var mode = 0;

function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();

  var enumeratorPromise = navigator.MediaDevices.getUserMedia.enumerateDevices();
  console.log(enumeratorPromise);


  yolo = ml5.YOLO(video, 
    // { filterBoxesThreshold: 0.01, IOUThreshold: 0.3, classProbThreshold: 0.25 },
    detect);
  prevX = mouseX;


}

var constraints = {
    video: {
      facingMode: { exact: "environment" },
      width: videoWidth,
      height: videoHeight,
      // deviceId: d5f0ac88e4e42b8c4269af9754813647c84b0c6a4d6e266a41ad50d1a1c46c7c
    },
    audio: false
  };

function draw() {
 background(255);
 imageMode(CENTER);
//  checkSwipe();
 image(video, w/2, h/2, h*videoWidth/videoHeight, h);
}


function detect() {
  yolo.detect(function(err, results) {
    objects = results;
    if(objects.length!==0){console.log(objects);}
    detect();
  });
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