

let video;
let yolo;
let objects = [];
var starting = false;

var w,h;

function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  video = createCapture(constraints);
  video.size(1920, 1080);
  video.hide();


  // Create a YOLO method
  yolo = ml5.YOLO(video, startDetecting);

}

var constraints = {
    video: {
      facingMode: { exact: "environment" },
      width: 1920,
      height: 1080
    },
    audio: false
  };

function draw() {
  imageMode(CENTER);
  image(video, w/2, h/2, 1920, 1080);
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