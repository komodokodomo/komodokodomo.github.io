// var w;
// var h;

// function setup(){
// w = window.innerWidth;
// h = window.innerHeight;
// createCanvas(w,h);
// background(245);
// }
// function draw(){}


let mic, fft;
var above = false;

function setup() {
  createCanvas(710, 400);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(200);

  let spectrum = fft.analyze();
  var energy = fft.getEnergy(19000);
  
  if(!above && energy>70){above=true;}
  else if(above && energy>70){}
  else if(above && energy<30){console.log("hello");above = false;}
  else if(!above && energy<30){}
  console.log(fft.getEnergy(19000));

  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}
