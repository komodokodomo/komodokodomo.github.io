
var DOM_EL = {
    loginContainer: null,
        loginTitleContainer: null,
        loginPinInput: null,
        loginButton: null,

    activityContainer: null,
      activityNext: null,
      activityPrev: null,
        activityTitleContainer: null,
            activityTitle: null,
            activityInstructions: null,
        activityContentContainer: null,
        activityContent: null,

    canvas: null,
    speechBubbleContainer: null,
    speechBubble: null,

    pauseContainer: null,
    clearContainer : null,
    anonContainer: null,
    archiveContainer: null,

    userContainer: null,
    userCounter: null,
    userHideContainer: null,
    userListContainer: null,
    userList : {}
}

var CNV_EL = {
    bubble: [],
    balls: []
}

var UTIL = {
    speechBubbleContent: "",
    scribble: null,
    socket: null,
    spring: 1.1,
    gravity: 2,
    friction: 0.9,
    airFriction: 1.0,
    index: 0,
    pdf: null,
}

var APP_STATE = {
    cursorY: 0,
    width: null,
    height: null,
    prevWidth: null,
    prevHeight: null,
    archive : {},
    archiveIndex : 0,
    pauseAnimation: false,
    anonymous: false,
    usercount: 0,
    pause: false,
}

var SOUNDS = {
  shutter: null,
  delete: null,
  pop: null,
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
function updateUserCount(){
  APP_STATE.usercount = Object.keys(DOM_EL.userList).length;
  DOM_EL.userCounter.html(APP_STATE.usercount  + " Online");
}
function startCon()
{
  UTIL.socket = io('cotf.cf', {});
  UTIL.socket.on('connect', function() 
  {
        UTIL.socket.emit('bubblepit_login',{room : "2222"});
		console.log("connected");		 
  });
  UTIL.socket.on('someone-joined', function(msg) 
  {
		console.log(msg);	
    // APP_STATE.usercount++;
    updateUserCount();
    // DOM_EL.userListContainer["new name"] = createDiv()
    // let userTitle = createDiv("new name");
    // let userStatus = createDiv("❌");
    // APP_STATE.usercount++;
    // DOM_EL.userCounter.html(APP_STATE.usercount  + " Online");
	});
  UTIL.socket.on('bubble-login-event', function(msg) 
  {
    if(msg.room == "2222"){
    if(APP_STATE.pause){
      UTIL.socket.emit("bubblepit_pause");
    }
    let relogin = false;
    let falseAlarm = false;
		console.log(msg);	
    Object.keys(DOM_EL.userList).forEach((user)=>{
      if(DOM_EL.userList[user].elt.children[0].innerHTML == msg.name){ //might be a re-login
        console.log("might be a false alarm");
        falseAlarm = true;
      }
    });
    if(!falseAlarm){
      DOM_EL.userList[msg.id] = createDiv();
      DOM_EL.userList[msg.id].addClass("user-list");
      let userTitle = createDiv(msg.name);
      let userStatus = createDiv("❌");
      userTitle.parent(DOM_EL.userList[msg.id]);
      userTitle.addClass("user-list-title")
      userStatus.parent(DOM_EL.userList[msg.id]);
      userStatus.addClass("user-list-status");
      DOM_EL.userList[msg.id].parent(DOM_EL.userListContainer);
      updateUserCount();
  
      CNV_EL.balls.forEach((ball) => {
        if(ball.title == msg.name){
          console.log("might be a re-login");
          ball.socketId = msg.id;
          DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          relogin = true;
        }
      });
      if(!relogin){
        console.log("still no sign of relogin");
        Object.keys(APP_STATE.archive).forEach((x)=>{
          APP_STATE.archive[x].content.forEach((ball)=>{
            if(ball.title == msg.name){
              console.log("might be a re-login cos similar name found in archive");
              ball.socketId = msg.id;
              DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
            }
          });
        });
      }
    }
  }
    // DOM_EL.userCounter.html(APP_STATE.usercount  + " Online");


	});
  UTIL.socket.on('someone-change', function(msg) 
  {
		console.log(msg);		 		 
  });
  UTIL.socket.on('someone-left', function(msg) 
  {
		console.log(msg + " logged out");	
    if(DOM_EL.userList[msg]){
      DOM_EL.userList[msg].remove();
      delete DOM_EL.userList[msg];
    }
    // APP_STATE.usercount--;
    // DOM_EL.userCounter.html(APP_STATE.usercount + " Online");
    updateUserCount();
  });
  UTIL.socket.on('bubble-message-event', function(msg) 
  {
        console.log(msg);	
        DOM_EL.archiveContainer.removeClass("inactive");
        DOM_EL.anonContainer.removeClass("inactive");
        DOM_EL.clearContainer.removeClass("inactive");
        DOM_EL.pauseContainer.removeClass("inactive");

        if(DOM_EL.userList[msg.id]){
          if(DOM_EL.userList[msg.id].elt.children[1].innerHTML == "✔️"){
            let i = 0;
            let x;
            CNV_EL.balls.forEach((ball) => {
              if(ball.socketId == msg.id){
                x = i;
              }
              i++;
            }
            );
            CNV_EL.balls[x].div.remove();
            CNV_EL.balls.splice(x,1);
            UTIL.index--;
          }else{
            DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          }
        }
        else{
          DOM_EL.userList[msg.id] = createDiv();
          DOM_EL.userList[msg.id].addClass("user-list");
          let userTitle = createDiv(msg.name);
          let userStatus = createDiv("❌");
          userTitle.parent(DOM_EL.userList[msg.id]);
          userTitle.addClass("user-list-title")
          userStatus.parent(DOM_EL.userList[msg.id]);
          userStatus.addClass("user-list-status");
          DOM_EL.userList[msg.id].parent(DOM_EL.userListContainer);
          DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          updateUserCount();
        }
        // setTimeout(() => DOM_EL.archiveContainer.removeClass("inactive"),10);
        SOUNDS.pop.play();
        CNV_EL.balls[UTIL.index] = new Ball(  //  constructor(contents,xin, yin, din, idin, oin) {
            msg.id,
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2 + width*0.2-10, width/2 - width*0.2 + 10),
            height + random(width*0.4*-1, width*0.4),
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls
          );
          UTIL.index++;
  });
  UTIL.socket.on('bubble-image-event', function(msg) 
  {
        console.log(msg);	//title,contents,color,xin, yin, din, idin, oin) {
        DOM_EL.archiveContainer.removeClass("inactive");
        DOM_EL.anonContainer.removeClass("inactive");
        DOM_EL.clearContainer.removeClass("inactive");
        DOM_EL.pauseContainer.removeClass("inactive");

        if(DOM_EL.userList[msg.id]){
          // DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          if(DOM_EL.userList[msg.id].elt.children[1].innerHTML == "✔️"){
            let i = 0;
            let x;
            CNV_EL.balls.forEach((ball) => {
              if(ball.socketId == msg.id){
                x = i;
              }
              i++;
            }
            );
            CNV_EL.balls[x].div.remove();
            CNV_EL.balls.splice(x,1);
            UTIL.index--;
          }else{
            DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          }
        }
        else{
          DOM_EL.userList[msg.id] = createDiv();
          DOM_EL.userList[msg.id].addClass("user-list");
          let userTitle = createDiv(msg.name);
          let userStatus = createDiv("❌");
          userTitle.parent(DOM_EL.userList[msg.id]);
          userTitle.addClass("user-list-title")
          userStatus.parent(DOM_EL.userList[msg.id]);
          userStatus.addClass("user-list-status");
          DOM_EL.userList[msg.id].parent(DOM_EL.userListContainer);
          DOM_EL.userList[msg.id].elt.children[1].innerHTML = "✔️";
          updateUserCount();
        }
        SOUNDS.pop.play();
        CNV_EL.balls[UTIL.index] = new Ball(  //  constructor(contents,xin, yin, din, idin, oin) {
            msg.id,
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2 + width*0.2-10, width/2 - width*0.2 + 10),
            height + random(-width*0.2-10, width*0.2+10),
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls
          );
          UTIL.index++;
  });
}

function preload() {
  soundFormats('mp3', 'ogg');
  // SOUNDS.shutter = loadSound('sound/shutter');
  // SOUNDS.delete = loadSound('sound/delete');
  SOUNDS.pop = loadSound('sound/pop');
}

function setup(){
    window.jsPDF = window.jspdf.jsPDF

    UTIL.pdf = new jsPDF();

    imageMode(CENTER);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    frameRate(10);
    startCon();

    // APP_STATE.width = window.innerWidth;
    APP_STATE.width = document.getElementById('activity-content-container').offsetWidth;
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
      DOM_EL.activityNext = select("#activity-next");
      DOM_EL.activityNext.mousePressed(nextQuestion);
      DOM_EL.activityPrev = select("#activity-prev");
      DOM_EL.activityPrev.mousePressed(prevQuestion);
        DOM_EL.activityTitleContainer = select("#activity-title-container");
            DOM_EL.activityTitle = select("#activity-title");
            DOM_EL.activityTitle.input(questionInputEvent);
            DOM_EL.activityInstructions = select("#activity-instructions");
            DOM_EL.activityInstructions.hide();
        DOM_EL.activityContentContainer = select("#activity-content-container");
        DOM_EL.canvas.parent(DOM_EL.activityContentContainer);
    
    
    DOM_EL.pauseContainer = select("#pause-container");
    DOM_EL.pauseContainer.mousePressed(pauseEvent);

    DOM_EL.clearContainer = select("#clear-container");
    DOM_EL.clearContainer.mousePressed(clearScreen);

    DOM_EL.anonContainer = select("#anon-container");
    DOM_EL.anonContainer.mousePressed(toggleAnon);

    DOM_EL.archiveContainer = select("#archive-container");
    DOM_EL.archiveContainer.mousePressed(archivePdf);
    DOM_EL.activityContainer.hide();

    DOM_EL.userContainer = select("#user-container");
    DOM_EL.userListContainer = select("#user-list-container");
    DOM_EL.userCounter = select("#user-counter-container");
    DOM_EL.userHideContainer = select("#user-hide-container");
    DOM_EL.userHideContainer.mousePressed(toggleUserList);


    UTIL.scribble = new Scribble();
    UTIL.scribble.roughness = 0.01;
    
}

function pauseEvent(){
  if(DOM_EL.pauseContainer.class().includes("active")){
    DOM_EL.pauseContainer.removeClass("active");
    // DOM_EL.pauseContainer.html("⏸️");
    UTIL.socket.emit("bubblepit_play");
    APP_STATE.pause = false;
  }
  else{
    DOM_EL.pauseContainer.addClass("active");
    UTIL.socket.emit("bubblepit_pause");
    APP_STATE.pause = true;
    // DOM_EL.pauseContainer.html("▶️");
  }
}

function unstuckBalls(){
  CNV_EL.balls.forEach((ball) => {
    ball.vx = random(ball.diameter/2,width - ball.diameter/2);
    ball.vy = random(ball.diameter/2,height - ball.diameter/2);
    ball.ax = random(-ball.diameter*2,2*ball.diameter);
    ball.ay = random(-ball.diameter*2,2*ball.diameter);
  });
}

function clearScreen(){
  CNV_EL.balls.forEach((ball) => {
    ball.div.remove();
  }
  );
  CNV_EL.balls = [];
}

function debugAddBall(){
  for(let i = 0; i < 20; i++){
    CNV_EL.balls[UTIL.index] = new Ball(  //  constructor(contents,xin, yin, din, idin, oin) {
      i,
      "name " + i,
      "test message " + i,
      {"R":random(0,255),"G":random(0,255),"B":random(0,255)},
      width/2 + random(-width/2, width/2),
      height + random(-width*0.2-10, width*0.2+10),
      random(width*0.2-10, width*0.2+10),
      UTIL.index,
      CNV_EL.balls
    );
    UTIL.index++;
  }
}

function toggleUserList(){
  DOM_EL.userContainer.toggleClass("showuser");
  DOM_EL.activityContainer.toggleClass("showuser");
  if(DOM_EL.userContainer.class().includes("showuser")){
    DOM_EL.userHideContainer.html(">");
  }
  else{
    DOM_EL.userHideContainer.html("<");
  }
  // setTimeout(windowResized,1000);
}

function toggleAnon(){
  if(DOM_EL.anonContainer.class().includes("active")){
    DOM_EL.anonContainer.removeClass("active");
    // DOM_EL.anonContainer.html("name");
    APP_STATE.anonymous = false;
  }
  else{
    DOM_EL.anonContainer.addClass("active");
    // DOM_EL.anonContainer.html("<strike>name</strike>");
    APP_STATE.anonymous = true;
  }
}

function draw(){
    background("#f5f5f5");
    let index = 0;
    for(let i = 0; i < CNV_EL.balls.length; i++){
        if(CNV_EL.balls[i] == undefined ||  CNV_EL.balls[i] == null){}
        else{
          index++;
        }
    }
    CNV_EL.balls.forEach(ball => {
        ball.updateDiameter(index);
        ball.collide();
        ball.move();
        ball.display();
        ball.updateDiameterMultiplier();
      });
    // CNV_EL.bubble.render();
}

function nextQuestion(){
  DOM_EL.activityPrev.removeClass("inactive");

  if(APP_STATE.archive[APP_STATE.archiveIndex] == null){
    APP_STATE.archive[APP_STATE.archiveIndex] = {};
    APP_STATE.archive[APP_STATE.archiveIndex].content = CNV_EL.balls;
    APP_STATE.archive[APP_STATE.archiveIndex].question = DOM_EL.activityTitle.value();
  
    APP_STATE.archiveIndex++;

    Object.keys(DOM_EL.userList).forEach((key)=>{
      DOM_EL.userList[key].elt.children[1].innerHTML = "❌";
    });
    
    addWrappedText({
      text: "Question: " + DOM_EL.activityTitle.value(), // Put a really long string here
      textWidth: 220,
      doc: UTIL.pdf ,
    
      // Optional
      fontSize: '14',
      // fontType: 'bold',
    });  
  
    CNV_EL.balls.forEach(ball => {
      ball.div.hide();
      if(ball.contents.includes("data:image/png;base64")){
        var pageHeight = UTIL.pdf.internal.pageSize.height;
        var pageWidth = UTIL.pdf.internal.pageSize.width;
        
        if(pageHeight - APP_STATE.cursorY < (pageWidth/2 - 30)){
          UTIL.pdf.addPage();
          APP_STATE.cursorY = 0;
        }
        addWrappedText({
          text: ball.title, // Put a really long string here
          textWidth: 220,
          doc : UTIL.pdf ,
        
          // Optional
          fontSize: '12',
          fontType: 'normal',
          initialYPosition: 5,
        });  
        UTIL.pdf.addImage(ball.contents, "JPEG", 15, APP_STATE.cursorY + 5, pageWidth/2 - 30, pageWidth/2 - 30);
        APP_STATE.cursorY += (pageWidth/2 - 15);
      }
      else{
        addWrappedText({
          text: ball.title + ":", // Put a really long string here
          textWidth: 220,
          doc : UTIL.pdf ,
        
          // Optional
          fontSize: '12',
          fontType: 'normal',
          initialYPosition: 15,
          // lineSpacing: 7,               // Space between lines
          // xPosition: 10,                // Text offset from left of document
          // initialYPosition: 30,         // Initial offset from top of document; set based on prior objects in document
          // pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
        });  
  
        addWrappedText({
          text: ball.contents, // Put a really long string here
          textWidth: 220,
          doc : UTIL.pdf ,
        
          // Optional
          fontSize: '10',
          fontType: 'normal',
          lineSpacing: 5,               // Space between lines
          xPosition: 10,                // Text offset from left of document
          initialYPosition: 15,         // Initial offset from top of document; set based on prior objects in document
          pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
        });  
      }
      });
      
    CNV_EL.balls = [];
    UTIL.index = 0;
    DOM_EL.activityTitle.value("");
  }
  else{
    Object.keys(DOM_EL.userList).forEach((key)=>{
      DOM_EL.userList[key].elt.children[1].innerHTML = "❌";
    });

    CNV_EL.balls.forEach(ball => {
      ball.div.hide();
    });
    CNV_EL.balls = [];
    APP_STATE.archiveIndex++;
    CNV_EL.balls = APP_STATE.archive[APP_STATE.archiveIndex].content;
    UTIL.index = CNV_EL.balls.length;
    if(UTIL.index == 0){
      console.log("no bubbles yet");
    }
    else{
      CNV_EL.balls.forEach(ball => {
        DOM_EL.userList[ball.socketId].elt.children[1].innerHTML = "✔️";
        ball.div.style("display","flex");
        ball.others = CNV_EL.balls;
      });
    }
    DOM_EL.activityTitle.value(APP_STATE.archive[APP_STATE.archiveIndex].question);
  }
  
}

function prevQuestion(){
  if(DOM_EL.activityPrev.class().includes("inactive")){}
  else{
    if(APP_STATE.archive[APP_STATE.archiveIndex] == null){
      APP_STATE.archive[APP_STATE.archiveIndex] = {};
      APP_STATE.archive[APP_STATE.archiveIndex].content = CNV_EL.balls;
      APP_STATE.archive[APP_STATE.archiveIndex].question = DOM_EL.activityTitle.value();
    }
    console.log("show prev question + balls");
    APP_STATE.archiveIndex--;
    if(APP_STATE.archiveIndex == 0){
      DOM_EL.activityPrev.addClass("inactive");
    }
    CNV_EL.balls.forEach(ball => {
      ball.div.hide();
    });
    CNV_EL.balls = [];
    CNV_EL.balls = APP_STATE.archive[APP_STATE.archiveIndex].content; 
    UTIL.index = CNV_EL.balls.length;
    CNV_EL.balls.forEach(ball => {
      // console.log(ball.socketId);
      if(DOM_EL.userList[ball.socketId]){
        DOM_EL.userList[ball.socketId].elt.children[1].innerHTML = "✔️";
      }
      ball.div.style("display","flex");
      ball.others = CNV_EL.balls;
    });
    DOM_EL.activityTitle.value(APP_STATE.archive[APP_STATE.archiveIndex].question);
  }
}

function addWrappedText({text, textWidth, doc, fontSize = 10, fontType = 'normal', lineSpacing = 7, xPosition = 10, initialYPosition = 10, pageWrapInitialYPosition = 10}) {
  var textLines = doc.splitTextToSize(text, textWidth); // Split the text into lines
  var pageHeight = doc.internal.pageSize.height;        // Get page height, well use this for auto-paging
  // doc.setFontType(fontType);
  doc.setFontSize(fontSize);

  var cursorY = APP_STATE.cursorY + initialYPosition;

  textLines.forEach(lineText => {
    if (cursorY > pageHeight) { // Auto-paging
      doc.addPage();
      cursorY = pageWrapInitialYPosition;
    }
    doc.text(xPosition, cursorY, lineText);
    cursorY += lineSpacing;
  })

  APP_STATE.cursorY = cursorY;
}



function archivePdf(){
  if(Object.keys(APP_STATE.archive).length > 0){
    UTIL.pdf.autoPrint();
    UTIL.pdf.save();
  }
  else{
    if(CNV_EL.balls.length > 0){
      addWrappedText({
        text: "Question: " + DOM_EL.activityTitle.value(), // Put a really long string here
        textWidth: 220,
        doc: UTIL.pdf ,
      
        // Optional
        fontSize: '14',
        // fontType: 'bold',
      });  
    
      CNV_EL.balls.forEach(ball => {
        // ball.div.remove();
        if(ball.contents.includes("data:image/png;base64")){
          var pageHeight = UTIL.pdf.internal.pageSize.height;
          var pageWidth = UTIL.pdf.internal.pageSize.width;
          
          if(pageHeight - APP_STATE.cursorY < (pageWidth/2 - 30)){
            UTIL.pdf.addPage();
            APP_STATE.cursorY = 0;
          }
          addWrappedText({
            text: ball.title + ": ", // Put a really long string here
            textWidth: 220,
            doc : UTIL.pdf ,
          
            // Optional
            fontSize: '12',
            fontType: 'normal',
            initialYPosition: 5,
          });  
          UTIL.pdf.addImage(ball.contents, "JPEG", 15, APP_STATE.cursorY + 5, pageWidth/2 - 30, pageWidth/2 - 30);
          APP_STATE.cursorY += (pageWidth/2 - 15);
        }
        else{
          addWrappedText({
            text: ball.title + ": ", // Put a really long string here
            textWidth: 220,
            doc : UTIL.pdf ,
          
            // Optional
            fontSize: '12',
            fontType: 'normal',
            initialYPosition: 15,
            // lineSpacing: 7,               // Space between lines
            // xPosition: 10,                // Text offset from left of document
            // initialYPosition: 30,         // Initial offset from top of document; set based on prior objects in document
            // pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
          });  
    
          addWrappedText({
            text: ball.contents, // Put a really long string here
            textWidth: 220,
            doc : UTIL.pdf ,
          
            // Optional
            fontSize: '10',
            fontType: 'normal',
            lineSpacing: 5,               // Space between lines
            xPosition: 10,                // Text offset from left of document
            initialYPosition: 15,         // Initial offset from top of document; set based on prior objects in document
            pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
          });  
        }
        });
        
      // CNV_EL.balls = [];
      // DOM_EL.activityTitle.value("");
      UTIL.pdf.autoPrint();
      UTIL.pdf.save();
      UTIL.pdf = null;
      UTIL.pdf = new jsPDF();
    }
  }
}



function questionInputEvent(){
  UTIL.socket.emit("bubble_question", {room : "2222",value : this.value()});
}


function windowResized(){
    // APP_STATE.width = window.innerWidth;
    APP_STATE.width = document.getElementById('activity-content-container').offsetWidth;
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
  constructor(id, title,contents,color,xin, yin, din, idin, oin) {
    this.socketId = id;
    this.x = xin;
    this.y = yin;
    this.vx = random(-APP_STATE.width/20,APP_STATE.width/20);
    this.vy = -APP_STATE.height/40;
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
    this.div = null;
    this.contentDiv = null;
    this.nameDiv = null;
    this.closeDiv = null;
    this.displayBall = true;
    this.displayMain = false;
    
    this.div = createDiv();
    // this.div.attribute("tabindex", "0");
    this.div.addClass("bubble-container");
    this.div.parent(DOM_EL.activityContainer);


    if(this.imageBall){
      this.contentDiv = createDiv();
      this.contentDiv.addClass("circular");
      this.contentDiv.parent(this.div);

      this.image = createImg(contents);
      this.image.parent(this.contentDiv);
      this.image.addClass("bubble-image");

      this.nameDiv = createDiv(this.title);
      this.nameDiv.parent(this.contentDiv);
      this.nameDiv.addClass("bubble-title");
    }
    else{
      this.contentDiv = createDiv(contents);
    }

    this.contentDiv.attribute("tabindex", "-1");
    
    this.contentDiv.addClass("bubble");
    this.contentDiv.parent(this.div);
    this.contentDiv.mouseOver(this.mouseOverBubble.bind(this));
    this.contentDiv.mouseOut(this.mouseOutBubble.bind(this));
    this.contentDiv.mousePressed(this.displayContentDiv.bind(this));
    this.contentDiv.elt.onblur = function(){
      APP_STATE.pauseAnimation = false;
      this.displayMain = false;
      this.contentDiv.removeClass("expanded");
    }.bind(this);

    // this.nameDiv = createDiv(this.title);
    // this.nameDiv.parent(this.contentDiv);
    // this.nameDiv.addClass("bubble-title");

    this.closeDiv = createDiv("🗑️");
    this.closeDiv.parent(this.div);
    this.closeDiv.addClass("bubble-close");
    this.closeDiv.addClass("hidden");
    this.closeDiv.mousePressed(this.closeBubble.bind(this));

    this.div.mouseOver(this.showCloseDiv.bind(this));
    this.div.mouseOut(this.hideCloseDiv.bind(this));
  }


  displayContentDiv(){
    APP_STATE.pauseAnimation = true;
    this.displayMain = true;
    this.contentDiv.addClass("expanded");
  }

  showCloseDiv(){
    this.closeDiv.removeClass("hidden");
  }

  hideCloseDiv(){
    this.closeDiv.addClass("hidden");
  }

  closeBubble(){
    console.log("command should fire here");
    this.div.style("display","none");
    this.contentDiv.hide();
    if(this.nameDiv){
      this.nameDiv.hide();
    }
    this.closeDiv.hide();
    this.displayBall = false;
    this.div.remove();
  }

  mouseOverBubble(){
    this.diameterMultiplierTarget = 1.5;
  }

  mouseOutBubble(){
    this.diameterMultiplierTarget = 1.0;
  }

  updateDiameterMultiplier(){
    this.diameterMultiplier = lerp(this.diameterMultiplier,this.diameterMultiplierTarget,0.1);
  }

  updateDiameter(index){
    this.diameter= round(sqrt(width*height*2.1/(3*index)));
    if(this.diameter > height/3.1){this.diameter = height/3.1;}
  }

  collide() {
    for (let i = this.id + 1; i < CNV_EL.balls.length; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter * this.others[i].diameterMultiplier/2 + this.diameter*this.diameterMultiplier/2;

      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x);// * minDist-distance;
        let ay = (targetY - this.others[i].y);// * minDist-distance;
        // if(ax > minDist/4){ax = minDist/4;}
        // if(ay > minDist/4){ay = minDist/4;}

        this.vx *= UTIL.friction;
        this.vy *= UTIL.friction;
        this.others[i].vx *= UTIL.friction;
        this.others[i].vy *= UTIL.friction;

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

    this.x += (this.vx * (this.y)/height);
    this.y += (this.vy * (this.y)/height);
    // this.x += (this.randomSeed * cos(frameCount+this.randomPhase) * (this.y-this.diameter/2)/height);
    if (this.x + this.diameter * this.diameterMultiplier / 2 > width) {
      this.x = width - this.diameter * this.diameterMultiplier / 2;
      this.vx *= UTIL.friction;
      this.vx *= -1;
    } else if (this.x - this.diameter * this.diameterMultiplier / 2 < 0) {
      this.x = this.diameter * this.diameterMultiplier / 2;
      this.vx *= UTIL.friction;
      this.vx *= -1;
    }
    if (this.y + this.diameter * this.diameterMultiplier / 2 > height*1.5) {
      // this.y = height - this.diameter * this.diameterMultiplier / 2;
      // this.vy *= UTIL.friction;
      this.vy *= -1;
    } else if (this.y - this.diameter * this.diameterMultiplier / 2 < 0) {
      this.y = this.diameter * this.diameterMultiplier / 2;
      this.vy *= UTIL.friction;
      this.vy *= -1;
    }
  }

  display() {
    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    if(this.imageBall){
      if(!APP_STATE.anonymous){
        this.nameDiv.show();
      }
      else{
        this.nameDiv.hide();
      }
    }
    if(!APP_STATE.pauseAnimation){
      this.div.style("display","flex");
      if(this.displayBall){
        stroke(0);
        noFill();
        UTIL.scribble.scribbleEllipse(  this.x, 
                                        this.y, 
                                        this.diameter * this.diameterMultiplier , 
                                        this.diameter * this.diameterMultiplier 
                                        // this.diameter * this.diameterMultiplier + 5* sin(frameCount), 
                                        // this.diameter * this.diameterMultiplier + this.randomSeed * cos(frameCount+this.randomPhase) 
        );
    
        stroke(0,0,200,10);                            
        UTIL.scribble.scribbleEllipse(  this.x, 
                                        this.y, 
                                        this.diameter * this.diameterMultiplier , 
                                        this.diameter * this.diameterMultiplier 
                                        // this.diameter * this.diameterMultiplier + 5* sin(frameCount), 
                                        // this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) 
        );                            
    
        noStroke();
        fill(this.color.R,this.color.G,this.color.B,10);
        ellipse(    this.x, 
                    this.y, 
                    this.diameter * this.diameterMultiplier , 
                    this.diameter * this.diameterMultiplier 
                    // this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase) - 3, 
                    // this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) - 3 
        );
    
        fill(0);
        textSize(this.diameter * this.diameterMultiplier / 10);
        if(!APP_STATE.anonymous){
          text(this.title,this.x,this.y- this.diameter * this.diameterMultiplier/2 + 20);
        }
        textSize(6);
    
        this.div.position(
                          this.x,
                          this.y + titleHeight
                          );
        if(this.imageBall){
          this.div.size(
            // this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase) - 5,
            // this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) - 5,
            this.diameter * this.diameterMultiplier - this.randomSeed,
            this.diameter * this.diameterMultiplier - this.randomSeed,
            );
        }
        else{
          this.div.size(
            // this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* sin(frameCount+this.randomPhase) - 20,
            // this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* cos(frameCount+this.randomPhase) - 20,
            this.diameter * this.diameterMultiplier * sqrt(0.5) - 10,
            this.diameter * this.diameterMultiplier * sqrt(0.5) - 10,
            );
        }
      }
    }
    else{
      if(this.displayMain){
        
        stroke(0);
        noFill();
        UTIL.scribble.scribbleEllipse(  width/2, 
                                        height/2, 
                                        height-20, 
                                        height-20 
        );
    
        stroke(0,0,200,10);                            
        UTIL.scribble.scribbleEllipse(  width/2, 
                                        height/2, 
                                        height-20, 
                                        height-20 
        );                         
    
        noStroke();
        fill(this.color.R,this.color.G,this.color.B,10);
        ellipse(    width/2, 
                    height/2, 
                    height-20, 
                    height-20 
        );            
    
        fill(0);
        // textSize(10);
        textSize(this.diameter * 1.5 / 10);
        if(!APP_STATE.anonymous){
          text(this.title,width/2,this.diameter * 1.5 / 10);
        }
        textSize(6);
    
        this.div.position(
                          width/2,
                          height/2 + titleHeight
                          );
        if(this.imageBall){
          this.div.size(
            // this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase) - 5,
            // this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) - 5,
            height - 20,
            height - 20,
            );
        }
        else{
          this.div.size(
            // this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* sin(frameCount+this.randomPhase) - 20,
            // this.diameter * this.diameterMultiplier * sqrt(0.5) + this.randomSeed* cos(frameCount+this.randomPhase) - 20,
            height - 20,
            height - 20,
            );
        }
      }
      else{
        this.div.hide();
      }
    }
  }
}




