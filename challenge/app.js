let logo;
let region;

var w;
var h;
var mode = 0;


function setup(){
  w = window.innerWidth;
  h = window.innerHeight;
	createCanvas(w,h);
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
    content = null;
    content = Quiet.mergeab(content, recvPayload);
    console.log(Quiet.ab2str(content));
    mode = 1;
};

function onReceiverCreateFail(reason) {
    console.log("failed to create quiet receiver: " + reason);
};

function onReceiveFail(num_fails) {
    warningbox.classList.remove("hidden");
    console.log("It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.");
}

function draw(){
  if(mode==0){
    background(245);
    imageMode(CENTER);
    image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);
    }
  else if(mode == 1){
    background(245);
    textMode(CENTER,CENTER);
    textSize(32);
    text(content,w/2,h/2);
  }

}

function mouseClicked() {

}



