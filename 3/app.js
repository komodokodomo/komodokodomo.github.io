var w,h;

var player = ["bryan_tan","Tina","ZaCh"];
var playerDoing = ["Plane B","Plane C","Plane B"];

var questionText = [
  "Step 1: Follow instructions on video to fold Plane A",
  "Step 2: Throw the plane and observe flight path",
  "Step 3: How does plane A/B/C behave and why?"
];

var instructions = "In this activity, compare 3 paper planes and understand how they fly. You are provided with instructions for 3 paper plane designs and one folded model plane, Plane A.\n\nOther students on the website may be assigned different plane designs. The people shown are those near you. You may choose to either meet up with them to check out their planes or fold the planes yourself.\n\nOnce you are done with the questions, the activity is completed\n\nMaterials provided: \n\n - Model Plane (Plane A). \n - Folding instructions for planes (A, B and C) \n - Scissors \n - Paper";


var context = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum justo et lectus consequat, id volutpat mauris iaculis. Quisque nunc felis, consequat vitae nibh rhoncus, ultricies bibendum sapien. Sed posuere, urna euismod semper dapibus, nulla erat luctus est, et mollis enim sem eu sem. Sed ac porttitor orci. Suspendisse potenti. Aliquam et libero augue. Quisque fermentum eros eu nisl iaculis consequat sit amet sit amet tellus. Praesent vitae tincidunt turpis.";

var questionDiv,questionDivText;
var imageDiv;
var images = [];
var answerDiv;
var chatDiv,chatDivText;

var submitButton, skipButton;
var inputBox;
var inputBoxValue = "";
var inputBoxPlaceholder = ["Knight / Knave / Joker","A / B / C / D / E","______ minutes"];

var chatDivButton;
var chatDivName = [];
var chatDivNameText = [];
var chatDivNameText2 = [];
var chatDivNameButtons = [];
var buttonText = ["chat to meet","get location"];

var startSketch=false;
var timeStamp = 0;

var images = []
var imageDivLinks = 
[
"https://www.youtube.com/embed/QbDUiGmxQIQ",
"https://drive.google.com/uc?export=view&id=17g8_mhXAJ2tTP3tMZPppUFZksRtEA9Nj",
"https://drive.google.com/uc?export=view&id=1Vx2yWPEDzLaXJm5fdWOOhWZ2hqANno5p"
]

var mode = 0;

var timer = 0;
var timeBeforeOnline = [500,10000,12000];
// var timeAddition = [500,10000,15000];

var chatChosen = false;
var locationChosen = false;
var questionChosen = false;


function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  createCanvas(w, h);
  background(235);

  
  questionDiv = createDiv();
  questionDivText = createDiv(questionText[0]);
  questionDivText.parent(questionDiv);

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);
  questionDiv.style("background-color","LightGray");

  questionDivText.style("position","relative");
  // questionDivText.style("text-align","center");
  questionDivText.style("left","50%");
  questionDivText.style("top","50%");
  questionDivText.style("transform","translate(-50%, -50%)");
  questionDivText.style("font-family","Helvetica, Arial, Sans-Serif");
  questionDivText.style("font-size","1.5em");

  chatDiv = createDiv();
  chatDivText = createDiv("Meet up with people nearby attempting same task");

  chatDivButton = createButton("?")
  chatDivButton.mousePressed(explain);
  chatDivButton.parent(chatDiv);
  chatDivButton.style("background-color","DarkGray");
  chatDivButton.style("color","white");
  chatDivButton.style("text-align","center");
  chatDivButton.style("left","50%");
  chatDivButton.style("top","50%");

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
  chatDivText.style("font-size","1.2rem");

  imageDiv = createDiv();
  imageDiv.position(w/4,h/10);
  imageDiv.size(3*w/4,6*h/10);

  // console.log("loop starting...");
  for(var i=0; i<3; i++)
  {
    images[i] = createElement("iframe");
    images[i].attribute("src",imageDivLinks[i]);
    images[i].parent(imageDiv);
    images[i].hide();
    images[i].style("object-fit","contain");
    images[i].style("position","relative");
    images[i].style("width","96%");
    images[i].style("height","90%");
    images[i].style("left","50%");
    images[i].style("top","50%");
    images[i].style("transform","translate(-50%, -50%)");
  }
  images[0].show();
  // console.log("loop ending...");

  
  answerDiv = createDiv();
  answerDiv.position(w/4,7*h/10);
  answerDiv.size(3*w/4,3*h/10);

  submitButton = createButton("submit");
  submitButton.mousePressed(changeMode);
  submitButton.parent(answerDiv);
  submitButton.style("position","relative");
  // submitButton.style("text-align","center");
  submitButton.style("left","2%");
  submitButton.style("bottom","3%");
  submitButton.style("transform","translate(0%, -50%)");
  submitButton.style("font-family","Helvetica, Arial, Sans-Serif");
  submitButton.style("font-size","1.1em");
  submitButton.style("width","48%");
  submitButton.style("background-color","LightGray");

  skipButton = createButton("skip");
  skipButton.mousePressed(skipMode);
  skipButton.parent(answerDiv);
  skipButton.style("position","relative");
  // submitButton.style("text-align","center");
  skipButton.style("right","2%");
  skipButton.style("bottom","3%");
  skipButton.style("transform","translate(0%, -50%)");
  skipButton.style("font-family","Helvetica, Arial, Sans-Serif");
  skipButton.style("font-size","1.1em");
  skipButton.style("width","48%");
  skipButton.style("background-color","LightGray");

  inputBox = createInput();
  inputBox.input(typeEvent);
  inputBox.id("inputBox");
  inputBox.parent(answerDiv);
  inputBox.style("position","relative");
  inputBox.style("left","50%");
  inputBox.style("top","50%");
  inputBox.style("width","96%");
  inputBox.style("height","70%");
  inputBox.style("transform","translate(-50%, -63%)");
  inputBox.attribute('placeholder', inputBoxPlaceholder[0]);
  inputBox.style('text-align', 'center');
  inputBox.style('font-size', '2em');

  
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

    chatDivNameText2[i] = createDiv(playerDoing[i]);  //player[i]
    chatDivNameText2[i].parent(chatDivName[i]);

    chatDivNameText[i].style("position","relative");
    chatDivNameText[i].style("text-align","left");
    chatDivNameText[i].style("left","12%");
    chatDivNameText[i].style("top","35%");
    chatDivNameText[i].style("transform","translate(0%, -50%)");
    chatDivNameText[i].style("font-family","Helvetica, Arial, Sans-Serif");
    chatDivNameText[i].style("font-size","1.3rem");

    chatDivNameText2[i].style("position","relative");
    chatDivNameText2[i].style("text-align","left");
    chatDivNameText2[i].style("left","12%");
    chatDivNameText2[i].style("bottom","10%");
    chatDivNameText2[i].style("transform","translate(0%, -50%)");
    chatDivNameText2[i].style("font-family","Helvetica, Arial, Sans-Serif");
    chatDivNameText2[i].style("font-size","1.1rem");

 
    chatDivNameButtons[2*i] = createButton(buttonText[(2*i)%2]);
    chatDivNameButtons[2*i].parent(chatDivName[i]);
    chatDivNameButtons[2*i].style("position","relative");
  //   background-color: #4CAF50; /* Green */
  // border: none;
    chatDivNameButtons[2*i].style("background-color","LightGray");
    chatDivNameButtons[2*i].style("font-size","1.1rem");
    chatDivNameButtons[2*i].style("right","4%");
    chatDivNameButtons[2*i].style("top","50%");
    chatDivNameButtons[2*i].style("height","80%");
    chatDivNameButtons[2*i].style("width","35%");
    chatDivNameButtons[2*i].style("transform","translate(0%, -50%)");
    chatDivNameButtons[2*i].mousePressed(chatEnding);

    chatDivName[i].hide();
  }

  hideAll();
  stroke('LightGray');
  strokeWeight(2);
  line(w/4,0,w/4,h);
  line(w/4,7*h/10,w,7*h/10);

}

function explain(){alert(instructions);}

function typeEvent(){
  inputBoxValue = this.value();
  console.log(inputBoxValue);   
}

function skipMode(){
  // chatDivNameText[0].html(player[1]);
  document.getElementById('inputBox').value = '';    
  images[mode].hide();
  mode++;
  if(mode == 1){
  for(var i=0; i<player.length; i++)
  {
    chatDivNameText[i].html(player[i]);  
  }
  }
  if(mode == 2){
  for(var i=0; i<player.length; i++)
  {
    chatDivNameText[i].html(player[i]);  
  }
  }
  if(mode>2){mode=2;questionChosen=true;hideAll();}
  else{
    inputBox.attribute('placeholder', inputBoxPlaceholder[mode]);
    timer = millis();
  }
  questionDivText.html(questionText[mode]);
  images[mode].show();
}
function changeMode(){

  if(document.getElementById('inputBox').value!==""){
  document.getElementById('inputBox').value = '';    
  images[mode].hide();
  mode++;
  if(mode == 1){
    for(var i=0; i<player.length; i++)
    {
      chatDivNameText[i].html(player2[i]);  
    }
    }
    if(mode == 2){
    for(var i=0; i<player.length; i++)
    {
      chatDivNameText[i].html(player3[i]);  
    }
    }
  if(mode>2){mode=2;questionChosen=true;hideAll();}
  else{
    inputBox.attribute('placeholder', inputBoxPlaceholder[mode]);
    timer = millis();
  }
  questionDivText.html(questionText[mode]);
  images[mode].show();
}
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

function showAll(){

  questionDiv.show();
  chatDiv.show();
  imageDiv.show();
  answerDiv.show();
  for(var i=0; i<player.length; i++)
  {
    chatDivName[i].show();
  }

}

function draw() {
  if(!startSketch){
    background(235);
    textAlign(LEFT);
    textSize(w/60);
    text(instructions,9*w/16,3*h/16,3*w/8,6*h/8);

    textSize(w/40);
    text("Instructions",9*w/16,1*h/16,3*w/8,6*h/8);

    textSize(w/40);
    text("Context",1*w/16,1*h/16,3*w/8,6*h/8);

    textSize(w/60);
    text(context,1*w/16,3*h/16,3*w/8,6*h/8);

    stroke('LightGray');
    strokeWeight(2);
    line(w/2,0,w/2,h);
  }
  else{
    if(!chatChosen && !locationChosen && !questionChosen){
    if(millis() - timeStamp - timer>timeBeforeOnline[mode]){
      chatDivName[0].show();
      // chatDivText.html("1 users nearby attempting same task");
      chatDivText.html("Meet up with people nearby attempting same task");
      if(millis() - timeStamp - timer>15000+timeBeforeOnline[mode]){
        chatDivName[1].show();
        // chatDivText.html("2 users nearby attempting same task");
        chatDivText.html("Meet up with people nearby attempting same task");
        if(millis() - timeStamp - timer>35000+timeBeforeOnline[mode]){
          chatDivName[2].show();
          // chatDivText.html("3 users nearby attempting same task");
          chatDivText.html("Meet up with people nearby attempting same task");
        }
      }
    }
    else{
      chatDivName[0].hide();
      chatDivName[1].hide();
      chatDivName[2].hide();
      // chatDivText.html("0 users nearby attempting same task");
      chatDivText.html("Meet up with people nearby attempting same task");
    }
  }

  else if(chatChosen == true){background(235);textAlign(CENTER,CENTER);textSize(w/20);text("Chat chosen",w/2,h/2);}
  else if(locationChosen == true){background(235);textAlign(CENTER,CENTER);textSize(w/20);text("Location chosen",w/2,h/2);}
else if(questionChosen == true){background(235);textAlign(CENTER,CENTER);textSize(w/20);text("Finished",w/2,h/2);}
}
}

function touchStarted() 
{
  // if(mouseX<100 && mouseY<100){alert(instructions);}
  if(!startSketch){
  startSketch = true;
  showAll();
  background(235);
  timeStamp = millis();
  stroke('LightGray');
  strokeWeight(2);
  line(w/4,0,w/4,h);
  line(w/4,7*h/10,w,7*h/10);
}
}

function windowResized()
{
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
  background(235);
  
  if(!chatChosen && !locationChosen && !questionChosen){
  stroke('LightGray');
  strokeWeight(2);
  line(w/4,0,w/4,h);
  line(w/4,7*h/10,w,7*h/10);
  ellipse();
  }
 
  // noStroke();
  // textSize(w/80);
  // textStyle(BOLD);
  // text("Users attempting same task",w/8,h/10);

  questionDiv.position(w/4,0);
  questionDiv.size(3*w/4,h/10);

  chatDiv.position(0,0);
  chatDiv.size(w/4,h/8);

  imageDiv.position(w/4,h/10);
  imageDiv.size(3*w/4,6*h/10);

  answerDiv.position(w/4,7*h/10);
  answerDiv.size(3*w/4,3*h/10);


  for(var i=0; i<player.length; i++)
  {
    chatDivName[i].position(0,i*h/10 + h/8);
    chatDivName[i].size(w/4,h/10);
  }
}