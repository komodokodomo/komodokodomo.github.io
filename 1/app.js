var w,h;





function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  background(240);
  stroke(150);
  strokeWeight(4);
  line(w/3,0,w/3,h);
  line(w/3,3*h/5,w,3*h/5);
  textAlign(CENTER,CENTER);
  textSize(w/10);
  text("Users attempting same task",w/6,h/9);
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
  strokeWeight(4);
  line(w/3,0,w/3,h);
  line(w/3,3*h/5,w,3*h/5);
  text("Users attempting same task",w/6,h/9);
}