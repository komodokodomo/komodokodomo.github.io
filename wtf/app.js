var filters = ["physics","chemistry","math"];
var items = ["teddy bear","keyboard","clock"];
var itemText = 
[
    ["physics relevant topic","physics relevant topic","physics relevant topic"],
    ["chemistry relevant topic","chemistry relevant topic","chemistry relevant topic"],
    ["math relevant topic","math relevant topic","math relevant topic"]
];


var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;

var padding = 30;
// var prevY = 0;


var itemsText = [];

let video;
let yolo;
let objects = [];
var starting = false;

var alpha = 255;

var videoWidth = 1920;
var videoHeight = 1080;

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


  yolo = ml5.YOLO(video, 
    // { filterBoxesThreshold: 0.01, IOUThreshold: 0.3, classProbThreshold: 0.25 },
    startDetecting);
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
    if(objects.length == 0){
     var fader = (sin(frameCount) + 1)*255/2;
     fill(0,fader);
     text("point at objects to begin",w/2,h/2);   
    }

  if( millis() - swipeTimer > 400){
    if(swipeDisplacement>50){mode++;console.log("right");}
    else if(swipeDisplacement<-50){mode--;console.log("left");}
    mode = constrain(mode,0,2);
    swipeDisplacement = 0;
    }
//   if(frameCount%5 == 0){detect();}
//   if((w/h)<(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w, h*w/videoWidth);
//     }
//   else if((w/h)>(videoWidth/videoHeight))
//   {
//       image(video, w/2, h/2, w*h/videoHeight, h);
//   }
//   image(video, w/2, h/2, h*videoWidth/videoHeight, h);
image(video, w/2, h/2, h*videoWidth/videoHeight, h);


  fill(255,200);
  noStroke();
  rectMode(CENTER);
  rect(w/2, h/20 + padding/2, w/5, h/10,0,0,5,5);
  fill(30);
  textAlign(CENTER,CENTER);
  textStyle(BOLD);
  textSize(24);
  text(filters[mode],w/2,h/20 + padding/2);

  stroke(255);
  strokeWeight(8);
  fill(255,20);
//   noStroke();
  rectMode(CENTER);
  rect(w/2, h/2, w-150, h-padding,30);

  rect(0, h/2, 45, h-padding,30);
  rect(w, h/2, 45, h-padding,30);

//   function check(age) {
//     return age == 10;
//   }

  for (let i = 0; i < objects.length; i++) {
    if(objects[i].label == "keyboard" || objects[i].label == "bottle" || objects[i].label == "teddy bear"){
    if(objects[i].w * objects[i].h > 0.12) {
    noStroke();
    fill(255,alpha);
    textAlign(CENTER,CENTER);
    textStyle(BOLD);
    textSize(32);
    text(objects[i].label, objects[i].x * width + objects[i].w * width/2, objects[i].y * height + objects[i].h * height/2);
    
    // itemText[mode].findIndex(check);
    textStyle(ITALIC);
    textSize(16);
    if((w - (objects[i].x * w + objects[i].w * width))>w/5)   /// RIGHT
    {
        rectMode(CENTER);
        strokeWeight(2);
        stroke(255);
        // noFill();
        fill(255,alpha);
        line((objects[i].x * width + objects[i].w * width)+w/10,   objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3,   objects[i].x * w + objects[i].w *7*w/8 ,   objects[i].y*height + objects[i].h *h/3 - objects[i].h/8);
        line((objects[i].x * width + objects[i].w * width)+w/10,   objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3,   objects[i].x * w + objects[i].w *7*w/8 ,   objects[i].y*height + objects[i].h *2*h/3 - objects[i].h/8);
        rect((objects[i].x * width + objects[i].w * width)+w/10,   objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3,w/6,h/12,5);
        rect((objects[i].x * width + objects[i].w * width)+w/10,   objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3,w/6,h/12,5);
        noStroke();
        fill(20);
        text(itemText[mode][0], (objects[i].x * width + objects[i].w * width)+w/10, objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3);
        text(itemText[mode][0], (objects[i].x * width + objects[i].w * width)+w/10, objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3);
    }
    if(objects[i].x * w>w/5) // LEFT
    {
        rectMode(CENTER);
        strokeWeight(2);
        stroke(255);
        // noFill();
        fill(255,alpha);
        line(objects[i].x * w - w/10,    objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3,   objects[i].x * w + objects[i].w *w/8,   objects[i].y*height + objects[i].h *h/3 + objects[i].h/8);
        line(objects[i].x * w - w/10,    objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3,   objects[i].x * w + objects[i].w *w/8,   objects[i].y*height + objects[i].h *2*h/3 + objects[i].h/8);
        rect(objects[i].x * w - w/10, objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3,w/6,h/12,5);
        rect(objects[i].x * w - w/10, objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3,w/6,h/12,5);
        noStroke();
        fill(20);
        text(itemText[mode][0], objects[i].x * w - w/10, objects[i].y * h + objects[i].h * h/2 - objects[i].h * h/3);
        text(itemText[mode][0], objects[i].x * w - w/10, objects[i].y * h + objects[i].h * h/2 + objects[i].h * h/3); 
    }
    if(h - (objects[i].y * h + objects[i].h * h)>h/10)  //BOT
    {
        rectMode(CENTER);
        strokeWeight(2);
        stroke(255);
        fill(255,alpha);
        // noFill();
        line(3*w/10+50, objects[i].y * h + objects[i].h * h+h/20,objects[i].x * w + objects[i].w * w/3, objects[i].y * h + objects[i].h * 7*h/8);
        line(7*w/10-50, objects[i].y * h + objects[i].h * h+h/20,objects[i].x * w + objects[i].w * 2*w/3, objects[i].y * h + objects[i].h * 7*h/8);
        rect(3*w/10+50, objects[i].y * h + objects[i].h * h+h/20,w/6,h/12,5);
        rect(7*w/10-50, objects[i].y * h + objects[i].h * h+h/20,w/6,h/12,5);
        noStroke();
        fill(20);
        text(itemText[mode][0], 3*w/10+50, objects[i].y * h + objects[i].h * h+h/20);
        text(itemText[mode][0], 7*w/10-50, objects[i].y * h + objects[i].h * h+h/20);
    }
    if(objects[i].y*h>h/10)  //TOP
    {
        rectMode(CENTER);
        strokeWeight(2);
        stroke(255);
        fill(255,alpha);
        // noFill();
        line(3*w/10+50,   objects[i].y*h - h/20,  objects[i].x * w + objects[i].w * w/3, objects[i].y * h + objects[i].h * h/8);
        line(7*w/10-50,   objects[i].y*h - h/20,  objects[i].x * w + objects[i].w * 2*w/3, objects[i].y * h + objects[i].h * h/8);
        rect(3*w/10+50, objects[i].y*h - h/20,w/6,h/12,5);
        rect(7*w/10-50, objects[i].y*h - h/20,w/6,h/12,5);
        noStroke();
        fill(20);
        text(itemText[mode][0], 3*w/10+50,objects[i].y*h - h/20);
        text(itemText[mode][0], 7*w/10-50,objects[i].y*h - h/20);
    }

    // w-objects[i].x * width+ objects[i].w
 
    noFill();
    strokeWeight(4);
    stroke(255,alpha);
    rectMode(CENTER);
    // rectMode(CORNER);
    // rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    rect(objects[i].x * width+ objects[i].w * width/2, objects[i].y * height+ objects[i].h * height/2, objects[i].w * width*3/4, objects[i].h * height*3/4,10);
    }
    }
  }
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
prevX = mouseX;
}

function touchMoved(event) {
    swipeTimer = millis();
    // if(swipeTimer - millis)
    swipeDisplacement+=(mouseX - prevX);
    prevX = mouseX;
    // console.log(event);
}