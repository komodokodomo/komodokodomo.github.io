let capture;
let logo;
let mainpage;
let region;
var mode = 0;
var clicked;
var timestamp;
var w;
var h;
var started;

var checkboxScreen,checkboxAR,checkboxAccess,checkboxChallenge;
var fullscreen,AR,access,shortcut;
var button;


  
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
  // mainpage.id("mainpage");

  checkboxScreen = createCheckbox('fullscreen', false);
  checkboxScreen.position(10,10);
  checkboxScreen.changed(myCheckedEvent);

  checkboxAR = createCheckbox('AR', false);
  checkboxAR.position(10,30);
  checkboxAR.changed(myCheckedEvent);

  checkboxAccess = createCheckbox('accessibility', false);
  checkboxAccess.position(10,50);
  checkboxAccess.changed(myCheckedEvent); 

  checkboxChallenge = createCheckbox('challenge', false);
  checkboxChallenge.position(10,70);
  checkboxChallenge.changed(myCheckedEvent); 

  button = createButton('start')
  button.position(10,90);
  button.mousePressed(startSketch);

  Quiet.init({
    profilesPrefix: "/scan/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/"
});

  Quiet.addReadyCallback(onQuietReady, onQuietFail);
}

function onQuietReady() {
  transmit = Quiet.transmitter({profile: "test", onFinish: onTransmitFinish});
  transmit.transmit(Quiet.str2ab("hello_world"));
};

function onQuietFail(reason) {
  console.log("quiet failed to initialize: " + reason);
};

function onTransmitFinish() {
console.log("done");
};
// called when the client loses its connection
// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     console.log("onConnectionLost:"+responseObject.errorMessage);
//   }
// }

// // called when a message arrives
// function onMessageArrived(message) {
//   console.log("onMessageArrived:"+message.payloadString);
// }
function startSketch(){
  checkboxScreen.remove();
  checkboxAR.remove();
  checkboxAccess.remove();
  checkboxChallenge.remove();
  button.remove();

    mode=1;
    timestamp=millis();
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w,h);
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
  image(mainpage,w/2,height/2,w,w*mainpage.height/mainpage.width);

	}
	
  else if(mode==3){
  if(capture.width<w){image(capture, w/2, h/2, w, w*capture.height/capture.width);} 
  else{image(capture, w/2, h/2, h*capture.width/capture.height, h);}
  region = get((displayWidth-displayWidth*2/3)/2,(displayHeight-displayWidth*2/3)/2,displayWidth*2/3,displayWidth*2/3);
  fill(0,100);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, w, h);
  image(region,displayWidth/2,displayHeight/2,displayWidth*2/3,displayWidth*2/3);
  stroke(126);
  stroke(235,94,94,(sin(millis()/100)+1)*255/2);
  strokeWeight(1);
  line((displayWidth-displayWidth*2/3)/2, displayHeight/2, (displayWidth-displayWidth*2/3)/2+displayWidth*2/3, displayHeight/2);


  noStroke();
  fill(245);
  textSize(round(w/15));
  textAlign(CENTER,CENTER);
  // text("Scan the QR code on the QR login page", displayWidth/8, h/2+(displayWidth*1/3)*1.3, displayWidth-displayWidth/8, h/2+(displayWidth*1/3)*1.5);
    rectMode(CENTER);
    text("Scan the QR code on the QR login page", displayWidth/2, displayHeight/2+(displayWidth*1/2),displayWidth*3/4,displayWidth*3/4);

  
  fill(245);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, w, h/10);

  fill(100);
  textSize(round(w/15));
  textAlign(CENTER,CENTER);
  text("Scan QR code", w/2, h/20);
  text("←",w/10, h/20);
	}

}

function mouseClicked() {
  // logo.resize(50, 100);
  if(mode==0){
    // mode=1;
  }
  if(mode==2){
    if(mouseY>height-100){
    resizeCanvas(w,h);
    mode=3;
    background(245);
    if(!started){
    startCam();
    started = true;
    }
  }
  }
  else if(mode==3){
    if(mouseX<w/5 && mouseY<w/5){mode=2;resizeCanvas(width, width*mainpage.height/mainpage.width);}
  }
}

function startCam(){
  // capture.size(1920, 1080);
  capture = createCapture(constraints);
  capture.id("hello")
  capture.hide();

        let scanner = new Instascan.Scanner(
            {
                video: document.getElementById('hello'),
                mirror: false
            }
        );
        scanner.addListener('scan', function(content) {
            // window.open(content, "_blank");
            if(mode == 3 && content == "a"){
              console.log("success");
              //send a socket emit with pseudorandom number to server --> other webpage to change content
          }
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

function myCheckedEvent() {
  if (checkboxScreen.checked()) {
    console.log("fullscreen");
    fullscreen(true);
    resizeCanvas(w,h);
  } else {
    console.log("non-fullscreen");
    fullscreen(false);
    resizeCanvas(w,h);
  }
  if (checkboxAR.checked()) {
    console.log('AR!');
  } else {
    console.log('No AR');
  }
  if (checkboxAccess.checked()) {
    console.log('Accessible mode on');
  } else {
    console.log('Get out of my uncaring face');
  }
  if (checkboxChallenge.checked()) {
    console.log('Shortcut');
  } else {
    console.log('Longcut');
  }
}

  // checkboxScreen = createCheckbox('fullscreen', false);
  // checkboxScreen.changed(myCheckedEvent);

  // checkboxAR = createCheckbox('AR', false);
  // checkboxAR.changed(myCheckedEvent);

  // checkboxAccess = createCheckbox('accessibility', false);
  // checkboxAccess.changed(myCheckedEvent); 

  // checkboxShortcut = createCheckbox('shortcut', false);
  // checkboxShortcut.changed(myCheckedEvent); 