let logo;
let region;

var w;
var h;
var mode = 0; // 0 - login  1 -
var code = "";

var mic;
var fft;
var upperThreshold = 70;
var lowerThreshold = 50;
var peaked = [];
var energy = [];
var energyMinor = [];
var peakedMinor = [];

var majorNumber = 0; var majorDetected = false; var TTL = 4000; var ttlTimerMajor = 0; var ttlTimerMinor = 0;
var minorNumber = 0;
var minorDetected = false;

var name;

var pingPeriod;
var pingPeriodMinor;
var lastPing;
var lastPingMinor;
var pingDuration = 600;
var pingTolerance = 50;
var pingCounter = 0;
var pingCounterMinor = 0;

var major = [18182,18519,18868,19231,19608,20000,20408,20833,21277,21739,22222];
// var major = [22222,21739,21277,20833,20408,20000,19608,19231,18868,18519,18182];

var minor =[ 
[22161,22099,22039,21978,21918,21858,21798],
[21680,21622,21563,21505,21448,21390,21333],
[21220,21164,21108,21053,20997,20942,20888],
[20779,20725,20672,20619,20566,20513,20460],
[20356,20305,20253,20202,20151,20101,20050],
[19950,19900,19851,19802,19753,19704,19656],
[19560,19512,19465,19417,19370,19324,19277],
[19185,19139,19093,19048,19002,18957,18913],
[18824,18779,18735,18692,18648,18605,18561],
[18476,18433,18391,18349,18307,18265,18223],
[18141,18100,18059,18018,17978,17937,17897],
];

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

  console.log(major.length + ", " + minor[0].length);
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

    //check major spectrum
    //confirm steady frequency
    //check minor spectrum


    if(!majorDetected){
  //   for(var i = 0; i<major.length; i++){
  //     energy[i] = fft.getEnergy(major[i]);
     
  //   if(!peaked[i] && energy[i]<upperThreshold){}
  //   else if(!peaked[i] && energy[i]>=upperThreshold){peaked[i]=true;}
  //   else if(peaked[i] && energy[i]>=upperThreshold){}
  //   else if(peaked[i] && energy[i]<=lowerThreshold){
  //     peaked[i] = false;
  //     majorNumber = i;
  //     majorDetected = true;
  //     TTLtimerMajor = millis();
  //   }
  // }
  for(var j=0; j<major.length; j++){
    energy[j] =  fft.getEnergy(major[j]);
    if(energy[j]>upperThreshold){majorDetected = true;majorNumber=j;ttlTimerMajor = millis();return;}
    } 
 }
 else{
      if(millis()-ttlTimerMajor>TTL){
        majorDetected = false;
        pingCounter = 0;
        pingPeriod = millis()- lastPing;
        console.log(pingPeriod + ", counter: " + pingCounter);
        return;
      }
      energy[majorNumber] = fft.getEnergy(major[majorNumber]);
      if(!peaked[majorNumber] && energy[majorNumber]<upperThreshold){}
      else if(!peaked[majorNumber] && energy[majorNumber]>=upperThreshold){peaked[majorNumber]=true;}
      else if(peaked[majorNumber] && energy[majorNumber]>=upperThreshold){}
      else if(peaked[majorNumber] && energy[majorNumber]<=lowerThreshold){
        peaked[majorNumber] = false;
        pingPeriod = millis()- lastPing;
        if(abs(pingPeriod-pingDuration)<pingTolerance)
        {
          pingCounter++;
          ttlTimerMajor = millis();
        }
        lastPing = millis();
        console.log("major: " + majorNumber + ", period: " + pingPeriod + ", counter: " + pingCounter);
      }
    
    if(!minorDetected){
    for(var j=0; j<minor[majorNumber].length; j++){
    energyMinor[j] =  fft.getEnergy(minor[majorNumber][j]);
    if(energyMinor[j]>upperThreshold){minorDetected = true;minorNumber=j;ttlTimerMinor = millis();return;}
    }  
    }
    else{
      if(millis()-ttlTimerMinor>TTL){
        minorDetected = false;
        pingCounterMinor = 0;
        pingPeriodMinor = millis()- lastPingMinor;
        console.log(pingPeriodMinor + ", counterMinor: " + pingCounterMinor);
        return;
      }
      energyMinor[minorNumber] = fft.getEnergy(minor[majorNumber][minorNumber]);
      if(!peakedMinor[minorNumber] && energyMinor[minorNumber]<upperThreshold){}
      else if(!peakedMinor[minorNumber] && energyMinor[minorNumber]>=upperThreshold){peakedMinor[minorNumber]=true;}
      else if(peakedMinor[minorNumber] && energyMinor[minorNumber]>=upperThreshold){}
      else if(peakedMinor[minorNumber] && energyMinor[minorNumber]<=lowerThreshold){
        peakedMinor[minorNumber] = false;
        pingPeriodMinor = millis()- lastPingMinor;
        if(abs(pingPeriodMinor-pingDuration)<pingTolerance)
        {
          pingCounterMinor++;
          ttlTimerMinor = millis();
        }
        lastPingMinor = millis();
        console.log("minor: " + minorNumber + ", period: " + pingPeriodMinor + ", counter: " + pingCounterMinor);
      }  
    }
    if(pingCounterMinor > 2 && pingCounter > 2){console.log("major: " + majorNumber +", minor: "+ minorNumber);}
    }
  

    
    background(245);
    textAlign(CENTER,CENTER);
    textSize(32);
  }

}

function mouseClicked() {
}



