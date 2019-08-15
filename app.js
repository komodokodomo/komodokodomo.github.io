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

var majorNumber = 0; 
var majorDetected = false; 
var sampleTimer = 0;
var TTL = 4000; 
var ttlTimerMajor = 0; 
var ttlTimerMinor = 0;
var minorNumber = 0;
var minorDetected = false;
var highestEnergy = 0;
var beaconNumber;

var name;

var pingPeriod;
var pingPeriodMinor;
var lastPing;
var lastPingMinor;
var pingDuration = 800;
var pingTolerance = 50;
var pingCounter = 0;
var pingCounterMinor = 0;


// var beacon =[ 
// // 22222,22161,22099,22039,21978,21918,21858,21798,21739,21680,21622,
// // 21563,21505,21448,21390,21333,21277,21220,21164,21108,21053,20997,
// // 20942,20888,20833,20779,20725,20672,20619,20566,20513,20460,20408,
// // 20356,20305,20253,20202,20151,20101,20050,20000,19950,19900,19851,
// // 19802,19753,19704,19656,19608,19560,19512,19465,19417,19370,19324,
// 19277,19231,19185,19139,19093,19048,19002,18957,18913,18868,18824,
// 18779,18735,18692,18648,18605,18561,18519,18476,18433,18391,18349,
// 18307,18265,18223,18182,18141,18100,18059,18018,17978,17937,17897,
// ];


// var beacon =[ 
//   19277,19185,19093,19002,18913,18824,
//   18779,18692,18605,18519,18433,18349,
//   18307,18223,18141,18059,17978,17897,
//   ];

var beacon = [19185,19002,18824,18779,18692,18605,18519,18349,18307,18223,18059,17897];
  
var socket;

var gamepin;
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


  gamepin = createInput('');
  gamepin.attribute('placeholder', 'GAME PIN');
  gamepin.style('text-align', 'center');
  gamepin.position(w/2 - gamepin.size().width/2,h/2- gamepin.size().height/2+300);
  console.log(gamepin.size());
  gamepin.input(typeEvent);

  button = createButton("ENTER");
  button.position(w/2 - button.size().width/2,h/2- button.size().height/2+300 + 1.5*gamepin.size().height);
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
    var spectrum = fft.analyze();
    for(var i = 0; i<beacon.length; i++)
    {
      if (fft.getEnergy(beacon[i])>highestEnergy){
        highestEnergy = fft.getEnergy(beacon[i]);
        beaconNumber = i;
      }
    }
    if(millis()-sampleTimer>800){
      sampleTimer = millis();
      console.log(beaconNumber + ",energy: " + highestEnergy);
      beaconNumber = null;
      highestEnergy=0;
    }

  }

}

function mouseClicked() {
}


function typeEvent() {
  name = this.value();
  console.log('typed: ', this.value());
}


function buttonClickEvent() { 
  if(name!== "123456"){
    startCon();
    mode = 1;
    button.hide();
    gamepin.hide();
  }
}




    //check broad spectrum bands
    //narrow down till exact spectrum is found
  //               |
  //               /\
  //             /\  /\
  //           /\ /\ /\ /\

  // if(fft.getEnergy(beacon[0],beacon[beacon.length-1])>upperThreshold/16)                                //  0 - 1/1
  // {
  //   if(fft.getEnergy(beacon[0],beacon[beacon.length/2-1])>upperThreshold/8)                            //  0 - 1/2
  //   {
  //     if(fft.getEnergy(beacon[0],beacon[beacon.length/4-1])>upperThreshold/4)                          //  0 - 1/4
  //     {
  //       if(fft.getEnergy(beacon[0],beacon[beacon.length/8-1])>upperThreshold/2)                        //  0 - 1/8
  //       {
  //         console.log("major : 1")
  //       }
  //       else if(fft.getEnergy(beacon[beacon.length/8],beacon[beacon.length/4-1])>upperThreshold/2)        // 1/8 - 1/4 
  //       {
  //         console.log("major : 2")
  //       }
  //     }
  //     else if(fft.getEnergy(beacon[beacon.length/4],beacon[beacon.length/2-1])>upperThreshold/2)          // 1/4 - 1/2
  //     {
  //       if(fft.getEnergy(beacon[beacon.length/4],beacon[3*beacon.length/8-1])>upperThreshold/2)           // 1/4 - 3/8
  //       {
  //         console.log("major : 3")
  //       }
  //       else if(fft.getEnergy(beacon[3*beacon.length/8],beacon[beacon.length/2-1])>upperThreshold/2)      // 3/8 - 1/2
  //       {
  //         console.log("major : 4")
  //       }
  //     }
  //   }
  //   else if(fft.getEnergy(beacon[beacon.length/2],beacon[beacon.length-1])>upperThreshold/8)             // 1/2 - 1/1
  //   {
  //       if(fft.getEnergy(beacon[beacon.length/2],beacon[3*beacon.length/4-1])>upperThreshold/4)          // 1/2 - 3/4
  //       {
  //         if(fft.getEnergy(beacon[beacon.length/2],beacon[5*beacon.length/8-1])>upperThreshold/2)        // 1/2 - 5/8
  //         {
  //           console.log("major : 5")
  //         }
  //         else if(fft.getEnergy(beacon[5*beacon.length/8],beacon[3*beacon.length/4-1])>upperThreshold/2)   // 5/8 - 3/4 
  //         {
  //           console.log("major : 6")
  //         }
  //       }
  //       else if(fft.getEnergy(beacon[3*beacon.length/4],beacon[beacon.length-1])>upperThreshold/4)       // 3/4 - 1/1
  //       {
  //         if(fft.getEnergy(beacon[3*beacon.length/4],beacon[7*beacon.length/8-1])>upperThreshold/2)      // 3/4 - 7/8
  //         {
  //           console.log("major : 7")
  //         }
  //         else if(fft.getEnergy(beacon[7*beacon.length/8],beacon[beacon.length-1])>upperThreshold/2)      // 7/8 - 1/1
  //         {
  //           console.log("major : 8")
  //         }
  //       }
  //     }
    
  // }
  // else{
  //   // console.log(fft.getEnergy(beacon[0],beacon[beacon.length-1]));
  // }