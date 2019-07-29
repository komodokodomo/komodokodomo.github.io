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
var BGvalue = 255;

function setup() {
  createCanvas(710, 400);
  noFill();
  var myDiv = createDiv('click to start audio');
   myDiv.position(0, 0);
  while(!proceed){}
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  userStartAudio().then(function() {myDiv.remove();});
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

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("resume pls");
  }
  console.log("touched");
  proceed = true;
}