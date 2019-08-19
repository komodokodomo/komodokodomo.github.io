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

var aboveThreshold = [];
var energy = [];
var peakEnergy = [];
var prevEnergy = [];
var beaconCounter = [];
var beaconTimer = [];
var beaconPrevTimer = [];
var lastPing = [];

var beaconDetected = [];
var beaconHighestPower = 0;
var beaconChosen = 999;
var beaconPrevChosen = 999;


var peakDetect = [];


var sampleTimer = 0;
var TTL = 4000; 
var ttlTimer = 0; 

var highestEnergy = 0;

var name,PIN;


var pingDuration = 900;
var pingTolerance = 40;

var question;


// var beacon =[ 
// 22222,22161,22099,22039,21978,21918,21858,21798,21739,
// 21680,21622,21563,21505,21448,21390,21333,21277,21220,
// 21164,21108,21053,20997,20942,20888,20833,20779,20725,
// 20672,20619,20566,20513,20460,20408,20356,20305,20253,
// 20202,20151,20101,20050,20000,19950,19900,19851,19802,
// 19753,19704,19656,19608,19560,19512,19465,19417,19370,
// 19324,19277,19231,19185,19139,19093,19048,19002,18957,
// 18913,18868,18824,18779,18735,18692,18648,18605,18561,
// 18519,18476,18433,18391,18349,18307,18265,18223,18182,
// 18141,18100,18059,18018,17978,17937,17897,17857,17817,
// 17778,17738,17699,17660,17621,17582,17544,17505,17467,
// 17429,17391,17354,17316,17279,17241,17204,17167,17131,17094,17058
// ];

var beacon =[17429,17778,18141,18476,18824,19185,19560,19950,20356]; //safe space



  
var socket;

var gamepin,nickname;
var button;
var radio;

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

  question = createElement('iframe');
  question.attribute('src', 'https://docs.google.com/forms/d/e/1FAIpQLSdterwwHt905pZvfXTkG7hYom9eN2SheF-InsGcvWCFjSS4yA/viewform?embedded=true');
  question.hide();

  radio = createRadio();
  radio.option('1');
  radio.option('2');
  radio.option('3');
  radio.option('4');
  radio.style('width', '60px');
  radio.hide();

  gamepin = createInput('');
  gamepin.attribute('placeholder', 'GAME PIN');
  gamepin.style('text-align', 'center');
  gamepin.position(w/2 - gamepin.size().width/2,h/2- gamepin.size().height/2+300);
  console.log(gamepin.size());
  gamepin.input(typeEvent);

  nickname = createInput('');
  nickname.attribute('placeholder', 'NAME');
  nickname.style('text-align', 'center');
  nickname.position(w/2 - nickname.size().width/2,h/2- nickname.size().height/2+330);
  console.log(gamepin.size());
  nickname.input(typeEvent2);

  button = createButton("ENTER");
  button.position(w/2 - button.size().width/2,h/2- button.size().height/2+300 + 3*gamepin.size().height);
  button.mousePressed(buttonClickEvent)
  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);


  userStartAudio(mic).then(function() {
    console.log("audio enabled");
    fft = new p5.FFT();
    // fft.smooth(0.3);
    fft.setInput(mic);
  });

  for(var i = 0; i<beacon.length; i++)
  {
    beaconDetected[i] = false;
    beaconCounter[i] = 0;
    beaconPrevTimer[i] = 0;
    beaconTimer[i] = 0;
    lastPing[i] = 0;
  }

}

function monitorBeacon(){
  var spectrum = fft.analyze();
  for(var i = 0; i<beacon.length; i++)
  {
      energy[i] = fft.getEnergy(beacon[i]);
      if(!aboveThreshold[i] && energy[i]<upperThreshold){
        if(millis()-beaconTimer[i]>TTL && beaconDetected[i]==true){
          console.log("disconnected from "+ i);
          beaconDetected[i] = false;
          beaconCounter[i] = 0;
          if(beaconChosen == i){beaconChosen = 999;}
        }
      }
      else if(!aboveThreshold[i] && energy[i]>=upperThreshold){aboveThreshold[i]=true;}
      else if(aboveThreshold[i] && energy[i]>=lowerThreshold){
      if(energy[i]>peakEnergy[i]){
        peakEnergy[i] = energy[i];
      }
    }
      else if(aboveThreshold[i] && energy[i]<lowerThreshold){
        aboveThreshold[i] = false;
        if(millis()-lastPing[i]<pingDuration+pingTolerance && millis()-lastPing[i]>pingDuration-pingTolerance){
          // console.log(millis() - beaconTimer[i]);
          beaconTimer[i] = millis();
          beaconCounter[i] = beaconCounter[i] + 1;
          // console.log("beacon "+ i +", count: " + beaconCounter[i] +", pow: " +peakEnergy[i]);
          if(peakEnergy[i]>beaconHighestPower){beaconHighestPower = peakEnergy[i]; beaconChosen = i;} 
          peakEnergy[i] = 0;       
        }
        lastPing[i] = millis();
      }
    if(beaconCounter[i]>2){
      beaconDetected[i] = true;
    }
  }
  beaconHighestPower=0;
if(millis()-sampleTimer>pingDuration){
if(beaconCounter[beaconChosen]>2){console.log("at region "+beaconChosen);}
else if(beaconChosen == 999){console.log("no region detected");}
// console.log("at region "+beaconChosen);
sampleTimer = millis();
}
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
    
    monitorBeacon();

    
  }
 
  if(beaconChosen !== beaconPrevChosen){
    socket.emit('change',beaconChosen.toString()+","+beaconPrevChosen.toString());
    console.log("room change");
    beaconPrevChosen = beaconChosen;}
  }


{/* <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdterwwHt905pZvfXTkG7hYom9eN2SheF-InsGcvWCFjSS4yA/viewform?embedded=true" width="640" height="1395" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe> */}
function mouseClicked() {
}


function typeEvent() {
  PIN = this.value();
  // console.log('typed: ', this.value());
}

function typeEvent2() {
  name = this.value();
  // console.log('typed: ', this.value());
}

function buttonClickEvent() { 
  console.log("correct PIN");
  if(PIN == "123456"){
    startCon();
    mode = 1;
    button.hide();
    gamepin.hide();
  }
  else{
    console.log("wrong PIN");
  }
}

