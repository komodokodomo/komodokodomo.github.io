var w,h;

var player = "nicname";



function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  background(240);

  stroke(150);
  strokeWeight(4);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);

  noStroke();
  textAlign(CENTER,CENTER);
  textSize(w/80);
  textStyle(BOLD);
  text("Users attempting same task",w/8,h/10);
}

function draw() {
  
}

function mouseClicked() 
{
}

function windowResized()
{
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
  background(240);

  stroke(150);
  strokeWeight(4);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);
 
  noStroke();
  textSize(w/80);
  textStyle(BOLD);
  text("Users attempting same task",w/8,h/10);
}