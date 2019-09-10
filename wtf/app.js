var filters = ["physics","chemistry","math"];
var items = ["teddy bear","keyboard","clock"];

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;
// var prevY = 0;


var itemsText = [];

let video;
let yolo;
let objects = [];
var starting = false;

var alpha = 255;

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
  var enumeratorPromise = navigator.mediaDevices.enumerateDevices();
  console.log(enumeratorPromise);


  yolo = ml5.YOLO(video, startDetecting);
  prevX = mouseX;

}

var constraints = {
    video: {
      facingMode: { exact: "environment" },
      width: videoWidth,
      height: videoHeight,
      deviceId: d5f0ac88e4e42b8c4269af9754813647c84b0c6a4d6e266a41ad50d1a1c46c7c
    },
    audio: false
  };

function draw() {
 background(255);
  imageMode(CENTER);
  if( millis() - swipeTimer > 400){
    if(swipeDisplacement>50){mode++;console.log("right");}
    else if(swipeDisplacement<-50){mode--;console.log("left");}
    mode = constrain(mode,0,2);
    swipeDisplacement = 0;
    }
//   if(frameCount%3 == 0){sample = true;}
//   if((w/h)<(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w, h*w/videoWidth);
//     }
//   else if((w/h)>(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w*h/videoHeight, h);
//   }
  image(video, w/2, h/2, h*videoWidth/videoHeight, h);


  fill(255,100);
  noStroke();
  rectMode(CENTER);
  rect(w/2, h/20, w/5, h/10);
  fill(30);
  textAlign(CENTER,CENTER);
  textStyle(BOLD);
  textSize(24);
  text(filters[mode],w/2,h/20);

  fill(255,20);
  noStroke();
  rectMode(CENTER);
  rect(w/2, h/2, w-100, h-30);


  for (let i = 0; i < objects.length; i++) {
    // if(objects[i].label == "person"  || objects[i].label == "keyboard" || objects[i].label == "bottle" || objects[i].label == "teddy bear"){
    if(objects[i].w > 0.3 && objects[i].h > 0.3) {
    noStroke();
    fill(255,alpha);
    textAlign(CENTER,CENTER);
    textStyle(BOLD);
    textSize(32);
    text(objects[i].label, objects[i].x * width + objects[i].w * width/2, objects[i].y * height + objects[i].h * height/2);
 
    noFill();
    strokeWeight(8);
    stroke(255,alpha);
    // ellipseMode(CENTER);
    rectMode(CORNER);
    rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    // ellipse(objects[i].x * width+ objects[i].w * width/2, objects[i].y * height+ objects[i].h * height/2, objects[i].w * width/2, objects[i].w * width/2);
    }
    }
//   }
}

function startDetecting() {
  detect();
}

function detect() {
//   if(sample){
  yolo.detect(function(err, results) {
    objects = results;
    if(objects.length!==0){console.log(objects);}
    detect();
  });
// }
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
}

function touchMoved(event) {
    swipeTimer = millis();
    // if(swipeTimer - millis)
    swipeDisplacement+=(mouseX - prevX);
    prevX = mouseX;
    // console.log(event);
}