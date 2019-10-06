
var locationData;
var w,h,canvas;
// const mappa = new Mappa('Leaflet');
var key = "pk.eyJ1Ijoia29tb2Rva29kb21vIiwiYSI6ImNrMWJ5dWwwZzA4ZXUzYm1tNXZoOThjaGkifQ.WfwJZJkKAGFFJxH0d0GYeA";

var options = {
  lat: 1.3521,
  lng: 103.8198,
  zoom: 14,
  studio: true, // false to use non studio styles
  //style: 'mapbox.dark' //streets, outdoors, light, dark, satellite (for nonstudio)
  style: 'mapbox://styles/mapbox/light-v10',
  // zoomControl : false
};

// Create an instance of Leaflet
const mappa = new Mappa('Mapbox', key);
let myMap;


var mode = 0; 

const http = new XMLHttpRequest();
var formUrl;

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
// var question,questionText;
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





//https://docs.google.com/forms/d/e/1FAIpQLSecFpTG3ggWD6GYEe40FcQYEXCdtJ6S5q4Iv6alfYxpdy8KXg/formResponse?entry.1852266277={{ROOMID}}&entry.611071440={{NICKNAME}}&entry.207705783={{TEXT}}
//https://api.sheety.co/d1251137-9a5b-457e-9b6c-b70a4f5bf675







//https://docs.google.com/forms/d/e/1FAIpQLSecFpTG3ggWD6GYEe40FcQYEXCdtJ6S5q4Iv6alfYxpdy8KXg/viewform?usp=pp_url&entry.1852266277=ROOMID&entry.611071440=NICKNAME&entry.207705783=TEXT


window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if ('SpeechRecognition' in window) {
  const recognition = new window.SpeechRecognition();
  console.log("dictation supported");
  recognition.interimResults = true;
  // recognition.maxAlternatives = 10;
  recognition.continuous = true;
  recognition.start();

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = "";
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      let transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        console.log("FINAL: " +finalTranscript);
        // formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSecFpTG3ggWD6GYEe40FcQYEXCdtJ6S5q4Iv6alfYxpdy8KXg/formResponse?entry.1852266277="+{{ROOMID}}+"&entry.611071440="+{{NICKNAME}}+"&entry.207705783="+{{TEXT}};
        // http.open("POST",formUrl);
        // http.send();
      } else {
        interimTranscript += transcript;
        console.log("INTERIM: " + interimTranscript);
      }
    }
  }
//   // speech recognition API supported
} else {
  console.log("dictation not supported");
  alert("Please use Chrome or Firefox");
}

function preload() {
  let url = 'https://api.sheety.co/9b122d4c-2e08-4749-b8d8-4d49bbd56886';
  jsonFile = loadJSON(url);
}

function doThisOnLocation(position){
  print("lat: " + position.latitude);
  options.lat=position.latitude;
  options.lng=position.longitude;
  console.log(position.accuracy);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // myMap.map.flyTo([-33.448890, -70.669265], 9);


  print("long: " + position.longitude);
}

function setup(){
  w = window.innerWidth;                                                    
  h = window.innerHeight;
  canvas = createCanvas(w,h);
  canvas.id("canvas");

  getCurrentPosition(doThisOnLocation);


  if(geoCheck() == true){
		console.log("GPS available");
	}else{
		console.log("no GPS");
	}

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

    locations[i].hide();
    locationsText[i].hide();

    peakDetect[i] = new p5.PeakDetect(beacon[i]-bandwidth, beacon[i]+bandwidth, 0.2,1);  
  }

  if(w > h){refDimensions = h;}
  else{refDimensions = w;}
  

  gamepin = createInput('');
  // gamepin.parent("canvas");
  gamepin.attribute('placeholder', 'NICKNAME');
  gamepin.style('text-align', 'center');
  gamepin.style('z-index',"2");
  gamepin.id("gamepin");
  gamepin.input(typeEvent);
  gamepin.size(refDimensions*3/5,refDimensions*3/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  gamepin.elt.focus();

  button = createButton("SUBMIT");
  // button.parent("canvas");
  button.size(gamepin.width,gamepin.height);
  button.style('z-index',"2");
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  button.mousePressed(enterButtonEvent);

  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);


  userStartAudio(mic).then(function() 
  {
    console.log("audio enabled");                                           //** debug **
    fft = new p5.FFT();                                                     //initialize new FFT object
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
    // background(245);                                                        //set background to light grey
    fill(0);
    textAlign(CENTER);
    textSize(32);
    text("psst",w/2,h/2);
    // rect(0,9*h/10,w,h);
    // imageMode(CENTER);                                                      //align image coordinates to CENTER
  }
  else
  { 
    // background(245);    
    let region = scanBeacon();  
    if(region!==undefined){console.log(region);}                                                             //                                                                  //
    checkRegionChange();                                                    //
  }
}


function typeEvent() {
  INPUT = this.value();                                                     //update INPUT data with whatever is typed
}

function enterButtonEvent() { 
  if(mode == 0){                                                            //at initial screen
    if(INPUT !== null){                                                     //if something was actually typed on the screen
    name = INPUT;
    startCon();                                                             //enter game lobby //set value of "name" to whatever was typed
    mode = 2;   
    button.hide();                                                          //hide away button
    gamepin.hide();   
    background(245);    
    fullscreen();

    console.log("welcome " + name)                                          //** debug **
  }
}
}




function scanBeacon()
{
  var lastPingDetected= [];
  var spectrum = fft.analyze();                                                            // get FFT data for subsequent analysis
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
      return(lastPingDetected[i]);
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
    console.log("room change"); 
    beaconPrevChosen = beaconChosen;                                                    // ** debug **
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
  // myMap.map.flyTo([-33.448890, -70.669265], 9);
  console.log("window innerDimension change detected");  
  w = window.innerWidth; 
  h = window.innerHeight;
  canvas.size(w, h);

  if(w > h){refDimensions = h;}
  else{refDimensions = w;}
 
  gamepin.size(refDimensions*3/5,refDimensions*3/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  button.size(gamepin.width,gamepin.height);
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  // for(var i = 0; i<4; i++)
  // {
  //   buttonOpt[i].size(w/2,h/6);
  //   buttonOpt[i].position((i%2)*w/2,floor(i/2)*h/6 + 2*h/3);
  // }

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
  // question.size(w,h/6);
}






