

let video;
let yolo;
let objects = [];
var starting = false;

var videoWidth = 1280;
var videoHeight = 720;

var w,h;

function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  video = createCapture(constraints);
  video.size(1280, 1080);
  video.hide();


  yolo = ml5.YOLO(video, startDetecting);

}

var constraints = {
    video: {
      facingMode: { exact: "environment" },
      width: videoWidth,
      height: videoHeight
    },
    audio: false
  };

function draw() {
  imageMode(CENTER);
//   if((w/h)>(videoWidth/videoHeight)){image(video, w/2, h/2, w, h*w/videoWidth);}
//   else{image(video, w/2, h/2, w*h/videoHeight, h);}
  image(video, w/2, h/2, w, h*w/videoWidth);}
  for (let i = 0; i < objects.length; i++) {
    // noStroke();
    // fill(0, 255, 0);
    // text(objects[i].label, objects[i].x * width, objects[i].y * height - 5);
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
    console.log(objects);
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