let logo;
let region;

var w;
var h;
var mode = 0;
var code = "";

var mic;
var name;

var socket;


function startCon(){
	socket = io('cotf.cf', {
});
	socket.on('connect', function() {
		socket.emit('hello',name);
		console.log("connected");		 
	});
}

function setup(){
  w = window.innerWidth;
  h = window.innerHeight;
	createCanvas(w,h);
  region = createImage(displayWidth-displayWidth*2/3,displayWidth-displayWidth*2/3);
  logo = loadImage('assets/tampines.png');

  var username = createInput('');
  username.position(w/2 - username.size().width/2,h/2- username.size().height/2+400);
  console.log(username.size());
  username.input(myInputEvent);

  var button = createButton();
  button.position(w/2 - username.size().width/2,h/2- username.size().height/2+400 + 1.5*username.size().height);
  button.clicked(buttonClickEvent)
  
  mic = new p5.AudioIn()
  mic.start();
  mic.amp(1.0);


  userStartAudio(mic).then(function() {;
  });
}


function myInputEvent() {
  // startCon();
  name = this.value();
  console.log('you are typing: ', this.value());
}


function buttonClickEvent() { 
  if(name!== null){startCon();}
}



function draw(){
  if(mode==0){
    background(245);
    imageMode(CENTER);
    image(logo,w/2,h/2,w*44/100,w*44/(100*logo.width)*logo.height);
    }
  else if(mode == 1){
    background(245);
    textAlign(CENTER,CENTER);
    textSize(32);
    text(code,w/2,h/2);
  }

}

function mouseClicked() {
}



