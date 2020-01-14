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

const MODEL_URL = '/spice_tf/saved_model/model.json';

// For Keras use tf.loadLayersModel().
const model = await tf.loadGraphModel(MODEL_URL);



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

function trigger() {
  console.log('button clicked!');
  lensContainer.style("display","flex");
  contentContainer.style("display","flex");
  document.getElementById("related-content-container").classList.add("active");
  
  button.hide();
  hideButton = true;
  classToExplore = objects[0].class;
  contentLabel.html(classToExplore);
  if(lensNumber == undefined){
    contentText.html("choose a lens to start exploring!");
  }
  else{
      contentText.html(lensNumber.toString());
  }
  console.log(objects[0].class);
}
function loginUser(){
loginStatus = true;
loginWrapper.hide();
}
function toggleScreen() {
  fullscreen(true);
  console.log("fullscreen");
  screenToggle.hide();
  // screenToggle2.show(); 
}

function toggleScreen2() {
  fullscreen(false);
  console.log("non-fullscreen");
  screenToggle.show();
  screenToggle2.hide();
}

function closeContent(){
  document.getElementById("related-content-container").classList.remove("active");
  contentContainer.hide();
  lensContainer.hide();
  hideButton = false;
  lensNumber = undefined;
  contentFrame.hide(); //TEMP HACK
}

// function loadIFRAME(event, ele) {
//   event.preventDefault();
//   contentFrame.show();
//   contentFrame.attribute("src",ele.getAttribute('href'));
// }

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


  button = createDiv();
  button.mouseClicked(trigger);
  button.size(0,0);
  button.position(0,0);
  button.id("button");
  // button.style("text-align","center");
  button.style("display" ,"block");
  button.hide();

  buttonClick = createImg("300ppi/click.png","click me");
  buttonClick.parent(button);
  buttonClick.style("width","20%");
  buttonClick.style("position","absolute");
  buttonClick.style("top","50%");
  buttonClick.style("left","50%");
  buttonClick.style("transform", "translate(-50%, -50%)");

  for(let i = 0; i<jsonDataLength; i++){
    subjects[i] = createElement("li",jsonData[i].subject);
    subjects[i].parent(lensList);
    subjects[i].id("li"+i.toString());
    document.getElementById("li"+i.toString()).onclick = function(){
      console.log("you clicked: " + i.toString());
      lensNumber = i;
      for(let j = 0; j<jsonDataLength; j++){
        document.getElementById("li"+j.toString()).classList.remove("active");
      }
      document.getElementById("li"+i.toString()).classList.add("active");
      if(hideButton){
 

        if(jsonData[lensNumber][objects[0].class]!== null){
        let stuff = jsonData[lensNumber][objects[0].class].toString();
        let stuffs = stuff.split("\\");
        let things = "";

        if(stuffs.length>0){
        for(var k=0; k<stuffs.length; k++){
          // let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\" onclick=\"loadIFRAME(event, this)\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
          let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
          things += addon;
        }
        console.log("split success");
        console.log(stuffs[0].split("(")[0]);
        console.log(stuffs[0].split("(")[1].split(")")[0]);
        
      }
      //  let testing = "<a href=\""+ stuffs[0].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[0].split("(")[0] + "</a>";
       console.log(things); 
      //  stuff = stuff.replace('\\','<br><br>');
        contentText.html(things);
      }
      else{
        contentText.html("no content for now...");
      }
      }

      // for(let i = 0; i<jsonDataLength; i++){
      //   if(classToExplore == jsonData[i].subject){jsonDataIndex = i;}
      // }
      // jsonDataIndex = jsonData.map(function (img) { return img.value; }).indexOf(classToExplore);
      // jsonDataIndex = jsonData.findIndex(img => img.value === classToExplore);
      // console.log("index: " + jsonDataIndex.toString());
    };
    // subjects[i].style("display","inline");
    // subjects[i].show();
  }


  // for(let i = 0; i<jsonDataLength; i++){
  //   subjects[i] = createElement("li",jsonData[i].subject);
  //   subjects[i].parent(lensList);
  //   subjects[i].id("li"+i.toString());
  //   document.getElementById("li"+i.toString()).onclick = function(){
  //     console.log("you clicked: " + i.toString());
  //     lensNumber = i;
  //     for(let j = 0; j<jsonDataLength; j++){
  //       document.getElementById("li"+j.toString()).classList.remove("active");
  //     }
  //     document.getElementById("li"+i.toString()).classList.add("active");
  //     if(hideButton){
 

  //       if(jsonData[lensNumber][objects[0].class]!== null){
  //       let stuff = jsonData[lensNumber][objects[0].class].toString();
  //       let stuffs = stuff.split("\\");

  //       if(stuffs.length>0){
  //       console.log("split success");
  //       console.log(stuffs[0].split("(")[0]);
  //       console.log(stuffs[0].split("(")[1].split(")")[0]);
  //     }
  //      let testing = "<a href=\""+ stuffs[0].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[0].split("(")[0] + "</a>";
  //      console.log(testing); 
  //      stuff = stuff.replace('\\','<br><br>');
  //       contentText.html(stuff);
  //     }
  //     else{
  //       contentText.html("no content for now...");
  //     }
  //     }

  //     // for(let i = 0; i<jsonDataLength; i++){
  //     //   if(classToExplore == jsonData[i].subject){jsonDataIndex = i;}
  //     // }
  //     // jsonDataIndex = jsonData.map(function (img) { return img.value; }).indexOf(classToExplore);
  //     // jsonDataIndex = jsonData.findIndex(img => img.value === classToExplore);
  //     // console.log("index: " + jsonDataIndex.toString());
  //   };
  //   // subjects[i].style("display","inline");
  //   // subjects[i].show();
  // }

  contentFrame = createElement("iframe","#");
  contentFrame.size(w,9*h/10);
  contentFrame.position(0,h/10);
  contentFrame.attribute("name","content-frame");
  contentFrame.hide();


screenToggle = createImg("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1N9_nJChavTNQ6FTE4fEIfV5NcPc4yvVn",'toggle fullscreen');
screenToggle.style("width","16px");
screenToggle.style("height","16px");
// screenToggle.style("left","32px");
// screenToggle.style("top","32px");
// screenToggle.size(w/16,w/16);
screenToggle.position(16,16);
screenToggle.mouseClicked(toggleScreen);


loginWrapper = createDiv();
loginWrapper.size(w*0.6,h*0.8);
loginWrapper.position(w*0.2,h*0.1);

// loginWrapperTitle = createDiv();
// loginWrapperTitle.parent(loginWrapper);
// loginWrapperTitle.class("section-header");
// loginWrapperTitle.style("height","15%");

loginWrapperTitle = createImg('logo.png','SLS');
loginWrapperTitle.parent(loginWrapper);
loginWrapperTitle.style("width","inherit");
loginWrapperTitle.style("margin","0rem 0rem 1rem 0rem");



loginWrapperInput = createDiv();
loginWrapperInput.parent(loginWrapper);

loginWrapperUsername = createDiv("Username");
loginWrapperUsername.class("field-label");
loginWrapperUsername.parent(loginWrapperInput);


loginWrapperInputUsername = createInput();
// loginWrapperInputUsername.style("background","#EBF2FE");
loginWrapperInputUsername.style("padding","10px");
loginWrapperInputUsername.style("width","100%");
loginWrapperInputUsername.style("border-style","none");
loginWrapperInputUsername.style("margin-bottom","0.5rem");
loginWrapperInputUsername.parent(loginWrapperInput);

loginWrapperPassword = createDiv("Password");
loginWrapperPassword.parent(loginWrapperInput);
loginWrapperPassword.class("field-label");

loginWrapperInputPassword = createInput();
loginWrapperInputPassword.parent(loginWrapperInput);
// loginWrapperInputPassword.style("background","#EBF2FE");
loginWrapperInputPassword.style("padding","10px");
loginWrapperInputPassword.style("width","100%");
loginWrapperInputPassword.style("border-style","none");
loginWrapperInputPassword.style("margin-bottom","1.5rem");



// loginWrapperInputPassword = createInput();
loginWrapperInputLogin = createButton("LOGIN");
loginWrapperInputLogin.parent(loginWrapperInput);
loginWrapperInputLogin.style("background","#336FB6");
loginWrapperInputLogin.style("color","white");
loginWrapperInputLogin.style("position","relative");
loginWrapperInputLogin.style("right","0px");
// loginWrapperInputLogin.style("bottom","0px");
loginWrapperInputLogin.style("border-style","none");
loginWrapperInputLogin.style("border-radius","0.25rem");
loginWrapperInputLogin.style("padding","1rem 3rem");
loginWrapperInputLogin.mousePressed(loginUser);

// loginWrapperInputForgot;
loginWrapperInputForgot = createButton("FORGOT PASSWORD");
loginWrapperInputForgot.parent(loginWrapperInput);
loginWrapperInputForgot.style("background","transparent");
loginWrapperInputForgot.style("color","#336FB6");
loginWrapperInputForgot.style("position","relative");
loginWrapperInputForgot.style("left","0px");
// loginWrapperInputForgot.style("bottom","0px");
loginWrapperInputForgot.style("border-style","none");
loginWrapperInputForgot.style("border-radius","0.25rem");
loginWrapperInputForgot.style("padding","1rem 0rem");

// screenToggle2 = createImg("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1hXjCPTS8UiLYQwsnF32wI3yTOTsaobdF",'un-toggle fullscreen');
// // screenToggle2.size(w/16,w/16);
// screenToggle2.position(32,32);
// screenToggle2.style("width","32px");
// screenToggle2.style("height","32px");
// // screenToggle2.style("left","32px");
// // screenToggle2.style("top","32px");
// screenToggle2.mouseClicked(toggleScreen2);
// screenToggle2.hide();


  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();
  var test = document.getElementById("canvas");


  const img = document.getElementById('canvas'); 
  // const cat = document.getElementById('cat');
  setInterval(function(){
  model.predict(tf.browser.fromPixels(img)).then(predictions => {console.log(predictions);});
  // model.predict(tf.browser.fromPixels(img));
 },250);
  // objectDetector.load('/spice/model_web') 
  // .then(model => 
  //   setInterval(function()
  // {
    
  //   model.detect(img).then(predictions => { 
  //     if(!hideButton){
  //     console.log(predictions) 
  //     objects = [];
  //     if(predictions.length > 0){
  //     counter++;
  //     if(counter>2){counter=2;}
  //     // for (let i = 0; i < predictions.length; i++) {
  //       objects[0]=predictions[0];
  //     // }
  //   }
  //   else{
  //     counter = 0;
  //     button.hide();
  //   }
  //   }
  //   })

  // },250))

  // cocoSsd.load().then(model => {
  //   console.log("model loaded!");
  //   status = true;

  //   setInterval(function(){

  //     if(!hideButton){
  //     model.detect(test,maxBoxes).then(predictions => {
  //       console.log(predictions);
  //       objects = [];
  //       if(predictions.length > 0){
  //       counter++;
  //       if(counter>2){counter=2;}
  //       for (let i = 0; i < predictions.length; i++) {
  //         objects[i]=predictions[i];
  //       }
  //     }
  //     else{
  //       counter = 0;
  //       button.hide();
  //     }
  //     });
  //   }
  // }
  //   , 250);
  // }
  // );

}


function draw() {
  if(!loginStatus){
    background(215);
  }
 
  else{
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

 for(var i=0; i<objects.length ;i++){
   if(abs(objects[i].bbox[0]/density - prevX)>50){counter = 0;}
   if(abs(objects[i].bbox[1]/density - prevY)>50){counter = 0;}

  if(counter > 0){
  let lerpX = lerp(objects[i].bbox[0]/density,prevX,lerpValue);
  let lerpY = lerp(objects[i].bbox[1]/density,prevY,lerpValue);
  let lerpW = lerp(objects[i].bbox[2]/density,prevW,lerpValue);
  let lerpH = lerp(objects[i].bbox[3]/density,prevH,lerpValue);

  // let lerpX = lerp(lerpX,prevX,lerpValue);
  // let lerpY = lerp(lerpY,prevY,lerpValue);
  // let lerpW = lerp(lerpW,prevW,lerpValue);
  // let lerpH = lerp(lerpH,prevH,lerpValue);

  button.size(lerpW*buttonSizeRatio,lerpH*buttonSizeRatio);
  button.position(lerpX+(lerpW*(1-buttonSizeRatio))/2,lerpY+(lerpH*(1-buttonSizeRatio))/2);
  }

  else{
  button.size(objects[i].bbox[2]*buttonSizeRatio/density,objects[i].bbox[3]*buttonSizeRatio/density);  //default
  button.position(objects[i].bbox[0]/density+(objects[i].bbox[2]/density*(1-buttonSizeRatio))/2   ,objects[i].bbox[1]/density+(objects[i].bbox[3]/density*(1-buttonSizeRatio))/2);
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
}

function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
    lensContainer.size(w,h/10);
    lensContainer.position(0,9*h/10);
    contentContainer.size(w,9*h/10);
}


