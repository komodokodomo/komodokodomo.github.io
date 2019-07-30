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
var above2 = false;
var BGvalue = 255;
// var proceed = false;

function setup() {
  createCanvas(710, 400);
  noFill();
  var myDiv = createDiv('click to start audio');
  myDiv.position(0, 0);
  // while(!proceed){}
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  userStartAudio().then(function() {myDiv.remove();});
}

function draw() {
  background(BGvalue);

  let spectrum = fft.analyze();
  var energy = fft.getEnergy(17897);
  var energy2 = fft.getEnergy(22222);
  
  if(!above && energy>90){above=true;}
  else if(above && energy>90){}
  else if(above && energy<50){console.log("hello");above = false;BGvalue = random(255);}
  else if(!above && energy<50){}
  console.log(energy2);

  if(!above2 && energy2>90){above2=true;}
  else if(above2 && energy2>90){}
  else if(above2 && energy2<50){console.log("hello too");above2 = false;}
  else if(!above2 && energy2<50){}

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
  console.log(getAudioContext().state);
  // proceed = true;
}