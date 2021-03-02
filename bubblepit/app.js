
var DOM_EL = {
    loginContainer: null,
        loginTitleContainer: null,
        loginPinInput: null,
        loginButton: null,

    activityContainer: null,
        activityTitleContainer: null,
            activityTitle: null,
            activityInstructions: null,
        activityContentContainer: null,
        activityContent: null,

    canvas: null,
    speechBubbleContainer: null,
    speechBubble: null,
}

var CNV_EL = {
    bubble: [],
    balls: []
}

var UTIL = {
    speechBubbleContent: "",
    scribble: null,
    socket: null,
    spring: 0.2,
    gravity: 0.1,
    friction: -0.3,
    airFriction: 0.97,
    index: 0
}

var APP_STATE = {
    width: null,
    height: null,
    prevWidth: null,
    prevHeight: null,
}


function loginEvent(){
    DOM_EL.loginContainer.hide();
    DOM_EL.activityContainer.show();
  }
  
  function showLoginError(){
    DOM_EL.loginPinInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginPinInput.addClass("no-error");
    },300);
  }

function startCon()
{
  UTIL.socket = io('fhss.ml', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('hello',{room : "1234"});
		console.log("connected");		 
  });
  UTIL.socket.on('someone-joined', function(msg) 
  {
		console.log(msg);	
	});
  UTIL.socket.on('someone-change', function(msg) 
  {
		console.log(msg);		 		 
  });
  UTIL.socket.on('someone-left', function(msg) 
  {
		console.log(msg);	
  });
  UTIL.socket.on('bubble-message-event', function(msg) 
  {
        console.log(msg);	
        CNV_EL.balls[UTIL.index] = new Ball(  //  constructor(contents,xin, yin, din, idin, oin) {
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2, width/2),
            height,
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls
          );
          UTIL.index++;
  });
  UTIL.socket.on('bubble-image-event', function(msg) 
  {
        console.log(msg);	//title,contents,color,xin, yin, din, idin, oin) {
        CNV_EL.balls[UTIL.index] = new Ball(  //  constructor(contents,xin, yin, din, idin, oin) {
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2, width/2),
            height,
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls
          );
          UTIL.index++;
  });
}

function setup(){
    imageMode(CENTER);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    frameRate(10);
    startCon();

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    APP_STATE.prevWidth = APP_STATE.width;
    APP_STATE.prevHeight = APP_STATE.height;

    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    DOM_EL.canvas = createCanvas(APP_STATE.width,APP_STATE.height - titleHeight);


    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginTitleContainer = select("#login-title-container");
    DOM_EL.loginPinInput = select("#login-pin-input");
      DOM_EL.loginPinInput.addClass("no-error");
    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(loginEvent);
    DOM_EL.activityContainer = select("#activity-container");
        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityTitle.input(questionInputEvent);
            DOM_EL.activityInstructions = select("#activity-instructions");
        DOM_EL.activityContentContainer = select("#activity-content-container");
            DOM_EL.activityContentContainer = select("#activity-content");
        DOM_EL.canvas.parent(DOM_EL.activityContainer);
    DOM_EL.activityContainer.hide();


    UTIL.scribble = new Scribble();
    
}

function draw(){
    background("#f5f5f5");
    // for(let i = 0; i < CNV_EL.bubble.length; i++){
    //     CNV_EL.bubble[i].render();
    // }
    CNV_EL.balls.forEach(ball => {
        ball.collide();
        ball.move();
        ball.display();
        ball.updateDiameterMultiplier();
      });
    // CNV_EL.bubble.render();
}


function questionInputEvent(){
  UTIL.socket.emit("bubble_question", {room : "1234",value : this.value()});
}


function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    resizeCanvas(APP_STATE.width,APP_STATE.height - titleHeight);

    for(let i = 0 ; i < UTIL.index; i++){
      CNV_EL.balls[i].diameter = APP_STATE.height * CNV_EL.balls[i].diameter/APP_STATE.prevHeight;
    }

    APP_STATE.prevWidth = APP_STATE.width;
    APP_STATE.prevHeight = APP_STATE.height;

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      document.documentElement.style.setProperty('--vmin', `${vw*2}px`);
    //   DOM_EL.orientationContainer.style("display", "none");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    //   DOM_EL.orientationContainer.style("display", "flex");
    }
}






class Ball {
  constructor(title,contents,color,xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = APP_STATE.height/20;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.contents = contents;
    this.title = title;
    this.randomSeed = random(-10,10);
    this.randomPhase = random(2*PI);
    this.color = color;
    this.imageBall = contents.includes("data:image/png;base64");
    this.diameterMultiplier = 1.0;
    this.diameterMultiplierTarget = 1.0;
    

    if(this.imageBall){
      this.image = createImg(contents);
      this.div = createDiv();
      this.div.addClass("circular");
      this.image.parent(this.div);
      this.image.addClass("bubble-image");
    }
    else{
      this.div = createDiv(contents);
    }
    this.div.addClass("bubble");
    this.div.parent(DOM_EL.activityContainer);
    this.div.mouseOver(this.mouseOverBubble.bind(this));
    this.div.mouseOut(this.mouseOutBubble.bind(this));
  }

  mouseOverBubble(){
    this.diameterMultiplierTarget = 3.0;
    console.log("mouseover detected");
  }

  mouseOutBubble(){
    this.diameterMultiplierTarget = 1.0;
    console.log("mouseout detected");
  }

  updateDiameterMultiplier(){
    this.diameterMultiplier = lerp(this.diameterMultiplier,this.diameterMultiplierTarget,0.1);
  }

  collide() {
    for (let i = this.id + 1; i < CNV_EL.balls.length; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter*this.others[i].diameterMultiplier/2 + this.diameter*this.diameterMultiplier/2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * UTIL.spring;
        let ay = (targetY - this.others[i].y) * UTIL.spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }

  move() {
    this.vy -= UTIL.gravity;
    this.vy = this.vy *= UTIL.airFriction;
    this.vx = this.vx *= UTIL.airFriction;
    this.x += this.vx;
    this.y += this.vy;
    this.x += (this.randomSeed * cos(frameCount+this.randomPhase) * (this.y-this.diameter/2)/height);
    if (this.x + this.diameter * this.diameterMultiplier / 2 > width) {
      this.x = width - this.diameter * this.diameterMultiplier / 2;
      this.vx *= UTIL.friction;
    } else if (this.x - this.diameter * this.diameterMultiplier / 2 < 0) {
      this.x = this.diameter * this.diameterMultiplier / 2;
      this.vx *= UTIL.friction;
    }
    if (this.y + this.diameter * this.diameterMultiplier / 2 > height) {
      this.y = height - this.diameter * this.diameterMultiplier / 2;
      this.vy *= UTIL.friction;
    } else if (this.y - this.diameter * this.diameterMultiplier / 2 < 0) {
      this.y = this.diameter * this.diameterMultiplier / 2;
      this.vy *= UTIL.friction;
    }
  }

  display() {
    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    stroke(0);
    noFill();
    UTIL.scribble.scribbleEllipse(  this.x, 
                                    this.y, 
                                    this.diameter * this.diameterMultiplier + 10* sin(frameCount), 
                                    this.diameter * this.diameterMultiplier + this.randomSeed * cos(frameCount+this.randomPhase) 
    );

    stroke(0,0,200,10);                            
    UTIL.scribble.scribbleEllipse(  this.x, 
                                    this.y, 
                                    this.diameter * this.diameterMultiplier + 10* sin(frameCount), 
                                    this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) 
    );                            

    noStroke();
    fill(this.color.R,this.color.G,this.color.B,10);
    ellipse(    this.x, 
                this.y, 
                this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase) - 3, 
                this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) - 3 
    );

    fill(0);
    textSize(10);
    text(this.title,this.x,this.y- this.diameter * this.diameterMultiplier/2 + 20);
    textSize(6);
    // text(   this.contents, 
    //         this.x, 
    //         this.y, 
    //         this.diameter + this.randomSeed* sin(frameCount+this.randomPhase) - 20, 
    //         this.diameter + this.randomSeed* cos(frameCount+this.randomPhase) - 20
    //     );
    this.div.position(
                      this.x,
                      this.y + titleHeight
                      );
    if(this.imageBall){
      this.div.size(
        this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase),
        this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase),
        );
    }
    else{
      this.div.size(
        this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* sin(frameCount+this.randomPhase) - 20,
        this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* cos(frameCount+this.randomPhase) - 20,
        );
    }
  }
}

