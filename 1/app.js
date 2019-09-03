var w,h;

var player = ["nicname","siwa","99pi"];

var questionDiv,questionDivText;
var imageDiv;
var images = [];
var answerDiv;
var chatDiv,chatDivText;

var submitButton;
var inputBox;

var chatDivName = [];
var chatDivNameText = [];
var chatDivNameButtons = [][2];
var buttonText = ["chat","get location"];

var images = []
var imageDivLinks = 
[
"https://drive.google.com/uc?export=view&id=1tOtl1XNUvlIEVT2exzU3QKcVWDu66tv1",
"https://drive.google.com/uc?export=view&id=13oEHMk3nGvB6MbILnnDrIJBSwljwzA5M",
"https://drive.google.com/uc?export=view&id=1ToNl-oQK2X3Yx3aLd1wBYGcrhC-yQUAt"
]



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

  for(var i=0; i<3; i++)
  {
    images[i] = createImg(imageDivLinks[i]);
    images[i].parent(imageDiv);
    images[i].style("object-fit","cover");
    console.log(imageDivLinks[i]);
    // images[i].style("display","inline-block");
    images[i].style("position","relative");
    images[i].style("width","90%");
    images[i].style("height","90%");
    images[i].style("left","50%");
    images[i].style("top","50%");
    images[i].style("transform","translate(-50%, -50%)");

  }

  answerDiv = createDiv();
  answerDiv.position(w/4,6*h/10);
  answerDiv.size(3*w/4,4*h/10);

  submitButton = createButton("submit");
  submitButton.parent(answerDiv);
  submitButton.style("position","relative");
  // submitButton.style("text-align","center");
  submitButton.style("left","50%");
  submitButton.style("bottom","7%");
  submitButton.style("transform","translate(-50%, -50%)");
  submitButton.style("font-family","Helvetica, Arial, Sans-Serif");
  submitButton.style("font-size","1.1em");

  inputBox = createInput();
  inputBox.parent(answerDiv);
  inputBox.style("position","relative");
  inputBox.style("left","50%");
  inputBox.style("top","50%");
  inputBox.style("width","96%");
  inputBox.style("height","70%");
  inputBox.style("transform","translate(-50%, -60%)");

  
  for(var i; i<3; i++)
  {
    chatDivName[i] = createDiv();
    chatDivName[i].position(0,(i+1)*h/10);
    chatDivName[i].size(w/4,h/10);
    
    chatDivNameText[i] = createDiv("player[i]");  //player[i]
    chatDivNameText[i].parent(chatDivName[i]);

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

  answerDiv.position(w/4,6*h/10);
  answerDiv.size(3*w/4,4*h/10);
}