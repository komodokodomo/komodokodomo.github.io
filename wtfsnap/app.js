var jsonData,jsonDataLength;

var subjects = [];

let button,hideButton = false;

let current;
let cameras = "";
let density;

let counter = 0;
let screenToggle,screenToggle2;

let maxBoxes = 1;

let canvas;

var lensContainer, lensList, contentContainer, contentLabel, contentText, contentTrying, contentFrame, contentClose;

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

// window.addEventListener('DOMContentLoaded', (event) => {
//   console.log('DOM fully loaded and parsed');
// });

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


function trigger() {
  console.log('button clicked!');
  lensContainer.style("display","flex");
  contentContainer.style("display","flex");
  // contentContainer.style("display","flex");
  document.getElementById("related-content-container").classList.add("active");
  button.hide();
  hideButton = true;
  contentLabel.html(objects[0].class);
  console.log(objects[0].class);
}

function toggleScreen() {
  fullscreen(true);
  console.log("fullscreen");
  screenToggle.hide();
  screenToggle2.show();
}

function toggleScreen2() {
  fullscreen(false);
  console.log("non-fullscreen");
  screenToggle.show();
  screenToggle2.hide();
}

function closeContent(){
  contentContainer.hide();
  document.getElementById("related-content-container").classList.remove("active");
  lensContainer.hide();
  hideButton = false;
}

function setup() {
  console.log(jsonData);
  jsonDataLength = Object.keys(jsonData).length;
  
  w = window.innerWidth;
  h = window.innerHeight;

  density = pixelDensity();
  console.log("width: " + w + " height: " + h + " pixelDensity: " + pixelDensity());

  canvas = createCanvas(w, h);
  canvas.id("canvas");

  contentContainer = createDiv();
  contentContainer.size(w,9*h/10);
  contentContainer.position(0,0);
  contentContainer.id("related-content-container");
  // contentContainer.hide();

  contentLabel = createElement("h2");
  contentLabel.id("object-label");
  contentLabel.parent(contentContainer);

  contentText = createP();
  contentText.id("content");
  contentText.parent(contentContainer);

  contentClose = createA('#', '');
  contentClose.parent(contentContainer);
  contentClose.class('close');
  contentClose.mouseClicked(closeContent);

  lensContainer = createDiv();
  lensContainer.size(w,h/10);
  lensContainer.position(0,9*h/10);
  lensContainer.id("lens-container")
  lensContainer.hide();

  lensList = createElement("ul");
  lensList.parent(lensContainer);
  lensList.id("lens-list");
  lensList.style("height","100%");


  // contentTrying = createSpan("Trying to identify...");
  // contentTrying.id("trying");
  // contentTrying.parent(contentContainer);

  button = createDiv();
  button.mouseClicked(trigger);
  button.size(0,0);
  button.position(0,0);
  button.style("border-style","dashed");
  // button.style("border-radius","50%");
  button.style("border-color","white");
  button.style("border-width","0.3rem");
  // button.style("background-color","transparent");
  button.hide();

  for(let i = 0; i<jsonDataLength; i++){
    subjects[i] = createElement("li",jsonData[i].subject);
    subjects[i].parent(lensList);
    subjects[i].id("li"+i.toString());
    document.getElementById("li"+i.toString()).onclick = function(){
      console.log("you clicked: " + i.toString());
      for(let j = 0; j<jsonDataLength; j++){
        document.getElementById("li"+j.toString()).classList.remove("active");
      }
      document.getElementById("li"+i.toString()).classList.add("active");
    };
    // subjects[i].style("display","inline");
    // subjects[i].show();
  }


screenToggle = createImg("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1N9_nJChavTNQ6FTE4fEIfV5NcPc4yvVn",'toggle fullscreen');
screenToggle.size(w/16,w/16);
screenToggle.position(w/32,w/32);
screenToggle.mouseClicked(toggleScreen);

screenToggle2 = createImg("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1hXjCPTS8UiLYQwsnF32wI3yTOTsaobdF",'un-toggle fullscreen');
screenToggle2.size(w/16,w/16);
screenToggle2.position(w/32,w/32);
screenToggle2.mouseClicked(toggleScreen2);
screenToggle2.hide();


  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();
  var test = document.getElementById("canvas");


  cocoSsd.load().then(model => {
    console.log("model loaded!");
    status = true;

    setInterval(function(){
      // console.log(test);

      model.detect(test,maxBoxes).then(predictions => {
        console.log(predictions);
        objects = [];
        if(predictions.length > 0){
        counter++;
        if(counter>2){counter=2;}
        for (let i = 0; i < predictions.length; i++) {
          objects[i]=predictions[i];
        }
      }
      else{
        counter = 0;
        button.hide();
        // lensContainer.hide();
      }
      });
    }
    , 200);
  }
  );

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
//  image(video, w/2, h/2, w, w*videoHeight/videoWidth);

}
else{
// image(video, w/2, h/2,w,h);
if((videoHeight/videoWidth)<(w/h)){
image(video, w/2, h/2, w, (w/videoHeight)*videoWidth);
}
else{
image(video, w/2, h/2, (h/videoWidth)*videoHeight, h);
}
// image(video, w/2, h/2, w, w*h/videoWidth);
}

if(debug){
 fill(0);
 noStroke();
 text(frameRate(),30,30);
 text(cameras,30,50);
 text("display: " + w + " x " +h,30,70);
 text("cam: " + video.width + " x " +video.height,30,90);
 if(status){
 text("model loaded",30,110);
 }
}

//  console.log(objects.length);
 for(var i=0; i<objects.length ;i++){
   if(abs(objects[i].bbox[0]/density - prevX)>50){counter = 0;}
   if(abs(objects[i].bbox[1]/density - prevY)>50){counter = 0;}

  if(counter > 0){
  let lerpX = lerp(objects[i].bbox[0]/density,prevX,0.3);
  let lerpY = lerp(objects[i].bbox[1]/density,prevY,0.3);
  let lerpW = lerp(objects[i].bbox[2]/density,prevW,0.3);
  let lerpH = lerp(objects[i].bbox[3]/density,prevH,0.3);
  // if(lerpW>lerpH){ //W>H
  //   button.size(lerpW,lerpW);
  // }
  // else{
  //   button.size(lerpH,lerpH);
  // }
  button.size(lerpW,lerpH);
  button.position(lerpX,lerpY);
  }

  else{
  button.size(objects[i].bbox[2]/density,objects[i].bbox[3]/density);  //default
  button.position(objects[i].bbox[0]/density,objects[i].bbox[1]/density);
  }

  prevX = objects[i].bbox[0]/density;
  prevY = objects[i].bbox[1]/density;
  prevW = objects[i].bbox[2]/density;
  prevH = objects[i].bbox[3]/density;

  if(hideButton == false){
  button.show();
}
  rectMode(CORNER);
  stroke(0,255,0);
  strokeWeight(5);
  noFill();

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


