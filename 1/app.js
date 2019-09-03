var w,h;

var player = ["nicname","siwa","99pi"];

var questionDiv,questionDivText;
var imageDiv;
var images = [];
var answerDiv;
var chatDiv,chatDivText;

var submitButton;

var chatDivName = [];
var chatDivNameText = [];
var chatDivNameButtons = [][2];
var buttonText = ["chat","get location"];




function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  background(235);

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
  questionDivText.style("font-family","Helvetica, Arial, Sans-Serif");
  questionDivText.style("font-size","1.5em");


  chatDiv = createDiv();
  chatDivText = createDiv("0 Users nearby attempting same task");
  chatDivText.parent(chatDiv);
  chatDiv.position(0,0);
  chatDiv.size(w/4,h/10);

  chatDivText.style("position","relative");
  chatDivText.style("text-align","center");
  chatDivText.style("left","50%");
  chatDivText.style("top","50%");
  chatDivText.style("transform","translate(-50%, -50%)");
  chatDivText.style("font-family","Helvetica, Arial, Sans-Serif");
  chatDivText.style("font-size","1.1em");

  imageDiv = createDiv();
  imageDiv.position(w/4,h/10);
  imageDiv.size(3*w/4,h/2);

  
  for(var i; i<player.length; i++)
  {
    chatDivName[i] = createDiv();
    chatDivNameText[i] = createDiv(player[i]);
    chatDivName[i].position(0,(i+1)*h/10);
    chatDivName[i].size(w/4,h/10);

    chatDivName[i].style("position","relative");
    chatDivName[i].style("text-align","left");
    chatDivName[i].style("left","10%");
    chatDivName[i].style("top","50%");
    chatDivName[i].style("transform","translate(-50%, -50%)");
    chatDivName[i].style("font-family","Helvetica, Arial, Sans-Serif");
    chatDivName[i].style("font-size","1.1em");

    for(var j; j<2; j++)
    {
      chatDivNameButtons[i][j] = createButton(buttonText[j]);
      chatDivNameButtons[i][j].size(w/12,h/20);
      chatDivNameButtons[i][j].position(w/8,(i+1)*h/10 + j*h/20);
    }
  }





  stroke('LightGray');
  strokeWeight(4);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);

  // noStroke();
  // textAlign(CENTER,CENTER);
  // textSize(w/80);
  // textStyle(BOLD);
  // text("Users nearby attempting same task",w/8,h/10);
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
  background(235);

  stroke('LightGray');
  strokeWeight(4);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);
 
  // noStroke();
  // textSize(w/80);
  // textStyle(BOLD);
  // text("Users attempting same task",w/8,h/10);

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);

  chatDiv.position(0,0);
  chatDiv.size(w/4,h/10);

  imageDiv.position(w/4,h/10);
  imageDiv.size(3*w/4,h/2);
}