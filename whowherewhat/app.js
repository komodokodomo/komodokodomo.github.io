// ,
//     {
//       "type": "Feature",
//       "properties": {
//         "marker-color": "#7e7e7e",
//         "marker-size": "large",
//         "marker-symbol": "",
//         "popupContent": "<h2>MOE HQ (Buona Vista)</h2><p>3.5</p><span class=\"fas fa-star\"></span><span class=\"fas fa-star\"></span><span class=\"fas fa-star\"></span><span class=\"fas fa-star-half-alt\"></span><span class=\"far fa-star\"></span><p>And this is where our colleagues from MOE resides!</p>"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           103.79077076911926,
//           1.3053503757839529
//         ]
//       }
//     }

let floorplan;

var fence = new Array();
var fenceAlert = new Array();
var fenceAlertTrigger = new Array();


var locationData,lat,lng,acc;
var allPlaces;

var w,h,canvas;

let geoData;

var key = "pk.eyJ1Ijoia29tb2Rva29kb21vIiwiYSI6ImNrMWJ5dWwwZzA4ZXUzYm1tNXZoOThjaGkifQ.WfwJZJkKAGFFJxH0d0GYeA";
var listening = "";
var talking = false;
var spoken = false;

var currentPosition;
var currentPositionRadius;
var currentPositionCounter  = 0;

var options = {
  lat: 1.3521,
  lng: 103.8198,
  zoom: 12,
  pitch: 60,
  bearing: -60,
  studio: true, // false to use non studio styles
  //style: 'mapbox.dark' //streets, outdoors, light, dark, satellite (for nonstudio)
  style: 'mapbox://styles/mapbox/light-v10',
  zoomControl: false
  
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


var infoDiv;




//https://docs.google.com/forms/d/e/1FAIpQLSecFpTG3ggWD6GYEe40FcQYEXCdtJ6S5q4Iv6alfYxpdy8KXg/formResponse?entry.1852266277={{ROOMID}}&entry.611071440={{NICKNAME}}&entry.207705783={{TEXT}}
//https://api.sheety.co/d1251137-9a5b-457e-9b6c-b70a4f5bf675







//https://docs.google.com/forms/d/e/1FAIpQLSecFpTG3ggWD6GYEe40FcQYEXCdtJ6S5q4Iv6alfYxpdy8KXg/viewform?usp=pp_url&entry.1852266277=ROOMID&entry.611071440=NICKNAME&entry.207705783=TEXT



function preload() {
  let url = 'https://api.sheety.co/9b122d4c-2e08-4749-b8d8-4d49bbd56886';
  geoData = loadJSON("map.geojson");
  jsonFile = loadJSON(url);
}

// function onEachFeature(feature, layer) {
//   // does this feature have a property named popupContent?
//   if (feature.properties && feature.properties.popupContent) {
//       layer.bindPopup(feature.properties.popupContent);
//   }
// }

// function insideTheFence(position){
//   print("INlat: " + position.latitude);
//   print("INlong: " + position.longitude);
//   print("user is inside of the fence")
// }

// function outsideTheFence(position){
//   print("OUTlat: " + position.latitude);
//   print("OUTlong: " + position.longitude);
//   print("user is outside of the fence")
// }

function closeWindow(){
  infoDiv.hide();
  
  // [[103.78868132829666, 1.299394728490367], [103.78868132829666, 1.300470017493518]]
  const pos1 = myMap.latLngToPixel(103.790003657341,1.300470017493518);
  const pos2 = myMap.latLngToPixel(103.78868132829666, 1.299394728490367);
  image(floorplan, pos1.x,pos1.y,pos2.x-pos1.x,pos2.y-pos1.y);

 
// Draw an ellipse using pos
// ellipse(pos.x, pos.y, 10, 10);
}

function doThisOnLocation(position){
  // print("lat: " + position.latitude);
  // options.lat=position.latitude;
  // options.lng=position.longitude;
  // console.log(position.accuracy);
  // let mpp = (2*Math.PI*L.CRS.EPSG3857.R) / L.CRS.EPSG3857.scale(map.getZoom());
  acc = position.accuracy;
  lat = position.latitude;
  lng = position.longitude;
  myMap.map.flyTo([position.latitude, position.longitude], 16);
  

  var profileIcon = L.icon({
    iconUrl: 'profile.png',
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 8] // point from which the popup should open relative to the iconAnchor
  });

  myMap.map.on('zoomend', function() {
    var currentZoom = myMap.map.getZoom();
    profileIcon = new L.Icon({
        iconUrl: 'profile.png',
        iconSize: [currentZoom*2.5, currentZoom*2.5],
        iconAnchor: [currentZoom, currentZoom],
        popupAnchor: [0, 0],
    });
    // console.log("zoomed");
    currentPosition.setIcon(profileIcon);
});
  currentPosition = L.marker([lat, lng],{icon: profileIcon})
  .bindPopup("<img src = \"profile.png\" class =\"ppic\"><h1>Profile</h1><p>noob explorer</p><br><p>last trip: 22 days ago</p>",{width: "auto"})
  .addTo(myMap.map);
  
  currentPosition.on("popupopen", () => {
    console.log("hellooo");
  });

  
  currentPositionRadius = L.circle([lat, lng], {
    color: 'light-gray',
    stroke: false,
    // fillColor: '#f03',
    fillOpacity: 0.1,
    radius: acc
}).addTo(myMap.map);

// myMap.map.removeControl(myMap.map.zoomControl);

  // L.geoJSON(geoData, {onEachFeature: onEachFeature}).addTo(myMap.map);
  var imageUrl = 'https://drive.google.com/uc?export=view&id=1toc3fWB2mOA0k3mbPAQhcgCOMYYcisT4',
  imageBounds = [[103.790003657341,1.300470017493518],[103.78868132829666, 1.299394728490367]];

L.imageOverlay(imageUrl, imageBounds).addTo(myMap.map);
L.imageOverlay(imageUrl, imageBounds).bringToFront();


  for(let i =0; i<Object.keys(geoData.features).length; i++)
  {
    // console.log(geoData.features[i].geometry.coordinates);
    let c = centroid(geoData.features[i].geometry.coordinates[0]);
    
    let places = L.marker()
    .setLatLng([c[1], c[0]])
    .bindPopup(geoData.features[i].properties.popupContent)
    .addTo(myMap.map);
  
    fence[i] = [];

    for(let j=0; j<geoData.features[i].geometry.coordinates[0].length; j++){
    fence[i].push({lat:geoData.features[i].geometry.coordinates[0][j][1],lon:geoData.features[i].geometry.coordinates[0][j][0]});
    }

    fenceAlertTrigger[i] = false;

    fenceAlert[i] = new geoFencePolygon(
      fence[i],
      function(position){
        if(!fenceAlertTrigger[i]){
        console.log("i am in area " + i.toString());
        infoDiv.show(); 
        infoDiv.style("z-index","5");
        infoDiv.html("<h2>Sandcrawler</h2><p>0/2 journeys explored</p><img src=\"https://upload.wikimedia.org/wikipedia/en/a/aa/Star_Wars_Sandcrawler.png\" class = \"ppic\"><span>3.2 </span><span class=\"fas fa-star\"></span><span class=\"fas fa-star\"></span><span class=\"fas fa-star\"></span><span class=\"far fa-star\"></span><span class=\"far fa-star\"></span><p>Hi there, this is where the people who made this prototype work!</p><button type=\"button\" onclick=\"closeWindow()\">Lets explore! </button>");
        fenceAlertTrigger[i] = true;
      }
      },
      function(position){ 
        if(fenceAlertTrigger[i]){
          console.log("i am out of area " + i.toString()); 
          infoDiv.hide(); 
          fenceAlertTrigger[i] = false;
        }
      },
      'mi');
  }

  // console.log(fence);
  // console.log(fenceAlert);


//   for(let i = 0; i < allPlaces.length; i++){
//     let pos = myMap.latLngToPixel(allPlaces[i][1], allPlaces[i][0])
//     let places = L.marker()
//     .setLatLng([allPlaces[i][1], allPlaces[i][0]])
//     .bindPopup("hello")
//     .addTo(myMap.map);
// }

  watchPosition(positionChanged);
  print("lat: " + lat);
  print("long: " + lng);
  print("acc: " + acc);
}

function positionChanged(position){
  // myMap.map.flyTo([position.latitude, position.longitude], 16);
  acc = position.accuracy;
  lat = position.latitude;
  lng = position.longitude;
  currentPosition.setLatLng([lat, lng]);
  currentPositionRadius.setLatLng([lat, lng]);
  currentPositionRadius.getRadius(acc);
}

function drawPoints(){
    clear();
    fill(0);
    noStroke();
    text("field trip",10,h-10);
    noFill();
    stroke(0);

    let pos1 = myMap.latLngToPixel(1.300470017493518,103.790003657341);
    let pos2 = myMap.latLngToPixel(1.299394728490367,103.78868132829666);
    // console.log(pos1.x + ", " + pos1.y + ", "+ pos2.x + ", " + pos2.y)
    image(floorplan, pos1.x,pos1.y,pos2.x-pos1.x,pos2.y-pos1.y);
 
}

var centroid = function (arr)
{
    var minX, maxX, minY, maxY;
    for (var i = 0; i < arr.length; i++)
    {
        minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
        maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
        minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
        maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function setup(){
  w = window.innerWidth;                                                    
  h = window.innerHeight;
  canvas = createCanvas(w,h);
  canvas.id("canvas");

  floorplan = loadImage('floorplan.png');

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawPoints);

  console.log(geoData);
  allPlaces = myMap.geoJSON(geoData, "Point");
  console.log(allPlaces);


  if(geoCheck() == true){
		console.log("GPS available");
	}else{
		console.log("no GPS");
	}

  for(var i =0; i<beacon.length; i++)
  {
    peakDetect[i] = new p5.PeakDetect(beacon[i]-bandwidth, beacon[i]+bandwidth, 0.2,1);  
  }

  if(w > h){refDimensions = h;}
  else{refDimensions = w;}
  

  gamepin = createInput('');
  gamepin.attribute('placeholder', 'NICKNAME');
  gamepin.style('text-align', 'center');
  gamepin.style('z-index',"2");
  gamepin.id("gamepin");
  gamepin.input(typeEvent);
  gamepin.size(refDimensions*2/5,refDimensions*2/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  gamepin.elt.focus();

  button = createButton("SUBMIT");
  button.size(gamepin.width,gamepin.height);
  button.style('z-index',"2");
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  button.mousePressed(enterButtonEvent);

  infoDiv = createDiv();
  infoDiv.size(0.8*w,0.8*h);
  infoDiv.position(0.1*w,0.1*h);
  infoDiv.id("infoDiv");
  infoDiv.style("z-index","5");
  infoDiv.style("padding","20px");
  infoDiv.style("box-sizing", "border-box");
  infoDiv.style("background","white");
  infoDiv.style("opacity","0.95");
  infoDiv.hide();

  // infoDivContent = createDiv();
  // infoDivContent.parent(infoDiv);
  // infoDiv.style("background","white");

  
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
    clear();                                                      //set background to light grey
    fill(0);
    textSize(24);
    // text("parent-child companion app",10,h-10);
  }
  else
  { 
    // clear();
    // text("psst",10,h-10);
    // // noStroke();
    // // fill(255);
    // for(let i = 0; i < allPlaces.length; i++){
    //   let pos = myMap.latLngToPixel(allPlaces[i][1], allPlaces[i][0])
    //   ellipse(pos.x, pos.y, 50, 50);
    // }
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
    // background(245);    
    fullscreen();
    getCurrentPosition(doThisOnLocation);
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
 
  gamepin.size(refDimensions*2/5,refDimensions*2/20);
  gamepin.position(w/2 - gamepin.size().width/2,h/2-gamepin.size().height/2);
  button.size(gamepin.width,gamepin.height);
  button.position(w/2 - button.size().width/2,h/2- gamepin.size().height/2 + 1.1*gamepin.size().height);
  infoDiv.size(0.8*w,0.8*h);
  infoDiv.position(0.1*w,0.1*h);


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






