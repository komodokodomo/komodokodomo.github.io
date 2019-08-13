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
var peaked = [];
var energy = [];
var majorNumber,majorDetected = false,TTL = 4000,TTLtimer = 0;

var name;

var pingPeriod,lastPing,pingDuration = 1000,pingTolerance = 50,pingCounter = 0;

var major = [22222,21739,21277,20833,20408,20000,19608,19231,18868,18519,18182];
var minor1 = [22161,22099,22039,21978,21918,21858,21798];
var minor2 = [21680,21622,21563,21505,21448,21390,21333];

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

    if(!majorDetected){
    for(var i = 0; i<major.length; i++){
      energy[i] = fft.getEnergy(major[i]);
     
    if(!peaked[i] && energy[i]<upperThreshold){}
    else if(!peaked[i] && energy[i]>=upperThreshold){peaked[i]=true;}
    else if(peaked[i] && energy[i]>=upperThreshold){}
    else if(peaked[i] && energy[i]<=lowerThreshold){
      peaked[i] = false;
      majorNumber = i;
      majorDetected = true;
      TTLtimer = millis();
    }
  }
 }
 else{
      if(millis()-TTLtimer>TTL){majorDetected = false;return;}
      energy[majorNumber] = fft.getEnergy(major[majorNumber]);
      if(!peaked[majorNumber] && energy[majorNumber]<upperThreshold){}
      else if(!peaked[majorNumber] && energy[majorNumber]>=upperThreshold){peaked[majorNumber]=true;}
      else if(peaked[majorNumber] && energy[majorNumber]>=upperThreshold){}
      else if(peaked[majorNumber] && energy[majorNumber]<=lowerThreshold){
        peaked[majorNumber] = false;
        TTLtimer = millis();
        pingPeriod = millis()- lastPing;
        if(abs(pingPeriod-pingDuration)<pingTolerance){pingCounter++;}
        lastPing = millis();
        console.log(pingPeriod + ", counter: " + pingCounter);
      }

    }
  

    
    background(245);
    textAlign(CENTER,CENTER);
    textSize(32);
  }

}

function mouseClicked() {
}



