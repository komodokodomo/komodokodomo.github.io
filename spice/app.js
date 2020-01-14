// import objectDetector from '@cloud-annotations/object-detection'
var testModel;

var jsonData,jsonDataLength;

var classToExplore = "";
var jsonDataIndex;

var subjects = [];

let button,hideButton = false;
let buttonSizeRatio = 1.0;
let buttonClick;

let loginStatus = false;
let loginWrapper;
let loginWrapperTitle;
let loginWrapperInput;
let loginWrapperInputUsername;
let loginWrapperInputPassWord;
let loginWrapperInputLogin;
let loginWrapperInputForgot;
 


let current;
let cameras = "";
let density;

let counter = 0;
let screenToggle,screenToggle2;

let maxBoxes = 1;

let canvas;

var lerpValue = 0.3;

var rounded = false;

var lensContainer, lensList, contentContainer, contentLabel, contentText, contentTrying, contentFrame, contentClose;
var lensNumber;

var prevX = 0;
var swipeDisplacement = 0; 
var swipeTimer = 0;
// var test;
var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};


let debug = false;

var itemsText = [];
let video;

var prevX,prevY,prevW,prevH;

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

function preload(){
  let url = 'https://api.sheety.co/b440651f-ff2f-4d19-8698-6ae801475966';
  jsonData = loadJSON(url);
}




function setup() {

  w = window.innerWidth;
  h = window.innerHeight;


  canvas = createCanvas(w, h);
  canvas.id("canvas");


  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();


  // var test = document.getElementById("canvas");
  // objectDetector.load('/spice/model_web')
  // .then(model => model.detect(test))
  // .then(predictions => {
  //   console.log(predictions)
  //         setInterval(function(){
  //             model.detect(test)
  //           .then(predictions => {
  //             console.log(predictions)
  //           });
  //       }
  //         , 250);
  // })

  const img = document.getElementById('canvas')
  // objectDetector.load('/spice/model_web')
  //   .then(model => model.detect(img))
  //   .then(predictions => {
  //     console.log(predictions)
  //   })

  objectDetector.load('/spice/model_web')
  .then(model => setInterval(function(){model.detect(img).then(predictions => {
    console.log(predictions)
  })},250))
  
  // testModel = objectDetector.load('/spice/model_web')


}


function draw() {

 

 background(255);
 imageMode(CENTER);

 

if(w>h){
if((w/h)>(video.width/video.height))
{
  image(video, w/2, h/2, w, w*video.height/video.width);
}
else{
  image(video, w/2, h/2, h*video.width/video.height, h);
}
}
else{
if((videoHeight/videoWidth)<(w/h)){
image(video, w/2, h/2, w, (w/videoHeight)*videoWidth);
}
else{
image(video, w/2, h/2, (h/videoWidth)*videoHeight, h);
}
}





}

function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
    lensContainer.size(w,h/10);
    lensContainer.position(0,9*h/10);
    contentContainer.size(w,9*h/10);
}


