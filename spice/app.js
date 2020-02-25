const MODEL_URL = 'model_js/model.json';

const constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};
const videoWidth = 1280;
const videoHeight = 720;

let canvas,w,h;
let model,sample;

let enumeratorPromise = navigator.mediaDevices.enumerateDevices().then(function(devices) {
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


async function init(){
  model = tf.loadLayersModel(MODEL_URL);
}


async function setup(){

w = window.innerWidth;
h = window.innerHeight;
canvas = createCanvas(w, h);
canvas.id("canvas");

video = createCapture(constraints);
video.size(videoWidth, videoHeight);
video.hide();

model = await init();
predict();

}

function draw(){
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

async function predict(){
  sample = document.getElementById('canvas');
  let results = await model.predict(tf.browser.fromPixels(sample));
  console.log(results);
  predict();
}

function windowResized(){
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
}