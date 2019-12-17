



let cameras = "";
let density;

let screenToggle,screenToggle2;

let maxBoxes = 1;

let canvas;

var humanDetected = false;
var constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};

var volume = 0.0;



let video;


let status;

var videoWidth = 1280;
var videoHeight = 720;

var w,h;

var music;

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




function setup() {
 
  w = window.innerWidth;
  h = window.innerHeight;

  density = pixelDensity();
  console.log("width: " + w + " height: " + h + " pixelDensity: " + pixelDensity());

  canvas = createCanvas(w, h);
  canvas.id("canvas");



  video = createCapture(constraints);
  video.size(videoWidth, videoHeight);
  video.hide();
  var test = document.getElementById("canvas");


  cocoSsd.load().then(model => {
    console.log("model loaded!");
    status = true;

    setInterval(function(){

      model.detect(test,maxBoxes).then(predictions => {
        console.log(predictions);
        if(predictions.length > 0){
          if(predictions.class == "person" && !humanDetected){humanDetected = true;volume=1.0;}
          else if(predictions.class == "person" && humanDetected){volume=1.0;}
          else if(predictions.class != "person" && humanDetected){
            humanDetected = false;        
            volume -= 0.1;
            if(volume<0.0){volume = 0.0;}
          }
          else if(predictions.class != "person" && !humanDetected){
            volume -= 0.1;
            if(volume<0.0){volume = 0.0;}
          }
      }
      else{
        volume -= 0.1;
        if(volume<0.0){volume = 0.0;}
      }
      });
    
  }
    , 250);
  }
  );

}


function draw() {


}


function windowResized(){
}


