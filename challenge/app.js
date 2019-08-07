let logo;
let region;

var w;
var h;
var mode = 0;
var code = "";

var mic;
var prof = "ultrasonic";

const socket;


function startCon(){
	socket = io('https://cotf.cf', {
  path: '/challenge',
  secure: true
});
	socket.on('connect', function() {
		socket.emit('challenge');
		console.log("connected");		 
	});
}

function setup(){
  w = window.innerWidth;
  h = window.innerHeight;
	createCanvas(w,h);
  region = createImage(displayWidth-displayWidth*2/3,displayWidth-displayWidth*2/3);
  logo = loadImage('assets/qr.png');
  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);

  Quiet.init({
    profilesPrefix: "/challenge/",
    memoryInitializerPrefix: "/challenge/",
    libfecPrefix: "/challenge/"
});

  userStartAudio(mic).then(function() {Quiet.addReadyCallback(onQuietReady, onQuietFail);
  });

  startCon();
}

function onQuietReady() {
  Quiet.receiver(
    {
    profile: prof,
    onReceive: onReceive,
    onCreateFail: onReceiverCreateFail,
    onReceiveFail: onReceiveFail
});
};

function onQuietFail(reason) {
  console.log("quiet failed to initialize: " + reason);
};



var target;
var warningbox;

function onReceive(recvPayload) {
    var content = new ArrayBuffer(0);
    content = Quiet.mergeab(content, recvPayload);
    code = Quiet.ab2str(content);
    console.log(code);
    mode = 1;
};

function onReceiverCreateFail(reason) {
    console.log("failed to create quiet receiver: " + reason);
};

function onReceiveFail(num_fails) {
    console.log("You may need to move the transmitter closer to the receiver and set the volume to 50%.");
}

function draw(){
  if(mode==0){
    background(245);
    imageMode(CENTER);
    image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);
    }
  else if(mode == 1){
    background(245);
    textAlign(CENTER,CENTER);
    textSize(32);
    text(code,w/2,h/2);
  }

}

function mouseClicked() {

}



