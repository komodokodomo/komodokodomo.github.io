var filters = ["physics","chemistry","math"];
var objects = ["teddy bear","keyboard","clock"];

let video;
let yolo;
// let objects = [];
var starting = false;

var videoWidth = 1280;
var videoHeight = 720;

var w,h;

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
//   if((w/h)<(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w, h*w/videoWidth);
//     }
//   else if((w/h)>(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w*h/videoHeight, h);
//   }
  image(video, w/2, h/2, h*videoWidth/videoHeight, h);
  for (let i = 0; i < objects.length; i++) {
    noStroke();
    fill(255);
    textAlign(CENTER,CENTER);
    text(objects[i].label, objects[i].x * width, objects[i].y * height - 5);
    noFill();
    strokeWeight(8);
    stroke(255);
    rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
  }
}

function startDetecting() {
  detect();
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
}