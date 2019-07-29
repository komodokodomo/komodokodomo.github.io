// var w;
// var h;

// function setup(){
// w = window.innerWidth;
// h = window.innerHeight;
// createCanvas(w,h);
// background(245);
// }
// function draw(){}

var proceed = false;
let mic, fft;
var above = false;
var BGvalue;

function setup() {
  createCanvas(710, 400);
  noFill();
  while(!proceed){}
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(BGvalue);

  let spectrum = fft.analyze();
  var energy = fft.getEnergy(19000);
  
  if(!above && energy>70){above=true;}
  else if(above && energy>70){}
  else if(above && energy<30){console.log("hello");above = false;BGvalue = random(255);}
  else if(!above && energy<30){}
  console.log(fft.getEnergy(19000));

  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}


function mouseClicked(){
proceed= true;
 mic = new p5.AudioIn();
 mic.start();
}