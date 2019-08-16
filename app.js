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

var beaconDetected = [];
var beaconHighestPower = 0;
var beaconChosen = 0;

var peakDetect = [];


var sampleTimer = 0;
var TTL = 4000; 
var ttlTimer = 0; 

var highestEnergy = 0;

var name;


var pingDuration = 900;
var pingTolerance = 40;


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
// var beacon =[18059,18141,18223,18265,18913,19608,20356]; 

// var beacon =[ 
//   19277,19185,19093,19002,18913,18824,
//   18779,18692,18605,18519,18433,18349,
//   18307,18223,18141,18059,17978,17897,
//   ];

// var beacon = [18307,18779,19277,19802,20356,20942,18223,18692,19185,19704,20253,20833];
  
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
    fft.smooth(0.9);
    fft.setInput(mic);
  });

  for(var i = 0; i<beacon.length; i++)
  {
    beaconDetected[i] = false;
    beaconCounter[i] = 0;
    beaconPrevTimer[i] = 0;
    beaconTimer[i] = 0;
    peakDetect[i] = new p5.PeakDetect(beacon[i]-50,beacon[i]+50,0.5);
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
    var spectrum = fft.analyze();
  //   for(var i = 0; i<beacon.length; i++)
  // {
  //   peakDetect[i].update(fft);
  //   if ( peakDetect[i].isDetected ) {
  //     beaconTimer[i] = millis();
  //     console.log("beacon "+ i +", count: " + beaconCounter[i] + ", pow: " +fft.getEnergy(beacon[i]));
  //     if(abs(beaconTimer[i] - beaconPrevTimer[i] - pingDuration) < pingTolerance){
  //     beaconCounter[i]++;
  //     beaconPrevTimer[i] = millis();
  //     console.log("beacon "+ i +", count: " + beaconCounter[i] +", pow: " +fft.getEnergy(beacon[i]));
  //   }
  //   }
  //   if(beaconCounter[i]>2){beaconDetected[i] = true;console.log("connected to "+ i);}
  //   if(millis() - beaconTimer[i] > TTL && beaconDetected[i]==true){beaconDetected[i] = false;console.log("disconnected from "+ i);}
  // }
    for(var i = 0; i<beacon.length; i++)
    {
        energy[i] = fft.getEnergy(beacon[i]);
        if(!aboveThreshold[i] && energy[i]<upperThreshold){
          if(millis()-beaconTimer[i]>TTL && beaconDetected[i]==true){
            console.log("disconnected from "+ i);
            beaconDetected[i] = false;
            beaconCounter[i] = 0;
            if(beaconChosen == i){beaconChosen = null;}
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
          if(millis() - beaconTimer[i]<pingDuration+pingTolerance){
            console.log(millis() - beaconTimer[i]);
            beaconTimer[i] = millis();
            beaconCounter[i] = beaconCounter[i] + 1;
            console.log("beacon "+ i +", count: " + beaconCounter[i] +", pow: " +peakEnergy[i]);
            if(peakEnergy[i]>beaconHighestPower){beaconHighestPower = peakEnergy[i]; beaconChosen = i;} 
            peakEnergy[i] = 0;       
          }
          beaconTimer[i] = millis();
        }
      //   
      if(beaconCounter[i]>2){
        beaconDetected[i] = true;
      }
  }
  if(millis()-sampleTimer>1000){
  if(beaconCounter[beaconChosen]>2){console.log("at region "+beaconChosen);}
  sampleTimer = millis();
  }
  }


  }



function mouseClicked() {
}


function typeEvent() {
  name = this.value();
  // console.log('typed: ', this.value());
}


function buttonClickEvent() { 
  console.log("correct PIN");
  if(name == "123456"){
    startCon();
    mode = 1;
    button.hide();
    gamepin.hide();
  }
  else{
    console.log("wrong PIN");
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