var w,h;

var player = ["nicname","siwa","99pi"];
var questionText = [
  "Question 1",
  "Question 2",
  "Question 3"
];

var questionDiv,questionDivText;
var imageDiv;
var images = [];
var answerDiv;
var chatDiv,chatDivText;

var submitButton;
var inputBox;

var chatDivName = [];
var chatDivNameText = [];
var chatDivNameButtons = [];
var buttonText = ["chat","get location"];

var images = []
var imageDivLinks = 
[
"https://drive.google.com/uc?export=view&id=1tOtl1XNUvlIEVT2exzU3QKcVWDu66tv1",
"https://drive.google.com/uc?export=view&id=13oEHMk3nGvB6MbILnnDrIJBSwljwzA5M",
"https://drive.google.com/uc?export=view&id=1ToNl-oQK2X3Yx3aLd1wBYGcrhC-yQUAt"
]

var mode = 0;

var timer = 0;
var timeBeforeOnline = 5000;

var chatChosen = false;
var locationChosen = false;
var questionChosen = false;


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
  chatDiv.size(w/4,h/8);
  chatDiv.style("border-bottom-style","solid");
  chatDiv.style("border-color","LightGray");
  chatDiv.style("border-width","2px");

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

  // console.log("loop starting...");
  for(var i=0; i<3; i++)
  {
    images[i] = createImg(imageDivLinks[i]);
    images[i].parent(imageDiv);
    images[i].hide();
    images[i].style("object-fit","cover");
    images[i].style("position","relative");
    images[i].style("width","90%");
    images[i].style("height","90%");
    images[i].style("left","50%");
    images[i].style("top","50%");
    images[i].style("transform","translate(-50%, -50%)");
  }
  images[0].show();
  // console.log("loop ending...");

  
  answerDiv = createDiv();
  answerDiv.position(w/4,6*h/10);
  answerDiv.size(3*w/4,4*h/10);

  submitButton = createButton("submit");
  submitButton.mousePressed(changeMode);
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

  
  for(var i=0; i<player.length; i++)
  {
    chatDivName[i] = createDiv();
    chatDivName[i].position(0,i*h/10 + h/8);
    chatDivName[i].size(w/4,h/10);
    chatDivName[i].style("border-bottom-style","solid");
    chatDivName[i].style("border-color","LightGray");
    chatDivName[i].style("border-width","2px");
    
    chatDivNameText[i] = createDiv(player[i]);  //player[i]
    chatDivNameText[i].parent(chatDivName[i]);

    chatDivNameText[i].style("position","relative");
    chatDivNameText[i].style("text-align","left");
    chatDivNameText[i].style("left","10%");
    chatDivNameText[i].style("top","50%");
    chatDivNameText[i].style("transform","translate(0%, -50%)");
    chatDivNameText[i].style("font-family","Helvetica, Arial, Sans-Serif");
    chatDivNameText[i].style("font-size","1.1em");

 
    chatDivNameButtons[2*i] = createButton(buttonText[(2*i)%2]);
    chatDivNameButtons[2*i].parent(chatDivName[i]);
    // chatDivNameButtons[2*i].size(w/8,h/22);
    chatDivNameButtons[2*i].style("position","relative");
    chatDivNameButtons[2*i].style("right","2%");
    chatDivNameButtons[2*i].style("top","8%");
    chatDivNameButtons[2*i].style("height","42%");
    chatDivNameButtons[2*i].style("width","40%");
    chatDivNameButtons[2*i].mousePressed(chatEnding);

    // chatDivNameButtons[2*i].position(w/8,i*h/10 +h/8 + (i%2)*(h/20)+(h/20-h/22));

    chatDivNameButtons[2*i+1] = createButton(buttonText[(2*i+1)%2]);
    chatDivNameButtons[2*i+1].mousePressed(locationEnding);
    chatDivNameButtons[2*i+1].parent(chatDivName[i]);
    chatDivNameButtons[2*i+1].style("position","relative");
    chatDivNameButtons[2*i+1].style("right","2%");
    chatDivNameButtons[2*i+1].style("bottom","8%");
    chatDivNameButtons[2*i+1].style("height","42%");
    chatDivNameButtons[2*i+1].style("width","40%");

    // chatDivNameButtons[2*i+1].size(w/8,h/22);
    // chatDivNameButtons[2*i+1].position(w/8,i*h/10 +h/8 + ((i+1)%2)*(h/20)+2*(h/20-h/22));
    chatDivName[i].hide();
  }





  stroke('LightGray');
  strokeWeight(2);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);

  // noStroke();
  // textAlign(CENTER,CENTER);
  // textSize(w/80);
  // textStyle(BOLD);
  // text("Users nearby attempting same task",w/8,h/10);
}

function changeMode(){
  images[mode].hide();
  mode++;
  if(mode>2){mode=2;questionChosen=true;hideAll();}
  else{timer = millis();timeBeforeOnline = random(3000,8000);}
  questionDivText.html(questionText[mode]);
  images[mode].show();
}

function chatEnding(){
chatChosen = true;
hideAll();
}

function locationEnding(){
locationChosen =true;
hideAll();
}

function hideAll(){

  questionDiv.hide();
  chatDiv.hide();
  imageDiv.hide();
  answerDiv.hide();
  for(var i=0; i<player.length; i++)
  {
    chatDivName[i].hide();
  }

}

function draw() {
  if(!chatChosen && !locationChosen && !questionChosen){
  if(millis() - timer>timeBeforeOnline){
    chatDivName[0].show();
    chatDivText.html("1 Users nearby attempting same task");
    if(millis() - timer>2.5*timeBeforeOnline){
      chatDivName[1].show();
      chatDivText.html("2 Users nearby attempting same task");
      if(millis() - timer>5.5*timeBeforeOnline){
        chatDivName[2].show();
        chatDivText.html("3 Users nearby attempting same task");
      }
    }
  }
  else{
    chatDivName[0].hide();
    chatDivName[1].hide();
    chatDivName[2].hide();
    chatDivText.html("0 Users nearby attempting same task");
  }
}
else if(chatChosen){background(235);text("Chat chosen",w/2,h/2);}
else if(locationChosen){background(235);text("Location chosen",w/2,h/2);}
else if(questionChosen){background(235);text("Finished",w/2,h/2);}
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
  strokeWeight(2);
  line(w/4,0,w/4,h);
  line(w/4,3*h/5,w,3*h/5);
 
  // noStroke();
  // textSize(w/80);
  // textStyle(BOLD);
  // text("Users attempting same task",w/8,h/10);

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);

  chatDiv.position(0,0);
  chatDiv.size(w/4,h/8);

  imageDiv.position(w/4,h/10);
  imageDiv.size(3*w/4,h/2);

  answerDiv.position(w/4,6*h/10);
  answerDiv.size(3*w/4,4*h/10);


  for(var i=0; i<player.length; i++)
  {
    chatDivName[i].position(0,i*h/10 + h/8);
    chatDivName[i].size(w/4,h/10);
  }
}