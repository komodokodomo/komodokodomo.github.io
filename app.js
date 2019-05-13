let capture;
let logo;
let mainpage;
let region;
var mode = 0;
var clicked;
var timestamp;
  var w;
  var h;
// if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//   console.log("enumerateDevices() not supported.");
//   return;
// }

// List cameras and microphones.

// navigator.mediaDevices.enumerateDevices()
// .then(function(devices) {
//   devices.forEach(function(device) {
//     console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
//   });
// })
// .catch(function(err) {
//   console.log(err.name + ": " + err.message);
// });


var constraints = {
    video: {
      facingMode: { exact: "environment" }, 
    },
    audio: false
  };

function setup(){
	createCanvas(displayWidth,displayHeight);
  region = createImage(displayWidth-displayWidth*2/3,displayWidth-displayWidth*2/3);
	logo = loadImage('assets/Singpass.png');
  mainpage = loadImage('assets/Dashboard.png');
	// fullscreen(true);


      
}
function draw(){
   w = window.innerWidth;
   h = window.innerHeight;

  if(mode==0){
  background(245);
  imageMode(CENTER);
  image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);
  }

	else if(mode==1){
	background(245);
	imageMode(CENTER);
	// image(logo,displayWidth/2,displayHeight/2,displayWidth*44/100,displayWidth*44/(100*logo.width)*logo.height);
  image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);

  noFill();
  stroke(235,94,94);
  strokeWeight(2);
  // arc(displayWidth/2, displayHeight - 3*displayWidth/14, displayWidth/14, displayWidth/14, frameCount/8, frameCount/8 + 1.8*PI);
  arc(w/2, h - 3*w/14, w/14, w/14, frameCount/8, frameCount/8 + 1.8*PI);
  if(millis()-timestamp>5000){
    mode=2;
    // resizeCanvas(displayWidth, displayWidth*mainpage.height/mainpage.width);
    resizeCanvas(width, width*mainpage.height/mainpage.width);
    // window.location.href="main.html"
  }
	}
	else if(mode==2){
  // image(mainpage,width/2,height/2,width,width*mainpage.height/mainpage.width);
  image(mainpage,w/2,h/2,w,w*mainpage.height/mainpage.width);

	}
	
  else if(mode==3){
  if(capture.width<w){image(capture, w/2, h/2, w, w*capture.height/capture.width);} 
  else{image(capture, w/2, h/2, h*capture.width/capture.height, h);}
  region = get((displayWidth-displayWidth*2/3)/2,(displayHeight-displayWidth*2/3)/2,displayWidth*2/3,displayWidth*2/3);
  fill(0,100);
  noStroke();
  rect(0, 0, w, h);
  image(region,w/2,h/2,displayWidth*2/3,displayWidth*2/3);
  stroke(126);
  stroke(235,94,94,(sin(millis()/100)+1)*255/2);
  strokeWeight(1);
  line((displayWidth-displayWidth*2/3)/2, height/2, (displayWidth-displayWidth*2/3)/2+displayWidth*2/3, height/2);

	}

}

function mouseClicked() {
  // logo.resize(50, 100);
  if(mode==0){
    fullscreen(true);
    mode=1;
    timestamp=millis();
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w,h);
  }
  if(mode==2){
    if(mouseY>height-100){
    resizeCanvas(w,h);
    mode=3;
    background(245);
    startCam();
  }
  }
  console.log(document.location.href);

}

function startCam(){
  capture = createCapture(constraints);
  // capture.size(1920, 1080);
  capture.id("hello")
  capture.hide();

        let scanner = new Instascan.Scanner(
            {
                video: document.getElementById('hello'),
                mirror: false
            }
        );
        scanner.addListener('scan', function(content) {
            window.open(content, "_blank");
        });
        Instascan.Camera.getCameras().then(cameras => 
        {
            if(cameras.length > 0){
                scanner.start(cameras[1]);
            } else {
                text("Please enable Camera!",width/2,height/2);
            }
        });

}