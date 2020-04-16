
var DOM_EL = {
    canvas: null,
    loginContainer: null,
    loginTitle: null,
    loginInstruction: null,
    loginSliderImageContainer: null,
    loginSliderLeftContainer: null,
    loginSliderRightContainer: null,
    loginSliderArrowLeft: null,
    loginSliderArrowRight: null,
    loginImages: [],
    loginInput: null,
    loginButton: null,
    chatContainer: null,
    chatTitle: null,
    chatUsername: null,
    chatLog: null,
    chatInputContainer: null,
    chatInput: null,
    chatInputButton: null
}

var CANVAS_EL = {
    images: []
}

var UTIL = {
    updateServerTimer: 0
}

var APP_STATE = {
    windowWidth: null,
    windowHeight: null,
    nickname: null,
    loginSuccess: false,
    spriteNum: 0,
    numSprites: 6,
    lastRecordedActivity: 0,
    AFK: false,
    updateServer: false,
    micThresholdCross: false,
    chatContent: ""
}

var AVATAR ={
    own: null,
    others: []
}

var P5_SOUND = {
    mic: null,
    micLevel: null,
    micThresholdLevel: 0.05,
}

var peer;
var myStream;

// var call = peer.call('dest-peer-id', mediaStream);

// peer.on('call', function(call) {
//     // Answer the call, providing our mediaStream
//     call.answer(mediaStream);
//   });

// call.on('stream', function(stream) {
    // `stream` is the MediaStream of the remote peer.
    // Here you'd add it to an HTML video/canvas element.
//   });

function register() {
    try {
        peer = new Peer("VROOM_" + APP_STATE.nickname, {key: 'lwjd5qra8257b9'});   
        navigator.getUserMedia({video: false, audio: true}, function(stream) {
            myStream = stream;

            peer.on('call', function(call) {
                // Answer the call, providing our mediaStream
                call.answer(myStream); 
                console.log("call received from " + call.peer);
                call.on('stream', function(remoteStream) {
                    // `stream` is the MediaStream of the remote peer.
                    // Here you'd add it to an HTML video/canvas element.
                    createAudio(remoteStream);
                });
            });

        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });

    } catch (error) {
        console.error(error);
    }
}
    
function addUser(name){
    try {
        var call = peer.call("VROOM_"+ name, myStream);
        call.on('stream', function(remoteStream) {
            console.log("call replied by " + call.peer)
            createAudio(remoteStream);
        });    
    } catch (error) {
        console.error(error);
    }
}

function createAudio(stream) {
    try {
    var container = createDiv();
    var audio = createAudio(URL.createObjectURL(stream));
    container.child(audio);
    audio.autoplay(true);
    // audio.attribute("controls","false");
    // audio.autoplay = true;
    // audio.controls = false;
    // audio.src = URL.createObjectURL(stream);
    } catch (error) {
        console.error(error);
    }
}

function preload(){

    for( let i = 0; i < APP_STATE.numSprites * 4; i++ ){
        CANVAS_EL.images[i] = loadImage("img/" + i.toString() + ".png");
    }
}

function setup(){

    userStartAudio().then(function() {  
        console.log("audio ready");
        P5_SOUND.mic = new p5.AudioIn();
        P5_SOUND.mic.start();

    });

    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;

    if(APP_STATE.windowWidth < APP_STATE.windowHeight){
        DOM_EL.canvas = createCanvas( APP_STATE.windowWidth * 4 / 5, APP_STATE.windowWidth * 4 / 5);
        DOM_EL.canvas.position(APP_STATE.windowWidth/10,APP_STATE.windowWidth/10);
    }
    else{
        DOM_EL.canvas = createCanvas( APP_STATE.windowHeight * 4 / 5, APP_STATE.windowHeight * 4 / 5);
        DOM_EL.canvas.position(APP_STATE.windowHeight/10,APP_STATE.windowHeight/10);
    }

    DOM_EL.canvas.id("canvas");

    DOM_EL.loginContainer = createDiv();
    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.id("login-container");
    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);
    DOM_EL.loginContainer.style("border-width","5px");
    DOM_EL.loginContainer.style("border","black");

    DOM_EL.loginTitle = createDiv("VROOM");
    DOM_EL.loginTitle.id("login-title");
    DOM_EL.loginTitle.parent(DOM_EL.loginContainer);
    DOM_EL.loginTitle.position(0,0);
    DOM_EL.loginTitle.size(APP_STATE.windowWidth,APP_STATE.windowHeight/10);

    DOM_EL.loginSliderLeftContainer = createDiv();
    DOM_EL.loginSliderLeftContainer.id("login-slider-left-container");
    DOM_EL.loginSliderLeftContainer.position(0,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderLeftContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderImageContainer = createDiv();
    DOM_EL.loginSliderImageContainer.id("slider");
    DOM_EL.loginSliderImageContainer.position(APP_STATE.windowWidth/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderImageContainer.size(APP_STATE.windowWidth*3/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderRightContainer = createDiv();
    DOM_EL.loginSliderRightContainer.id("login-slider-right-container");
    DOM_EL.loginSliderRightContainer.position(APP_STATE.windowWidth*4/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderRightContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    for( let i = 0; i < (APP_STATE.numSprites)*4; i++ ){
        DOM_EL.loginImages[i] = createImg("img/" + i.toString() + ".png");
        DOM_EL.loginImages[i].hide();
        if( i % 4 === 0 ){
            DOM_EL.loginImages[i].parent(DOM_EL.loginSliderImageContainer);
            DOM_EL.loginImages[i].class("slider-image");
        }
    }

    DOM_EL.loginImages[0].show();

    DOM_EL.loginSliderArrowLeft = createImg('img/left.png');
    DOM_EL.loginSliderArrowLeft.id("login-slider-arrow-left");
    DOM_EL.loginSliderArrowLeft.parent(DOM_EL.loginSliderLeftContainer);

    DOM_EL.loginSliderArrowRight = createImg('img/right.png');
    DOM_EL.loginSliderArrowRight.id("login-slider-arrow-right");
    DOM_EL.loginSliderArrowRight.parent(DOM_EL.loginSliderRightContainer);

    DOM_EL.loginInstruction = createDiv("swipe to customise your character");
    DOM_EL.loginInstruction.id("login-instruction");
    DOM_EL.loginInstruction.parent(DOM_EL.loginContainer);
    DOM_EL.loginInstruction.position( 0 , APP_STATE.windowHeight * 5.1 / 10 );
    DOM_EL.loginInstruction.size( APP_STATE.windowWidth, APP_STATE.windowHeight * 1 / 10 );

    DOM_EL.loginInput = createInput();
    DOM_EL.loginInput.id("login-input");
    DOM_EL.loginInput.input(nickname);
    DOM_EL.loginInput.center("horizontal");
    DOM_EL.loginInput.attribute("placeholder", "ENTER NICKNAME");
    DOM_EL.loginInput.position(APP_STATE.windowWidth*2/10,APP_STATE.windowHeight*6/10);
    DOM_EL.loginInput.size(APP_STATE.windowWidth*6/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginButton = createButton("JOIN!");
    DOM_EL.loginButton.id("login-button");
    DOM_EL.loginButton.mousePressed(login);
    DOM_EL.loginButton.center("horizontal");
    DOM_EL.loginButton.position(APP_STATE.windowWidth*3/10,APP_STATE.windowHeight*7.3/10);
    DOM_EL.loginButton.size(APP_STATE.windowWidth*4/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginInput.parent(DOM_EL.loginContainer);
    DOM_EL.loginButton.parent(DOM_EL.loginContainer);

    DOM_EL.chatContainer = createDiv();
    DOM_EL.chatContainer.id("chat-container");
    DOM_EL.chatContainer.hide();
    if(APP_STATE.windowWidth < APP_STATE.windowHeight){
        DOM_EL.chatContainer.position( APP_STATE.windowWidth / 10 ,APP_STATE.windowWidth *9 / 10 );
        DOM_EL.chatContainer.size( APP_STATE.windowWidth *4 / 5, APP_STATE.windowHeight - APP_STATE.windowWidth);
    }
    else{
        DOM_EL.chatContainer.position( APP_STATE.windowHeight * 9 / 10 ,APP_STATE.windowHeight / 10 );
        DOM_EL.chatContainer.size( APP_STATE.windowWidth - APP_STATE.windowHeight, APP_STATE.windowHeight * 4 / 5);
    }

    DOM_EL.chatTitle = createElement('h2', "Chat");
    DOM_EL.chatTitle.parent(DOM_EL.chatContainer);
    DOM_EL.chatTitle.id("chat-title");

    DOM_EL.chatUsername = createSpan();
    DOM_EL.chatUsername.parent(DOM_EL.chatContainer);
    DOM_EL.chatUsername.id("chat-username");

    DOM_EL.chatLog = createElement("ul");
    DOM_EL.chatLog.parent(DOM_EL.chatContainer);
    DOM_EL.chatLog.id("chat-log");

    DOM_EL.chatInputContainer = createDiv();
    DOM_EL.chatInputContainer.parent(DOM_EL.chatContainer);
    DOM_EL.chatInputContainer.id("chat-input-container");

    DOM_EL.chatInput = createInput("");
    DOM_EL.chatInput.parent(DOM_EL.chatInputContainer);
    DOM_EL.chatInput.id("chat-input");
    DOM_EL.chatInput.attribute("placeholder", "Type here to chat...");
    DOM_EL.chatInput.input(typing);

    DOM_EL.chatInputButton = createButton("Send");
    DOM_EL.chatInputButton.parent(DOM_EL.chatInputContainer);
    DOM_EL.chatInputButton.id("chat-input-button");
    DOM_EL.chatInputButton.mousePressed(chat);


    var mc = new Hammer(slider);
    mc.on("swipeleft swiperight tap press", function(ev) {
        if(ev.type == "swipeleft") {
            DOM_EL.loginImages[APP_STATE.spriteNum*4].addClass("left");
            setTimeout(function(){
                let temp = overflow(APP_STATE.spriteNum - 1);
                DOM_EL.loginImages[temp * 4].hide();
                DOM_EL.loginImages[temp * 4].removeClass("left");
            }
            ,150);
            APP_STATE.spriteNum++;  
            APP_STATE.spriteNum = overflow(APP_STATE.spriteNum);
            DOM_EL.loginImages[APP_STATE.spriteNum*4].show();

        } else if(ev.type == "swiperight") {
            DOM_EL.loginImages[APP_STATE.spriteNum*4].addClass("right");
            setTimeout(function(){
                let temp = overflow(APP_STATE.spriteNum + 1);
                DOM_EL.loginImages[temp * 4].hide();
                DOM_EL.loginImages[temp * 4].removeClass("right");
            }
            ,150);
            APP_STATE.spriteNum--;  
            APP_STATE.spriteNum = overflow(APP_STATE.spriteNum);  
            DOM_EL.loginImages[APP_STATE.spriteNum*4].show();
        }
    });
}


const overflow = function(i){
    if (i < 0) { i = APP_STATE.numSprites - 1; }
    else if (i > APP_STATE.numSprites - 1) { i = 0; }
    return i;
  }

function nickname(){
    APP_STATE.nickname = this.value();
}

function login(){
    APP_STATE.loginSuccess = true;
    if(APP_STATE.nickname === null){
        AVATAR.own = new Avatar(APP_STATE.spriteNum, random(1.0), random(1.0));
    }
    else{
        AVATAR.own = new Avatar(APP_STATE.spriteNum, APP_STATE.nickname, random(1.0), random(1.0));
    }
    APP_STATE.lastRecordedActivity = millis();
    startCon();  
    register();
    
    DOM_EL.loginInput.hide();
    DOM_EL.loginButton.hide();
    DOM_EL.loginInstruction.hide();
    // DOM_EL.loginTitle.hide();
    DOM_EL.loginSliderImageContainer.hide();
    DOM_EL.loginSliderLeftContainer.hide();
    DOM_EL.loginSliderRightContainer.hide();
    DOM_EL.chatContainer.style("display","flex");
    DOM_EL.chatUsername.html("You are " + APP_STATE.nickname);
}

function chat(){
    if(APP_STATE.chatContent.length>0){
        let listEl = createElement('li');
        let usernameSpanEl = createSpan();
        let textSpanEl = createSpan();
    
        usernameSpanEl.addClass('username');
        usernameSpanEl.html(APP_STATE.nickname);
        textSpanEl.addClass('text');
        textSpanEl.html(APP_STATE.chatContent);

        listEl.child(usernameSpanEl);
        listEl.child(textSpanEl);
    
        DOM_EL.chatLog.child(listEl);

        listEl.elt.scrollIntoView();

        socket.emit("chat-event",{name: APP_STATE.nickname,content: APP_STATE.chatContent});

        APP_STATE.chatContent = "";
        DOM_EL.chatInput.value('');

        APP_STATE.updateServer = true;
        APP_STATE.AFK = false;
        APP_STATE.lastRecordedActivity = millis();
    }
}

function typing(){
    APP_STATE.chatContent = this.value();
}

function draw(){
    if(APP_STATE.loginSuccess){

        clear();
        // AVATAR.own.update(AVATAR.own.posX, AVATAR.own.posY, APP_STATE.micThresholdCross, APP_STATE.AFK);
        noFill();
        strokeWeight(7);
        stroke("#f2f2f2");
        rect(0,0,width,height);
        for(let i = 0; i< AVATAR.others.length; i++){
            AVATAR.others[i].update(AVATAR.others[i].posX, AVATAR.others[i].posY, AVATAR.others[i].talk, AVATAR.others[i].AFK );
        }

        P5_SOUND.micLevel = lerp(P5_SOUND.micLevel,P5_SOUND.mic.getLevel(),0.5);
        if( P5_SOUND.micLevel > P5_SOUND.micThresholdLevel ){
            APP_STATE.micThresholdCross = true;
            APP_STATE.updateServer = true;
            APP_STATE.AFK = false;
            APP_STATE.lastRecordedActivity = millis();
        }
        else{
            APP_STATE.micThresholdCross = false;
        }

        if(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(ENTER)){
            APP_STATE.updateServer = true;
            APP_STATE.AFK = false;
            APP_STATE.lastRecordedActivity = millis();
        }
        if(keyIsDown(LEFT_ARROW)){
            AVATAR.own.posX -= 0.01;
        }if(keyIsDown(RIGHT_ARROW)){
            AVATAR.own.posX += 0.01;
        }if(keyIsDown(UP_ARROW)){
            AVATAR.own.posY -= 0.01;
        }if(keyIsDown(DOWN_ARROW)){
            AVATAR.own.posY += 0.01;
        }
        if(keyIsDown(ENTER)){
            chat();
        }

        if(AVATAR.own.posY > 1){AVATAR.own.posY = 0;}
        else if(AVATAR.own.posY < 0){AVATAR.own.posY = 1;}

        if(AVATAR.own.posX > 1){AVATAR.own.posX = 0;}
        else if(AVATAR.own.posX < 0){AVATAR.own.posX = 1;}

        if( millis() - APP_STATE.lastRecordedActivity > 30000){
            if(APP_STATE.AFK == false){
            APP_STATE.AFK = true;
            APP_STATE.updateServer = true;
            }
        }

        if( APP_STATE.updateServer == true){

            if(millis() - UTIL.updateServerTimer > 30){
                UTIL.updateServerTimer = millis();
                socket.emit("update",{ name: AVATAR.own.name, num: AVATAR.own.spriteNum, X: AVATAR.own.posX , Y: AVATAR.own.posY, talking: APP_STATE.micThresholdCross ,away: APP_STATE.AFK });   
                APP_STATE.updateServer = false;     
            }
        }
    }
}


class Avatar {  //own avatar and other people's avatars 
    constructor(spriteNum , name = "anonymous", px, py) {
      this.name = name;
      this.posX = px;
      this.posY = py;
      this.prevX = this.posX;
      this.prevY = this.posY;
      this.scaleMultiplier = null;
      this.spriteNum = spriteNum;
      this.spriteNumModifier = 0;
      this.talkToggleTimer = null;
      this.AFK = false;
      this.talk = false;
    }
  
    update(px, py, talking, away){
        this.posX = px;
        this.posY = py;
        if( talking == true ) {
            if(millis() - this.talkToggleTimer > 300){
                this.talkToggleTimer = millis();
                if(this.spriteNumModifier == 1){
                    this.spriteNumModifier = 2;
                }
                else{
                    this.spriteNumModifier = 1;
                }
            }
        }  
        else if( away ){
            this.spriteNumModifier = 3;
        }
        else{
            this.spriteNumModifier = 0;
        }
        if( abs(this.prevX - this.posX) > 0 || abs(this.prevY - this.posY) > 0 ){
            this.scaleMultiplier = random(0.95,1.05);
            this.AFK = false;
            this.updateServer = true;
        } 
        else{
            this.scaleMultiplier = 1;
        }

        this.prevX = this.posX;
        this.prevY = this.posY;


        imageMode(CENTER);
        image(  CANVAS_EL.images[this.spriteNum*4 + this.spriteNumModifier],
                this.posX * width, 
                this.posY * width, 
                width * this.scaleMultiplier /10,
                CANVAS_EL.images[this.spriteNum*4 + this.spriteNumModifier].height * this.scaleMultiplier * (width/10) / CANVAS_EL.images[this.spriteNum*4 + this.spriteNumModifier].width );    
        
        textAlign(CENTER);
        fill(0);
        noStroke();
        text(this.name,
             this.posX * width - width * this.scaleMultiplier/20,
             this.posY * width + CANVAS_EL.images[this.spriteNum*4 + this.spriteNumModifier].height * this.scaleMultiplier * (width/20) / CANVAS_EL.images[this.spriteNum*4 + this.spriteNumModifier].width, 
             width * this.scaleMultiplier /10);
    }


  }
  

  function startCon(){
    socket = io('cotf.cf', {});

    socket.on('connect', function() {
        socket.emit('hello',{ name: AVATAR.own.name, num: AVATAR.own.spriteNum, X: AVATAR.own.posX , Y: AVATAR.own.posY, talking: APP_STATE.micThresholdCross ,away: AVATAR.own.AFK });
        socket.emit('fetch-userlist');
    });

    socket.on('someone-joined', function(msg) {
        AVATAR.others.push(new Avatar( msg.num, msg.name, msg.X, msg.Y) );
        console.log("someone joined: ");	
        console.log(msg);
        if(msg.name !== APP_STATE.nickname){
            addUser(msg.name);	
            console.log("creating webRTC connection with: " + msg.name);
        }
    });

    socket.on('someone-change', function(msg) {
        for(let i = 0; i < AVATAR.others.length; i++){
            if(AVATAR.others[i].name == msg.name){
                    AVATAR.others[i].posX = msg.X;
                    AVATAR.others[i].posY = msg.Y;
                    AVATAR.others[i].talk = msg.talking;
                    AVATAR.others[i].AFK = msg.away;
                }
            }
        // console.log("activity detected: ");
        // console.log(msg);
        // console.log("updated array: ");
        // console.log(AVATAR.others);
    });

    socket.on('someone-left', function(msg) {
    console.log(msg);	
    let listCopy = AVATAR.others;
    for(let i = 0; i < AVATAR.others.length; i++){
        if(AVATAR.others[i].name === msg){
        listCopy.splice(i,1);
        }
    }
    AVATAR.others = listCopy;
    console.log("someone left: ");
    console.log(AVATAR.others)
    });


    socket.on('userlist', function(msg) {
        console.log("userlist fetched: ");
        for(let i = 0; i < msg.length; i++){      
            AVATAR.others.push(new Avatar( msg[i].num, msg[i].name, msg[i].X, msg[i].Y) );
        }
        
        console.log(AVATAR.others);
    });

    socket.on('chat-received', function(msg) {

        let listEl = createElement('li');
        let usernameSpanEl = createSpan();
        let textSpanEl = createSpan();
      
        usernameSpanEl.addClass('username');
        usernameSpanEl.html(msg.name);
        textSpanEl.addClass('text');
        textSpanEl.html(msg.content);
    
        listEl.child(usernameSpanEl);
        listEl.child(textSpanEl);
      
        DOM_EL.chatLog.child(listEl);
        listEl.elt.scrollIntoView();
    });
}


function windowResized(){
    APP_STATE.windowWidth = window.innerWidth;
    APP_STATE.windowHeight = window.innerHeight;

    if(APP_STATE.windowWidth < APP_STATE.windowHeight){
        resizeCanvas( APP_STATE.windowWidth * 4 / 5, APP_STATE.windowWidth * 4 / 5);
        DOM_EL.canvas.position(APP_STATE.windowWidth/10,APP_STATE.windowWidth/10);
        DOM_EL.chatContainer.position( APP_STATE.windowWidth / 10 ,APP_STATE.windowWidth *9 / 10 );
        DOM_EL.chatContainer.size( APP_STATE.windowWidth *4 / 5, APP_STATE.windowHeight - APP_STATE.windowWidth);
    }
    else{
        resizeCanvas( APP_STATE.windowHeight * 4 / 5, APP_STATE.windowHeight * 4 / 5);
        DOM_EL.canvas.position(APP_STATE.windowHeight/10,APP_STATE.windowHeight/10);
        DOM_EL.chatContainer.position( APP_STATE.windowHeight * 9 / 10 ,APP_STATE.windowHeight / 10 );
        DOM_EL.chatContainer.size( APP_STATE.windowWidth - APP_STATE.windowHeight, APP_STATE.windowHeight * 4 / 5);
    }


    DOM_EL.loginContainer.position(0,0);
    DOM_EL.loginContainer.size(APP_STATE.windowWidth,APP_STATE.windowHeight);

    DOM_EL.loginTitle.position(0,0);
    DOM_EL.loginTitle.size(APP_STATE.windowWidth,APP_STATE.windowHeight/10);

    DOM_EL.loginSliderLeftContainer.position(0,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderLeftContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderImageContainer.position(APP_STATE.windowWidth/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderImageContainer.size(APP_STATE.windowWidth*3/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginSliderRightContainer.position(APP_STATE.windowWidth*4/5,APP_STATE.windowHeight/10);
    DOM_EL.loginSliderRightContainer.size(APP_STATE.windowWidth/5,APP_STATE.windowHeight*4/10);

    DOM_EL.loginInstruction.position( 0 , APP_STATE.windowHeight * 5.1 / 10 );
    DOM_EL.loginInstruction.size( APP_STATE.windowWidth, APP_STATE.windowHeight * 1 / 10 );

    DOM_EL.loginInput.position(APP_STATE.windowWidth*2/10,APP_STATE.windowHeight*6/10);
    DOM_EL.loginInput.size(APP_STATE.windowWidth*6/10,APP_STATE.windowHeight*1/10);

    DOM_EL.loginButton.position(APP_STATE.windowWidth*3/10,APP_STATE.windowHeight*7.3/10);
    DOM_EL.loginButton.size(APP_STATE.windowWidth*4/10,APP_STATE.windowHeight*1/10);

}
