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



function setup(){
	createCanvas(displayWidth,displayHeight);
  region = createImage(displayWidth-displayWidth*2/3,displayWidth-displayWidth*2/3);
	logo = loadImage('assets/Singpass.png');


  Quiet.init({
    profilesPrefix: "/scan/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/"
});

  userStartAudio().then(function() {Quiet.addReadyCallback(onQuietReady, onQuietFail);
  });
}

function onQuietReady() {
  Quiet.receiver(
    {
    profile: "ultrasonic",
    onReceive: onReceive,
    onCreateFail: onReceiverCreateFail,
    onReceiveFail: onReceiveFail
});
};

function onQuietFail(reason) {
  console.log("quiet failed to initialize: " + reason);
};



var target;
var content = new ArrayBuffer(0);
var warningbox;

function onReceive(recvPayload) {
    content = Quiet.mergeab(content, recvPayload);
    console.log(Quiet.ab2str(content));
};

function onReceiverCreateFail(reason) {
    console.log("failed to create quiet receiver: " + reason);
};

function onReceiveFail(num_fails) {
    warningbox.classList.remove("hidden");
    console.log("It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.");
}

function draw(){
   w = window.innerWidth;
   h = window.innerHeight;
}

function mouseClicked() {

}



