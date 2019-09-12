var osc;
var playing = false;
var beaconNumber;
var timer = 0;
var on = false;

function setup() {
  textAlign(CENTER);

  sel = createSelect();
  sel.position(10, 10);
  sel.option('0');
  sel.option('1');
  sel.option('2');
  sel.changed(mySelectEvent);

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  osc.amp(0);
  osc.start();
  osc.connect();
}

function draw() {
  background(220);
  if(millis()-timer>40 && !on){osc.amp(1.0);on = true;timer=millis();}
  if(millis()-timer>160 && on){osc.amp(0.0);on = false;timer=millis();}

  // text('click to play', width/2, height/2);
}

// function mouseClicked() {
//   if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
//     if (!playing) {
//       // ramp amplitude to 0.5 over 0.05 seconds
//       osc.amp(0.5, 0.05);
//       playing = true;
//       backgroundColor = color(0,255,255);
//     } else {
//       // ramp amplitude to 0 over 0.5 seconds
//       osc.amp(0, 0.5);
//       playing = false;
//       backgroundColor = color(255,0,255);
//     }
//   }
// }

function mySelectEvent() {
  var item = sel.value();
  if(item == "0"){osc.freq(15000);}
  else if(item == "1"){osc.freq(18824);}
  else if(item == "2"){osc.freq(19185);}
}