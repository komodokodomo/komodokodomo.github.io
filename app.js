let logo;
let region;

var w;
var h;
var mode = 0; // 0 - login  1 -
var code = "";

var mic;
var fft;
var upperThreshold = 80;
var lowerThreshold = 50;
var peaked = false;
var name;

var pingFreq,lastPing,pingDuration = 1000,pingTolerance = 50,pingCounter = 0;

var socket;

var username;
var button;

function startCon(){
	socket = io('cotf.cf', {
});
	socket.on('connect', function() {
		socket.emit('hello',name);
		console.log("connected");		 
	});
}

function setup(){
  w = window.innerWidth;
  h = window.innerHeight;
	createCanvas(w,h);
  region = createImage(displayWidth-displayWidth*2/3,displayWidth-displayWidth*2/3);
  logo = loadImage('assets/tampines.png');


  username = createInput('');
  username.position(w/2 - username.size().width/2,h/2- username.size().height/2+300);
  console.log(username.size());
  username.input(myInputEvent);

  button = createButton("login");
  button.position(w/2 - button.size().width/2,h/2- button.size().height/2+300 + 1.5*username.size().height);
  button.mousePressed(buttonClickEvent)
  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);


  userStartAudio(mic).then(function() {
    console.log("audio enabled");
    fft = new p5.FFT();
    fft.setInput(mic);
  });
}


function myInputEvent() {
  name = this.value();
  console.log('typed: ', this.value());
}


function buttonClickEvent() { 
  if(name!== null){startCon();mode = 1;button.hide();username.hide();}
}



function draw(){
  if(mode==0){
    background(245);
    imageMode(CENTER);
    image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);
    }
  else if(mode == 1){
    var spectrum = fft.analyze();
    var energy = fft.getEnergy(20000);
    if(!peaked && energy<upperThreshold){}
    else if(!peaked && energy>=upperThreshold){peaked=true;}
    else if(peaked && energy>=upperThreshold){}
    else if(peaked && energy<=lowerThreshold){
      peaked = false;
      pingFreq = millis()- lastPing;
      if(abs(pingFreq-pingDuration)<pingTolerance){pingCounter++;}
      lastPing = millis();
      console.log(pingFreq + ", counter: " + pingCounter);
    }
    
    background(245);
    textAlign(CENTER,CENTER);
    textSize(32);
  }

}

function mouseClicked() {
}



