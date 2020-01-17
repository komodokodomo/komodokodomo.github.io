var jsonData,jsonDataLength;

const MODEL_URL = 'https://gds-esd.tk/model/model.json';
// const model = tf.loadGraphModel(MODEL_URL);
let model;

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

// var test;
var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};


// var myPromise = new Promise(function(resolve, reject){
//   // resolve the promise after 1 second
//   console.log("loading model");
  
// });


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
  // modelJson = loadJSON('https://worklurk.cf/spice_tf/web_model/model.json')
}

// function init(x){
// 	const dummy = tf.zeros([1, 10, 10, 3], 'int32');
// 	return x.executeAsync( {[INPUT_TENSOR]: dummy}, OUTPUT_TENSOR ).then(function(result){
// 		dummy.dispose();
// 		return result;
// 	});
// }

async function setup() {
  console.log(jsonData);
  jsonDataLength = Object.keys(jsonData).length;
  
  w = window.innerWidth;
  h = window.innerHeight;

  canvas = createCanvas(w, h);
  canvas.id("canvas");

  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();



  const img = document.getElementById('canvas'); 
   model = await tf.loadGraphModel("https://gds-esd.tk/model/model.json");

  // const model = await tf.automl.loadObjectDetection('https://gds-esd.tk/model/model.json');
  // let options = {score: 0.8, iou: 0.8, topk: 1};
  // let predictions = await model.detect(img,options);
  // console.log(predictions);
  //  console.log(init(model));
  //  console.log("model loaded");
  //  const zeros = tf.zeros([1, 224, 224, 3]);
  //  console.log(model.executeAsync(zeros));
  //  const shape =  tf.tensor([-1, -1, -1, 3]);
  //  const imgTensor = tf.browser.fromPixels(img);
  //  const imgTensorReshaped = imgTensor.reshapeAs(shape);
  //  console.log(imgTensorReshaped);

  // tf.tidy(() => {
    let tfImg = tf.browser.fromPixels(img);
    let smalImg = tf.image.resizeBilinear(tfImg, [300, 300]);
    let t4d = tf.tensor4d(Array.from(smalImg.dataSync()),[1,300,300,3]);
    console.log(model.executeAsync(t4d));
  // })

  setInterval(function(){
    // loadedmodel.predict(tf.browser.fromPixels(img)).then(predictions => {console.log(predictions);});
    // let predictions = model.detect(img);
    // console.log(predictions);
    // console.log(model.predict(tf.browser.fromPixels(img).pad([[1, 0]]).reshape([-1,1]))); //total fail
    // console.log(model.predict(tf.browser.fromPixels(img).pad([[1, 0]])));//total fail
    // let tfImg = tf.fromPixels(img);
    
    // const resized = tf.cast(smalImg, 'float32');
    // const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1,368,432,3])
    // console.log(model.execute(tf.browser.fromPixels(img)));
    // tf.tidy(() => {
    //   let tfImg = tf.browser.fromPixels(img);
    //   let smalImg = tf.image.resizeBilinear(tfImg, [300, 300]);
    //   console.log(model.execute(smalImg));
    // })

  // model.predict(tf.browser.fromPixels(img));
 },250);  // const img = document.getElementById('canvas'); 

  // tf.loadGraphModel('web_model/model.json')
  // .then(model => 
  //   setInterval(function()
  // {
    
  //   model.predict(img).then(predictions => { 
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


