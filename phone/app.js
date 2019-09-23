var osc;
var playing = false;
var beaconNumber;
var timer = 0;
var on = false;

var beacon =[17429,17778,18141,18476,18824,19185,19560,19950,20356];

function setup() {
  textAlign(CENTER);

  sel = createSelect();
  sel.position(10, 10);
  sel.option('channel 0');
  sel.option('channel 1');
  sel.option('channel 2');
  sel.option('channel 3');
  sel.option('channel 4');
  sel.option('channel 5');
  sel.option('channel 6');
  sel.option('channel 7');
  sel.changed(mySelectEvent);

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  osc.amp(0);
  osc.start();
  osc.connect();

  userStartAudio().then(function() {  
  });
}

function draw() {
  background(220);
  if(millis()-timer>40 && !on){osc.amp(1.0,5);on = true;timer=millis();}
  if(millis()-timer>160 && on){osc.amp(0.0,5);on = false;timer=millis();}
}


function mySelectEvent() {
  var item = sel.value();
  if(item == "channel 0"){osc.freq(beacon[0]);}
  else if(item == "channel 1"){osc.freq(beacon[1]);}
  else if(item == "channel 2"){osc.freq(beacon[2]);}
  else if(item == "channel 3"){osc.freq(beacon[3]);}
  else if(item == "channel 4"){osc.freq(beacon[4]);}
  else if(item == "channel 5"){osc.freq(beacon[5]);}
  else if(item == "channel 6"){osc.freq(beacon[6]);}
  else if(item == "channel 7"){osc.freq(beacon[7]);}
}