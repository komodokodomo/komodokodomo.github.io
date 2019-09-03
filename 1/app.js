var w,h;

var player = "nicname";

var questionDiv,questionDivText;
var imageDiv;
var answerDiv;
var chatDiv;

// var chatDivName = [];
var chatDivNameButtons = [][2];




function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  background(240);

  questionDiv = createDiv();
  questionDivText = createDiv("Question 1");
  questionDivText.parent(questionDiv);

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);
  questionDiv.style("background-color","LightGray");

  questionDivText.style("position","relative");
  questionDivText.style("text-align","center");
  questionDivText.style("left","50%");
  questionDivText.style("top","50%");
  questionDivText.style("transform","translate(-50%, -50%)");
  questionDivText.style("font","helvetica");
  questionDivText.style("font-size","2vw");


  stroke('LightGray');
  strokeWeight(4);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);

  noStroke();
  textAlign(CENTER,CENTER);
  textSize(w/80);
  textStyle(BOLD);
  text("Users nearby attempting same task",w/8,h/10);
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

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);
}