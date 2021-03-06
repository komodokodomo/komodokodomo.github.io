
// indent code properly
// align braces {}
// throw HTML elt in .html file
// group related variables together 
// naming conventions: add dataType to name e.g. subject vs subjectArr
// remove commented code meant for test and console.log
// { "key": value } vs {"key":value}



var jsonData,jsonDataLength;
const URL = "https://teachablemachine.withgoogle.com/models/Bg30Yx6i/";
const infoURL = 'https://cors-anywhere.herokuapp.com/https://gds-esd.com/sheet/1V_naAwK3rQAWowSV0ny6SdjXwclEBmSw7J-wMMCOrBE/1';


let model, maxPredictions, classPrediction,debugPrediction;
let prevProb = [];
let lerpProb = [];

let classname;
// let setuped = false;

var classToExplore = "";
var jsonDataIndex;

var subjects = [];

let hideButton = false;

let loginStatus = false;
let loginWrapper;
let loginWrapperTitle;
let loginWrapperInput;
let loginWrapperInputUsername;
let loginWrapperInputPassWord;
let loginWrapperInputLogin;
let loginWrapperInputForgot;

let canvasPadding = 40;

let titleContainer, canvasContainer, lensContainer;
let lensList,lensNumber, lensName, contentText, contentClose;
let canvas,video,img,chatbox,chatboxClose,chatboxContent,chatboxTitle,chatboxExpand,chatboxExpanded = false,chatboxContainer;

let faces = [];
let left,right,leftName,rightName;

let faceMode = 0;


let mobile = false;
let w,h,density;
const constraints = {
  // video: { facingMode: { exact: "environment" } },
  video: { facingMode: "environment"  },
  audio: false
};
const videoWidth = 1920,videoHeight = 1080;



let objects = [];


async function preload(){
  jsonData = loadJSON(infoURL);
}

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  for (let i = 0; i < maxPredictions; i++) {
    lerpProb[i] = 0.0;
  }
}

async function predict() {
  const prediction = await model.predict(img);
  classPrediction = "";
  debugPrediction = "";
  let highestProb = 0.0;
  let highestClass;
  if(!chatboxExpanded){

  for (let i = 0; i < maxPredictions; i++) {
      // debugPrediction = debugPrediction + prediction[i].probability.toFixed(2) +', ';
      lerpProb[i] = lerp(lerpProb[i],prediction[i].probability,0.5);
      // debugPrediction = debugPrediction + lerpProb[i].toFixed(2) +', ';
      // if(highestProb<prediction[i].probability.toFixed(2)){highestProb=prediction[i].probability.toFixed(2);highestClass = i;}
      if(highestProb<lerpProb[i]){highestProb=lerpProb[i];highestClass = i;}

      // classPrediction = classPrediction + prediction[i].className + ": " + prediction[i].probability.toFixed(2);
  }

  // console.log(debugPrediction);

  classname = prediction[highestClass].className;
  if(jsonData[faceMode][classname]=== undefined || jsonData[faceMode][classname]=== null){}
  else{
  if(parseFloat(prediction[highestClass].probability.toFixed(2))>0.95){
    chatbox.html(" I think its a "+prediction[highestClass].className + "\<br\>Click to find out more");
    chatboxExpand = true;
  }
  else if(parseFloat(prediction[highestClass].probability.toFixed(2))<=0.95){
  chatbox.html("Hmmm is it a " + prediction[highestClass].className + "...");
  chatboxExpand = false;
  }
  }
}
  predict();
}
function untrigger() { 
    setTimeout(function(){chatboxExpanded = false;},1000);
    console.log('close chatbox');
    let a = document.getElementById("chatbox");
    a.classList.remove("expand");
    a.classList.add("contract");

    let b = document.getElementById("chatbox-close");
    b.classList.remove("showX");
    b.classList.add("hideX");

    let c = document.getElementById("chatbox-content");    
    c.classList.remove("up");
    c.classList.add("down");

    let d = document.getElementById("chatbox-title");
    // chatboxTitle.html("");
    d.classList.remove("showX");
    d.classList.add("hideX");

  }  

function trigger() { 
  if(chatboxExpand){
    chatboxExpanded = true;
    chatbox.html("");

    changeContent();

    console.log('button clicked!');
    let a = document.getElementById("chatbox");
    a.classList.remove("contract");
    a.classList.add("expand");

    let b = document.getElementById("chatbox-close");
    b.classList.remove("hideX");
    b.classList.add("showX");

    let c = document.getElementById("chatbox-content");
    c.classList.remove("down");
    c.classList.add("up");

    let d = document.getElementById("chatbox-title");
    chatboxTitle.html(classname);
    d.classList.remove("hideX");
    d.classList.add("showX");
  }  
  else{
    console.log('not confident enough!'); 
  }
  // document.getElementById("related-content-container").classList.add("active");
  
  // button.hide();
  // hideButton = true;
  // classToExplore = objects[0].class;
  // contentLabel.html(classToExplore);
  // if(lensNumber == undefined){
  //   contentText.html("choose a lens to start exploring!");
  // }
  // else{
  //     contentText.html(lensNumber.toString());
  // }
  // console.log(objects[0].class);
}


function loginUser(){
loginStatus = true;
loginWrapper.hide();
titleContainer.show();
canvasContainer.show();
canvas.show();
lensContainer.show();
chatboxContainer.show();
// for(let i = 0; i < faces.length; i++){
//  faces[i].style("display","none"); 
// }
// faces[lensMode].style("display","block"); 


}


function closeContent(){
  document.getElementById("related-content-container").classList.remove("active");
  lensContainer.hide();
  lensNumber = undefined;
}

function changeContent(){
  if (jsonData[faceMode][classname] !== null || jsonData[faceMode][classname] !== undefined) {
    console.log(jsonData[faceMode][classname]);
    // let stuff = (jsonData[faceMode][classname]).toString();
    let stuff = jsonData[faceMode][classname];
    let stuffs = stuff.split("\\");
    let things = "";

    if(stuffs.length>0){
    for(var k=0; k < stuffs.length; k++){
      // let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\" onclick=\"loadIFRAME(event, this)\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
      let addon = stuffs[k] + "<br><br><br>";
      things += addon;
    }
    console.log("split success");
    
  }
  //  console.log(things); 
  chatboxContent.html(things);
  }
}

async function setup() {
  await init();
  console.log( await jsonData);
  

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    mobile = true;
   }

  jsonDataLength = Object.keys(jsonData).length;
  
  w = window.innerWidth;
  h = window.innerHeight;
  density = pixelDensity();




  lensContainer = createDiv();
  lensContainer.size(w,4*h/10);
  lensContainer.position(0,6*h/10);
  lensContainer.id("lens-container");
  lensContainer.hide();

  for(let i = 0; i<3; i++){
    // faces[i] = createImg("https://cors-anywhere.herokuapp.com/"+jsonData[i].Image, i.toString());
    faces[i] = createImg("300ppi/faces"+((i+1)*2).toString()+".png", i.toString());
    faces[i].parent(lensContainer);
    faces[i].style("position","absolute");
    faces[i].style("left","50%");
    faces[i].style("height","45%");
    faces[i].style("transform", "translate(-50%)");
    faces[i].style("bottom","0%");
    if(i === faceMode){faces[i].show();}
    else{faces[i].hide();}
  }

  left = createImg("300ppi/left.png");
  left.parent(lensContainer);
  left.style("position","absolute");
  left.style("left","5%");
  left.style("bottom","15%");
  left.style("width","23%");

  right = createImg("300ppi/right.png");
  right.parent(lensContainer);
  right.style("position","absolute");
  right.style("right","5%");
  right.style("bottom","15%");
  right.style("width","23%");

  leftName = createDiv(jsonData[1].subject);
  leftName.parent(lensContainer);
  leftName.style("position","absolute");
  leftName.style("left","5%");
  leftName.style("text-align","center");
  leftName.style("bottom","25%");
  leftName.style("width","23%");
  leftName.style("font-weight","bold");
  leftName.style("font-size","0.7rem");

  rightName = createDiv(jsonData[2].subject);
  rightName.parent(lensContainer);
  rightName.style("position","absolute");
  rightName.style("text-align","center");
  rightName.style("right","5%");
  rightName.style("bottom","25%");
  rightName.style("width","23%");
  rightName.style("font-weight","bold");
  rightName.style("font-size","0.7rem");





  lensName = createDiv(jsonData[0].subject);
  lensName.parent(lensContainer);
  lensName.style("position","absolute");
  lensName.style("width","100%");
  lensName.style("height","10%");
  lensName.style("bottom","47%");
  lensName.style("font-weight","bold");
  lensName.style("display", "flex");
  lensName.style("align-items", "center");
  lensName.style("justify-content", "center");

  

  chatboxContainer = createDiv();
  chatboxContainer.id("chatbox-container")

  chatbox = createDiv();
  chatbox.parent(chatboxContainer);
  chatbox.class("speech-bubble");
  chatbox.id("chatbox");
  let a = document.getElementById("chatbox");
  a.classList.add("contract");
  chatbox.mousePressed(trigger);




  var myElement = document.getElementById('chatbox-container');
  var mc = new Hammer(myElement);
  mc.on("swipeleft swiperight", function(ev) {
   console.log(ev.type);
   faces[faceMode].hide();
   if(ev.type == "swipeleft"){faceMode++;}
   else if(ev.type == "swiperight"){faceMode--;}

   if(faceMode>faces.length-1){faceMode=0;}
   if(faceMode<0){faceMode=faces.length-1;}
   faces[faceMode].show();
   console.log(faceMode);

   let leftNum = faceMode + 1;
   if(leftNum>faces.length-1){leftNum=0;}
   if(leftNum<0){leftNum=faces.length-1;}

   let rightNum = faceMode - 1;
   if(rightNum>faces.length-1){rightNum=0;}
   if(rightNum<0){rightNum=faces.length-1;}

  
   lensName.html(jsonData[faceMode].subject);

   leftName.html(jsonData[leftNum].subject);
   rightName.html(jsonData[rightNum].subject);

   if(chatboxExpanded){
   changeContent();
  }
  });

  canvasContainer = createDiv();
  canvasContainer.size(w,h/2);
  canvasContainer.position(0,h/10);
  canvasContainer.id("canvas-container");
  canvasContainer.hide();
  // canvasContainer.hide();

  if(w>h){
  if(w>h/2){canvas = createCanvas(h/2-canvasPadding, h/2-canvasPadding);}
  else{canvas = createCanvas(w-canvasPadding, w-canvasPadding);}
  }
  else{  
    if(w>h/2){canvas = createCanvas(h/2-canvasPadding, h/2-canvasPadding);}
    else{canvas = createCanvas(w-canvasPadding, w-canvasPadding);}
  }
  canvas.position(w/2-canvas.width/2, 7*h/20 - canvas.height/2);
  canvas.id("canvas");
  canvas.hide();

  chatboxContainer.size(canvas.width,h);
  chatboxContainer.position(w/2-canvas.width/2,0);
  chatboxContainer.hide();

  chatboxClose = createDiv("X");
  chatboxClose.id("chatbox-close");
  chatboxClose.class("hideX");
  chatboxClose.parent(chatboxContainer);
  chatboxClose.style("z-index","6");
  chatboxClose.style("font-weight","bold");
  chatboxClose.style("position","absolute");
  chatboxClose.mousePressed(untrigger);

  chatboxTitle = createDiv();
  chatboxTitle.id("chatbox-title");
  chatboxTitle.class("hideX");
  chatboxTitle.parent(chatboxContainer);
  chatboxTitle.style("z-index","6");
  chatboxTitle.style("font-weight","bold");
  chatboxTitle.style("position","absolute");
  chatboxTitle.style("left","30px");
  chatboxTitle.style("inline-size","fit-content");

  chatboxContent = createP("");
  chatboxContent.id("chatbox-content");
  chatboxContent.parent(chatboxContainer);
  chatboxContent.style("z-index","6");
  chatboxContent.style("position","absolute");
  chatboxContent.class("down");

  titleContainer = createDiv();
  titleContainer.size(w,h/10);
  titleContainer.position(0,0);
  titleContainer.id("title-container")
  titleContainer.hide();

  let titleContainerBack = createDiv("<");
  titleContainerBack.parent(titleContainer);
  titleContainerBack.style("position","absolute");
  titleContainerBack.style("left","0%");
  titleContainerBack.style("width","20%");
  titleContainerBack.style("height","100%");
  titleContainerBack.style("display", "flex");
  titleContainerBack.style("align-items", "center");
  titleContainerBack.style("justify-content", "center");
  titleContainerBack.style("font-weight", "bold");
  titleContainerBack.style("font-size", "1.2rem");


  let titleContainerContent = createDiv("Spice Garden");
  titleContainerContent.parent(titleContainer);
  titleContainerContent.style("position","absolute");
  titleContainerContent.style("left","20%");
  titleContainerContent.style("width","60%");
  titleContainerContent.style("height","100%");
  titleContainerContent.style("display", "flex");
  titleContainerContent.style("align-items", "center");
  titleContainerContent.style("justify-content", "center");
  titleContainerContent.style("font-weight", "bold");
  titleContainerContent.style("font-size", "1.3rem");


  let titleContainerMenu = createDiv("☰");
  titleContainerMenu.parent(titleContainer);
  titleContainerMenu.style("position","absolute");
  titleContainerMenu.style("left","80%");
  titleContainerMenu.style("width","20%");
  titleContainerMenu.style("height","100%");
  titleContainerMenu.style("display", "flex");
  titleContainerMenu.style("align-items", "center");
  titleContainerMenu.style("justify-content", "center");
  titleContainerMenu.style("font-weight", "bold");
  titleContainerMenu.style("font-size", "1.2rem");
  // lensContainer.hide();



  // lensList = createElement("ul");
  // lensList.parent(lensContainer);
  // lensList.id("lens-list");
  // lensList.style("height","100%");


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
  //       let things = "";

  //       if(stuffs.length>0){
  //       for(var k=0; k<stuffs.length; k++){
  //         // let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\" onclick=\"loadIFRAME(event, this)\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
  //         let addon = "<a href=\""+ stuffs[k].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[k].split("(")[0] + "</a><br><br><br>";
  //         things += addon;
  //       }
  //       console.log("split success");
  //       console.log(stuffs[0].split("(")[0]);
  //       console.log(stuffs[0].split("(")[1].split(")")[0]);
        
  //     }
  //     //  let testing = "<a href=\""+ stuffs[0].split("(")[1].split(")")[0] + "\" target=\"content-frame\">" + stuffs[0].split("(")[0] + "</a>";
  //      console.log(things); 
  //     //  stuff = stuff.replace('\\','<br><br>');
  //       contentText.html(things);
  //     }
  //     else{
  //       contentText.html("no content for now...");
  //     }
  //     }
  //   };
  // }



loginWrapper = createDiv();
loginWrapper.size(w*0.6,h*0.8);
loginWrapper.position(w*0.2,h*0.1);


// loginWrapperTitle = createImg('https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=1JWTsU_lZpkKqqLC_KNmzAzF0PvktLfrn','SLS');
loginWrapperTitle = createImg('300ppi/logo.png','SLS');
loginWrapperTitle.parent(loginWrapper);
loginWrapperTitle.style("width","inherit");
loginWrapperTitle.style("margin","0rem 0rem 1rem 0rem");



loginWrapperInput = createDiv();
loginWrapperInput.parent(loginWrapper);

loginWrapperUsername = createDiv("Username");
loginWrapperUsername.class("field-label");
loginWrapperUsername.parent(loginWrapperInput);


loginWrapperInputUsername = createInput();
loginWrapperInputUsername.style("background","lightgrey");
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
loginWrapperInputPassword.style("background","lightgrey");
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




video = createCapture(constraints);
video.size(videoWidth, videoHeight);
video.hide();
  
img = document.getElementById('canvas'); 

// setuped = true;
predict();

}


function draw() {
if(!loginStatus){
    background(215);
  }
 
  else{
 background(255);
 imageMode(CENTER);

if(mobile) {
 if(w>h){
  // image(video, width/2, height/2, videoWidth, videoHeight);
  image(video, width/2, height/2, height*videoWidth/videoHeight, height);
  }
  else{
  image(video, width/2, height/2, width, width*videoWidth/videoHeight);
  // image(video, w/2, h/2, videoHeight, videoWidth);
  }
}
else{
  // if(w>h){
    image(video, width/2, height/2, height*videoWidth/videoHeight, height);
  // }
  // else{
  //   image(video, width/2, height/2, width, width*videoHeight/videoWidth);
  // }
}


  

}
}

function windowResized(){
  // if(setuped){
    w = window.innerWidth;
    h = window.innerHeight;

    if(w>h){
      if(w>h/2){canvas.size(h/2-canvasPadding, h/2-canvasPadding);}
      else{canvas.size(w-canvasPadding, w-canvasPadding);}
      }
      else{  
        if(w>h/2){canvas.size(h/2-canvasPadding, h/2-canvasPadding);}
        else{canvas.size(w-canvasPadding, w-canvasPadding);}
      }
      canvas.position(w/2-canvas.width/2, 7*h/20 - canvas.height/2);

      chatboxContainer.size(canvas.width,h);
      chatboxContainer.position(w/2-canvas.width/2,0);

      // chatboxClose.position(w/2+canvas.width/2-canvasPadding/2,h/10+canvasPadding/2);

      // chatbox.size(canvas.width,h/8);
    // chatbox.position(w/2-canvas.width/2,canvasPadding/2);
    
    titleContainer.size(w,h/10);
    titleContainer.position(0,0);

    canvasContainer.size(w,h/2);
    canvasContainer.position(0,h/10);

    lensContainer.size(w,4*h/10);
    lensContainer.position(0,6*h/10);
  // }
}




  