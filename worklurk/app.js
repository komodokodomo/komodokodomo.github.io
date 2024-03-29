
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

var bandwidth = 80;
var lastPingPeak = [];
var lastPingPeakPeriod = [];
var lastPingPeakCounter = [];
var lastPingTtlTimer = [];
var lastPingTTL = [];
var lastPingEnergy = [];
var lastPingEnergyHighest = 0;
var lastPingChosen;
var numDetected;

var roomList = [[]];


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
    locations[i].size(w,w*9/16);
    locations[i].position(0,i*w*9*1.05/16);
  
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

    // locationsImage[i].style("border-radius","10%");
    // locationsImage[i].style("padding-bottom","20px");
    // locationsImage[i].style("filter","grayscale(100%)");
    locations[i].hide();
    locationsText[i].hide();

    peakDetect[i] = new p5.PeakDetect(beacon[i]-bandwidth, beacon[i]+bandwidth, 0.2,1);
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
    lastPingPeakCounter[i] = 0;
    lastPingTtlTimer[i] = 0;
    lastPingEnergy[i] = 0;
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
  var lastPingDetected= [];
  var spectrum = fft.analyze();                                             // get FFT data for subsequent analysis
  lastPingEnergyHighest = 0;
  for(var i = 0; i<Object.keys(jsonFile).length; i++)                                      // repeat the same actions for all the frequencies listed
  {   
    peakDetect[i].update(fft); 
    if ( peakDetect[i].isDetected ) 
    {
      lastPingPeakPeriod[i] = millis()-lastPingPeak[i];
      if(lastPingPeakPeriod[i]>170 && lastPingPeakPeriod[i]<230)
      {
        lastPingPeakCounter[i]++;
        lastPingEnergy[i] = fft.getEnergy(beacon[i]-bandwidth, beacon[i]+bandwidth);
        if(lastPingEnergy[i]>lastPingEnergyHighest)
        {
          lastPingEnergyHighest = lastPingEnergy[i];
          // lastPingChosen = i;
        }
      }
      // console.log("band:" + i +", last ping: " + lastPingPeakPeriod[i]+", counter: " + lastPingPeakCounter[i]+", energy: " + lastPingEnergy[i]+", chosen: " + beaconChosen);
      lastPingPeak[i] = millis();
      lastPingTtlTimer[i] = millis();
    }
    else
    {
      if(millis()-lastPingTtlTimer[i]>TTL/4)
      {
        lastPingPeakCounter[i] = 0;
        lastPingEnergy[i] = 0;
        if(i==beaconChosen){beaconChosen = 99;}
        // console.log("band:" + i +", last ping: " + lastPingPeakPeriod[i]+", counter: " + lastPingPeakCounter[i]);
      }
    }

  }
  for(var i = 0; i<beacon.length; i++)                                      // repeat the same actions for all the frequencies listed
  {
    if(lastPingPeakCounter[i]>8){lastPingDetected.push(i);}
  }

  for(var i = 0; i<lastPingDetected.length; i++)                                      // repeat the same actions for all the frequencies listed
  {
    // console.log("ping from: " +lastPingDetected[i]);
    if(lastPingEnergyHighest<lastPingEnergy[lastPingDetected[i]])
    {
      lastPingEnergyHighest = lastPingEnergy[lastPingDetected[i]];
      beaconChosen = lastPingDetected[i];
      // console.log("chose: "+beaconChosen);
    }
  }
  // console.log("region detected: " + lastPingChosen);

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
          locationsImage[i].style("opacity","0.1");
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
		socket.emit('hello',{name,room:beaconChosen});
		console.log("connected");		 
  });
  socket.on('someone-joined', function(msg) 
  {
		console.log(msg);	
	});
  socket.on('someone-change', function(msg) 
  {
		console.log(msg);		 		 
  });
  socket.on('someone-left', function(msg) 
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
  locations[i].size(w,w*9/16);
  locations[i].position(0,i*w*9*1.1/16);
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






