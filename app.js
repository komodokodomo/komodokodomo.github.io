
let logo;

var w,h;

var mode = 0; 

var mic;
var fft;
var peakDetect = [];
var upperThreshold = 80;
var lowerThreshold = 50;
var aboveThreshold = [];
var energy = [];
var peakEnergy = [];
var beaconCounter = [];
var beaconTimer = [];
var lastPing = [];
var TTL = 4000; 
var beaconDetected = [];
var beaconHighestPower = 0;
var beaconChosen = 99;
var beaconPrevChosen = 99;
var pingDuration = 900;
var pingTolerance = 40;
var beacon =[17429,17778,18141,18476,18824,19185,19560,19950,20356]; //safe space

var locations = [];
var locationsImage = [];
var locationsText = [];

var score;


var sampleTimer = 0;

var name,INPUT;

var socket;

var jsonFile;
var question,questionText;
var gamepin;
var button;
var buttonOpt = [];
var images = [];
var answered = [];
var refDimensions;


var lastPingPeak = [];

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

function preload() {
  let url = 'https://api.sheety.co/9b122d4c-2e08-4749-b8d8-4d49bbd56886';
  jsonFile = loadJSON(url);
}

function setup(){
  w = window.innerWidth;                                                    
  h = window.innerHeight;
  createCanvas(w,h);

  for(var i =0; i<Object.keys(jsonFile).length; i++)
  {
    images[i] = loadImage("https://cors-anywhere.herokuapp.com/"+jsonFile[i].link);

    locations[i] = createDiv();
    locations[i].size(w,h/6);
    locations[i].position(0,i*h*1.1/6);
    locationsText[i] = createDiv("Answered");
    locationsText[i].style("display","inline-block");
    locationsText[i].style("top","50%");
    locationsText[i].style("right","50%");
    locationsText[i].style("position","relative");
    locationsText[i].style("transform","translate(50%,-50%)");
    locationsText[i].style("font-size","2rem");
    locationsText[i].parent(locations[i]);
    locationsImage[i] = createImg(jsonFile[i].link);
    locationsImage[i].parent(locations[i]);
    locationsImage[i].style("object-fit","cover");
    locationsImage[i].style("display","inline-block");
    locationsImage[i].style("position","relative");
    locationsImage[i].style("width","100%");
    locationsImage[i].style("height","100%");
    locationsImage[i].style("padding-bottom","20px");
    // locationsImage[i].style("filter","grayscale(100%)");
    locations[i].hide();
    locationsText[i].hide();

    peakDetect[i] = new p5.PeakDetect(beacon[i]-100, beacon[i]+100, 0.3,30);
    // images.show();
  }

  if(w > h){refDimensions = h;}
  else{refDimensions = w;}
  
  logo = loadImage('assets/logo.png');

  gamepin = createInput('');
  gamepin.attribute('placeholder', 'NICKNAME');
  gamepin.style('text-align', 'center');
  gamepin.id("gamepin");
  gamepin.input(typeEvent);
  gamepin.size(refDimensions*3/5,refDimensions*3/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  gamepin.elt.focus();

  button = createButton("SUBMIT");
  button.size(gamepin.width,gamepin.height);
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  button.mousePressed(enterButtonEvent);

  question = createDiv("");
  question.style('text-align', 'center');
  question.style('margin', '0 auto');
  question.style('background-color', 'darkgrey');
  question.style('font-size', '1.2rem');
  question.position(0,0);
  question.size(w,h/6);

  questionText = createDiv("")
  questionText.parent(question);
  questionText.id("question");
  questionText.style("display","inline-block");
  questionText.style("top","50%");
  questionText.style("right","50%");
  questionText.style("position","relative");
  questionText.style("transform","translate(50%,-50%)");
  question.hide();

  for(var i = 0; i<4; i++)
  {
    buttonOpt[i] = createButton("SUBMIT",i.toString());
    buttonOpt[i].id(i.toString());
    buttonOpt[i].size(w/2,h/6);
    buttonOpt[i].position((i%2)*w/2,floor(i/2)*h/6 + 2*h/3);
    buttonOpt[i].mousePressed(optionButtonEvent);
    buttonOpt[i].hide();
  }
  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);


  userStartAudio(mic).then(function() 
  {
    console.log("audio enabled");                                           //** debug **
    fft = new p5.FFT();                                                     //initialize new FFT object
    // fft.smooth(0.3);                                                     //set how much smoothing FFT receives
    fft.setInput(mic);                                                      //set which input FFT analyzes
  });

  for(var i = 0; i<beacon.length; i++)                                      //initialize array values to 0
  {
    beaconDetected[i] = false;                                              //////////////////////////////
    beaconCounter[i] = 0;                                                   //////////////////////////////
    beaconTimer[i] = 0;                                                     //////////////////////////////
    lastPing[i] = 0;                                                        //////////////////////////////
  }

}



function draw()
{
  if(mode==0)
  {                                                                         //home screen + ask for NICKNAME
    background(245);                                                        //set background to light grey
    imageMode(CENTER);                                                      //align image coordinates to CENTER
    image(logo,w/2,h/2 - 1.1*gamepin.size().height - refDimensions*44/(100*logo.width)*logo.height,refDimensions*44/100,refDimensions*44/(100*logo.width)*logo.height);         //display loaded image
  }
  else if(mode == 1)
  {                                                                         //home screen + ask for PIN
    background(245);                                                        //set background to light grey
    imageMode(CENTER);                                                      //align image coordinates to CENTER
    image(logo,w/2,h/2 - 1.1*gamepin.size().height - refDimensions*44/(100*logo.width)*logo.height,refDimensions*44/100,refDimensions*44/(100*logo.width)*logo.height);         //display loaded image
  }
  
  else
  {                                                                         //    
    scanBeacon();                                                           //
    checkRegionChange();                                                    //
  }
}

function mouseClicked() 
{
}

function typeEvent() {
  INPUT = this.value();                                                     //update INPUT data with whatever is typed
  //console.log(INPUT);                                                     //** debug **
}

function enterButtonEvent() { 
  if(mode == 0){                                                            //at initial screen
    if(INPUT !== null){                                                     //if something was actually typed on the screen
    name = INPUT;                                                           //set value of "name" to whatever was typed
    mode = 1;                                                               //then change to PIN entering mode
    gamepin.attribute('placeholder', 'PIN');                                //change the placeholder text within input from "NICKNAME" to "PIN"
    document.getElementById('gamepin').value = '';                          //reset INPUT value to 0;
    document.getElementById('gamepin').type = 'tel';                        //reset INPUT value to 0;
    console.log("welcome " + name)                                          //** debug **
  }
}
  else if(mode ==1 ){
  if(INPUT == "123456"){                                                    //if players key in the right PIN
    startCon();                                                             //enter game lobby
    mode = 2;                                                               //change to task screen
    button.hide();                                                          //hide away button
    gamepin.hide();                                                         //hide input button
    console.log("correct PIN");                                             // ** debug **
    background(245);                                                        //
    textAlign(CENTER,CENTER);                                               //
    textSize(32);     
    for(var i =0; i<Object.keys(jsonFile).length; i++)
    {
      locations[i].show();
    }
  }
  else{                                                                     //if player keys in a wrong PIN
    console.log("wrong PIN");
  }
}
}


function optionButtonEvent() 
{
  console.log(this.value());
  if(this.value() == jsonFile[beaconChosen].answer)
  {
    console.log("correct!");
    socket.emit('correct',beaconChosen);
    answered[beaconChosen] = true;
  }
  else
  {
    console.log("wrong!!");
    socket.emit('wrong',beaconChosen);
    answered[beaconChosen] = true;
  }
    background(245);                                                        //
    textAlign(CENTER,CENTER);                                               //
    textSize(32); 
    text("answered",w/2,h/2);
    question.hide();
    for(var i = 0; i<4; i++)
    {
        buttonOpt[i].hide();
    }
  
}

function scanBeacon()
{
  var spectrum = fft.analyze();                                             // get FFT data for subsequent analysis
  for(var i = 0; i<beacon.length; i++)                                      // repeat the same actions for all the frequencies listed
  {
    peakDetect[i].update(fft); 
    if ( peakDetect[i].isDetected ) {
      // console.log()
      console.log("peak found in band:" + i +", last ping heard: " + (millis()-lastPingPeak[i]));
      lastPingPeak[i] = millis();
    }
    energy[i] = fft.getEnergy(beacon[i]);                                   // get the amplitude of a particular frequency
    if(!aboveThreshold[i] && energy[i]<upperThreshold)
    {                                                                       // if amplitude is below threshold and "aboveThreshold" flag is still false
      if(millis()-beaconTimer[i]>TTL && beaconDetected[i]==true)
      {                                                                     // if the time elapsed since last detected ping exceeds the TTL(Time to Live) value and beacon is still considered detected
          beaconDetected[i] = false;                                        // set the "beaconDetected" flag to FALSE
          beaconCounter[i] = 0;                                             // reset the beaconCounter for that frequency to 0
          console.log("disconnected from "+ i);                             // ** debug **
          if(beaconChosen == i){beaconChosen = 99;}                        // 
      }
    }
    else if(!aboveThreshold[i] && energy[i]>=upperThreshold)
    {
      aboveThreshold[i]=true;                                               //change "aboveThreshold" flag to TRUE
    }
    else if(aboveThreshold[i] && energy[i]>=lowerThreshold)
    {
      if(energy[i]>peakEnergy[i])
      {
        peakEnergy[i] = energy[i];
      }
    }
    else if(aboveThreshold[i] && energy[i]<lowerThreshold)
    {
      aboveThreshold[i] = false;
      if(millis()-lastPing[i]<pingDuration+pingTolerance && millis()-lastPing[i]>pingDuration-pingTolerance)
      {
          // console.log(millis() - beaconTimer[i]);
          beaconTimer[i] = millis();
          beaconCounter[i] = beaconCounter[i] + 1;
          // console.log("beacon "+ i +", count: " + beaconCounter[i] +", pow: " +peakEnergy[i]);
          if(peakEnergy[i]>beaconHighestPower){beaconHighestPower = peakEnergy[i]; beaconChosen = i;} 
          peakEnergy[i] = 0;       
      }
      // else
      // {
      //   beaconCounter[i] = 0;                                             //EXPERIMENTAL - testing whether it will make RX more error-resistant
      // }
      lastPing[i] = millis();
    }
    if(beaconCounter[i]>2){
      beaconDetected[i] = true;
    }
  }
  beaconHighestPower=0;

if(millis()-sampleTimer>pingDuration)
  {
    if(beaconCounter[beaconChosen]>2)
    {
      // console.log("at region "+beaconChosen);
    }
    else if(beaconChosen == 99)
    {
      // console.log("no region detected");
    }
  sampleTimer = millis();
  }
}

function checkRegionChange()
{
  if(beaconChosen !== beaconPrevChosen)
  {
    socket.emit('change',beaconChosen.toString()+","+beaconPrevChosen.toString());  // Update server that client has changed rooms
    console.log("room change");                                                     // ** debug **
    
    if(beaconChosen!==99)                                                          // if a particular beacon is detected          
    {
    for(var i =0; i<Object.keys(jsonFile).length; i++)
    {
      locations[i].hide();
    }
    if(!answered[beaconChosen])
    {
      for(var i = 0; i<4; i++)
      {
          buttonOpt[i].size(w/2,h/6);
          buttonOpt[i].position((i%2)*w/2,floor(i/2)*h/6 + 2*h/3);
          if(i == 0){buttonOpt[i].html(jsonFile[beaconChosen].opt0);}
          else if(i == 1){buttonOpt[i].html(jsonFile[beaconChosen].opt1);}
          else if(i == 2){buttonOpt[i].html(jsonFile[beaconChosen].opt2);}
          else if(i == 3){buttonOpt[i].html(jsonFile[beaconChosen].opt3);}
          buttonOpt[i].show();
      }
        background(245);                                                        //
        textAlign(CENTER,CENTER);                                               //
        textSize(32);     
        questionText.html(jsonFile[beaconChosen].question);
        question.show();
        if(images[beaconChosen].height < images[beaconChosen].width)
        {
        image(images[beaconChosen], w/2, 5*h/12, w, (images[beaconChosen].height) * w/images[beaconChosen].width);
        }
        else
        {
        image(images[beaconChosen], w/2, 5*h/12, 5*h*w/images[beaconChosen].width/(12*images[beaconChosen].height), 5*h/12);
        }
    }
    else
    {
      background(245);                                                        //
      textAlign(CENTER,CENTER);                                               //
      textSize(32); 
      text("answered already lah",w/2,h/2);
      question.hide();
      for(var i = 0; i<4; i++)
      {
          buttonOpt[i].hide();
      }  
    }  
      // image(images[beaconChosen], w/2, 5*h/12);
      // images[beaconChosen].show();

    // submitButton.show();
    }
    else
    {
      background(245);                                                        //
      textAlign(CENTER,CENTER);                                               //
      textSize(32);     
      question.hide();
      for(var i = 0; i<4; i++)
      {
        buttonOpt[i].hide();
      }
      for(var i =0; i<Object.keys(jsonFile).length; i++)
      {
        locations[i].show();
        if(answered[i])
        {
          // fill(20,255,20);
          // rect(0,i*h/6,w,h/6);
          // locationsImage[i].style("filter","");
          locationsImage[i].style("opacity","0.2");
          locationsText[i].show();
        }
      }
    }
    beaconPrevChosen = beaconChosen;
  }
}

function startCon()
{
  socket = io('cotf.cf', {});
  socket.on('connect', function() 
  {
		socket.emit('hello',name);
		console.log("connected");		 
  });
  socket.on('roomchange', function(msg) 
  {
		console.log(msg);		 		 
  });
  socket.on('left', function(msg) 
  {
		console.log(msg);	
	});
}


function windowResized() {
  w = window.innerWidth; 
  h = window.innerHeight;
  resizeCanvas(w, h);

  if(w > h){refDimensions = h;}
  else{refDimensions = w;}
 
  gamepin.size(refDimensions*3/5,refDimensions*3/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  button.size(gamepin.width,gamepin.height);
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  for(var i = 0; i<4; i++)
  {
    buttonOpt[i].size(w/2,h/6);
    buttonOpt[i].position((i%2)*w/2,floor(i/2)*h/6 + 2*h/3);
  }

  for(var i =0; i<Object.keys(jsonFile).length; i++)
  {
  locations[i].size(w,h/6);
  locations[i].position(0,i*h*1.1/6);
  }


  if(beaconChosen!==99 && !answered[beaconChosen]){
    if(images[beaconChosen].height < images[beaconChosen].width)
    {
    image(images[beaconChosen], w/2, 5*h/12, w, (images[beaconChosen].height) * w/images[beaconChosen].width);
    }
    else
    {
    image(images[beaconChosen], w/2, 5*h/12, 5*h*w/images[beaconChosen].width/(12*images[beaconChosen].height), 5*h/12);
    }
  }
  question.size(w,h/6);
  console.log("window innerDimension change detected");  
}

// function drawTaskMenu(){
// for(var i=0; i<Object.keys(jsonFile).length; i++)
// {
// locations[i] = createDiv();
// locations[i].size(w,h/6);
// locations[i].position(0,i*h/6);
// locationsImage[i] = createImg("https://cors-anywhere.herokuapp.com/"+jsonFile[i].link);
// locationsImage[i].parent(locations[i]);
// locationsImage[i].style("object-fit","cover");
// locationsImage[i].style("display","inline-block");
// locationsImage[i].style("top","50%");
// locationsImage[i].style("right","50%");
// locationsImage[i].style("position","relative");
// }

// }




