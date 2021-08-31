


var CNV_EL = {
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
    index: 0,
    pdf: null,
}

var URL_PARAMS = {
  room: null,
  name: null,
}

var APP_STATE = {
    room: null,
    socketId: null,
    users: {},
    question : null,
    questionType : null,
    roomParticipants: [],
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
    activityOptionTypeChosen : null,
    activeQuestion : null,
    activeQuestionContainer: null,
    numBalls: 0,
    ballDiameter: null,
    loginButtonPressed: false,
    preventEcho: false
}

var SOUNDS = {
  shutter: null,
  delete: null,
  pop: null,
}


function updateRoomQuestion(pin,key,question){
  var xhr = new XMLHttpRequest();
  let q = "&question=" + question;
  let k = "&key=" + key; 
 
  xhr.open('GET', '/admin/update_room?room=' + pin + k + q, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log(`room ${APP_STATE.room} updated`);
      }
      else if(this.status == 404) {
        console.log(`error, did not update room ${APP_STATE.room}`);
      }
    };
  xhr.send("");
}
function updatePraiseList(pin,key,id,add=0){
  var xhr = new XMLHttpRequest();
  let k = "&key=" + key; 
  let i = "&id=" + id; 
  let a = "&add=" + add;
 
  xhr.open('GET', '/admin/update_praise_list?room=' + pin + k + i + a, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
        // if(add == 1){
        //   console.log(`room ${APP_STATE.room}'s question ${APP_STATE.activeQuestionContainer}'s bubble:${id} added to praise list`);
        // }
        // else{
        //   console.log(`room ${APP_STATE.room}'s question ${APP_STATE.activeQuestionContainer}'s bubble:${id} removed from praise list`);
        // }
      }
      else if(this.status == 404) {
        // if(add == 1){
        //   console.log(`error, did not add room ${APP_STATE.room} question ${APP_STATE.activeQuestionContainer}'s bubble:${id} to praise list`);
        // }
        // else{
        //   console.log(`error, did not remove room ${APP_STATE.room} question ${APP_STATE.activeQuestionContainer}'s bubble:${id} from praise list`);
        // }
      }
    };
  xhr.send("");
}

function clearRoomResponse(pin,key,name,id){
  var xhr = new XMLHttpRequest();
  let k = "&key=" + key; 
  let n = "&name=" + name; 
  let i = "&id=" + id; 
 
  xhr.open('GET', '/admin/clear_room_response?room=' + pin + k + n + i, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log(`room ${APP_STATE.room}'s question ${APP_STATE.activeQuestionContainer}'s bubble:${id} cleared of responses`);
      }
      else if(this.status == 404) {
        console.log(`error, did not clear room ${APP_STATE.room} question ${APP_STATE.activeQuestionContainer}'s bubble:${id} responses`);
      }
    };
  xhr.send("");
}

function clearRoomResponses(pin,key){
  var xhr = new XMLHttpRequest();
  let k = "&key=" + key; 
 
  xhr.open('GET', '/admin/clear_room_responses?room=' + pin + k, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log(`room ${APP_STATE.room}'s question ${question} cleared of responses`);
      }
      else if(this.status == 404) {
        console.log(`error, did not clear room ${APP_STATE.room} + question ${question} responses`);
      }
    };
  xhr.send("");
}

function createRoom(pin){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/set_active_rooms?pin=' + pin, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log("list of active rooms updated");
      }
      else if(this.status == 404) {
        console.log("error, did not update list of active room");
      }
    };
  xhr.send("check room availability");
}

function loginRoomPinInputEvent(){
  DOM_EL.loginRoomPinInput.addClass("no-error");
  DOM_EL.loginInfoContainer.addClass("hidden");
}

async function loginEvent(){
  if(!APP_STATE.loginButtonPressed){
    APP_STATE.loginButtonPressed = true;
    if(DOM_EL.loginRoomPinInput.value().length > 0){
      await fetch('/admin/check_active_rooms?pin=' + DOM_EL.loginRoomPinInput.value() + "&password=" + DOM_EL.loginRoomPasswordInput.value())
      .then(
        function(response) {
          if (response.status == 200) {
            response.json().then(function(data) {
              console.log(data);
              if(data.payload == "Wrong password"){
                showLoginError(data.payload + " / No password required");
                APP_STATE.loginButtonPressed = false;
              }
              else{
                windowResized();
                Object.keys(data).forEach((key)=>{
                  DOM_EL.questionContainers[key] = new QuestionContainer(data[key].question, DOM_EL.questionContainers, data[key].type ,data[key].anon, data[key].categorize, data[key].limited, data[key].responses, data[key].praises, key );
                });

                UTIL.socket.emit('bubblepit_login',{room : DOM_EL.loginRoomPinInput.value()});
                APP_STATE.room = DOM_EL.loginRoomPinInput.value();
                DOM_EL.lobbyRoom.html("room " + APP_STATE.room);
                DOM_EL.activityInstructionsRoom.html("room " + APP_STATE.room);
                DOM_EL.loginContainer.hide();
                DOM_EL.lobbyContainer.show();
                updateUserCount();

                let QR = new QRCode(DOM_EL.lobbyQR.elt, {
                  text: "https://cotf.cf/wand?room=" + APP_STATE.room,
                  width: window.innerHeight * 0.5,
                  height: window.innerHeight * 0.5
                });
              }
            });
          }
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }
    else{
      showLoginError("Room PIN is required");
      APP_STATE.loginButtonPressed = false;
    }
  }
}

function showLoginError(message){
  DOM_EL.loginRoomPinInput.removeClass("no-error");
  DOM_EL.loginInfoContainer.removeClass("hidden");
  DOM_EL.loginInfo.html(message);
}


function lobbyEvent(){
  DOM_EL.lobbyContainer.hide();
  DOM_EL.mainContainer.show();
  updateUserCount();
}

function addNewUser(id,name){
  DOM_EL.userList[id] = createDiv();
  DOM_EL.userList[id].addClass("user-list");
  let userTitle = createDiv(name);
  let userStatus = createDiv("❌");
  userTitle.parent(DOM_EL.userList[id]);
  userTitle.addClass("user-list-title")
  userStatus.parent(DOM_EL.userList[id]);
  userStatus.addClass("user-list-status");
  DOM_EL.userList[id].parent(DOM_EL.userListContainer);
}

function updateUserCount(){
  APP_STATE.usercount = Object.keys(APP_STATE.users).length;
  DOM_EL.userCounter.html(CNV_EL.balls.length  + "  Responses");
  DOM_EL.lobbyContentCounter.html(DOM_EL.lobbyUserContainer.elt.childElementCount + " Online");
}

function addLobbyUser(id,name){
  APP_STATE.users[id] = name;
  DOM_EL.lobbyUsers[id] = createDiv();
  DOM_EL.lobbyUsers[id].addClass("lobby-user");
  DOM_EL.lobbyUsers[id].parent(DOM_EL.lobbyUserContainer);
  let child = createDiv(name);
  child.addClass("user")
  child.parent(DOM_EL.lobbyUsers[id]); 
}
function removeLobbyUser(id){
    DOM_EL.lobbyUsers[id].remove();
    delete DOM_EL.lobbyUsers[id];
    delete APP_STATE.users[id];
}

function checkExistingUser(id,name){
    if(DOM_EL.userList[id]){
      if(DOM_EL.userList[id].class().includes("archive")){}
      else{
        DOM_EL.userList[id].elt.children[1].innerHTML = "✔️";
      }
    }
    else{
      addLobbyUser(id,name);
      addUser(id,name);
      updateUserCount();
    }
}


function startCon()
{
  UTIL.socket = io('cotf.cf', {});
  UTIL.socket.on('connect', function() 
  {
		console.log("connected to socketio server");		 
  });
  UTIL.socket.on('bubblepit-all-play-event', function(msg) 
  {
    DOM_EL.activityPause.removeClass("active");
    APP_STATE.pause = false;
  });
  UTIL.socket.on('bubblepit-all-pause-event', function(msg) 
  {
    DOM_EL.activityPause.addClass("active");
    APP_STATE.pause = true;
  });
  UTIL.socket.on('bubblepit-load-question-event', function(msg) 
  {
    console.log(msg);
    if(msg.id !== UTIL.socket.id){
      if(msg.room == APP_STATE.room){
          Object.keys(DOM_EL.questionContainers).forEach((container)=>{
            if(DOM_EL.questionContainers[container].questionListContent.html() == msg.value){
              DOM_EL.questionContainers[container].loadQuestion();
            }
          });
      }
      else{
        console.log("coming from different room, ignore");
      }
    }
    else{
      console.log("coming from own bubblepit, ignore");
    }
  });
  UTIL.socket.on('bubble-login-event', function(msg) 
  {
    if(msg.room == APP_STATE.room){
      if(APP_STATE.pause){
        UTIL.socket.emit("bubblepit_all_pause",{"room" : APP_STATE.room});
      }
    
      if(APP_STATE.question !== null){
        UTIL.socket.emit("bubblepit_question", {room : APP_STATE.room, value : APP_STATE.question, type: APP_STATE.questionType});
      }


      addLobbyUser(msg.id,msg.name);
      addUser(msg.id,msg.name);
      updateUserCount();
  
  }
	});
  UTIL.socket.on('bubble-disconnect-event', function(msg) 
  {
    if(DOM_EL.userList[msg]){
      if(DOM_EL.userList[msg].class().includes("archive")){}
      else{
        if(DOM_EL.userList[msg].elt.children[1].innerHTML == "✔️"){
          DOM_EL.userList[msg].addClass("archive");
          DOM_EL.userList[msg].elt.children[1].innerHTML = "(archived)";
        }
        else{
          DOM_EL.userList[msg].remove();
          delete DOM_EL.userList[msg];
        }
      }
    }
    if(DOM_EL.lobbyUsers[msg]){
      removeLobbyUser(msg);
    }
    updateUserCount();
  });

  UTIL.socket.on('bubble-message-event', function(msg) 
  {
        if(msg.room == APP_STATE.room){       
          if(APP_STATE.activeQuestionContainer !== null){
          checkExistingUser(msg.id,msg.name);

          DOM_EL.questionContainers[APP_STATE.activeQuestionContainer].responses[msg.name] = {
            "type" : "",
            "payload" : msg.message,
            "color" : msg.color,
            "socketId" : msg.id
          };
        SOUNDS.pop.play();
        CNV_EL.balls[UTIL.index] = new Ball(  
            msg.id,
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2, width/2),
            height,
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls,
          );
        UTIL.index++;
        }
        }
  });
  UTIL.socket.on('bubble-image-event', function(msg) 
  {
    if(msg.room == APP_STATE.room){
      if(APP_STATE.activeQuestionContainer !== null){
        checkExistingUser(msg.id,msg.name);
          DOM_EL.questionContainers[APP_STATE.activeQuestionContainer].responses[msg.name] = {
            "type" : "",
            "payload" : msg.message,
            "color" : msg.color,
            "socketId" : msg.id
        };
        SOUNDS.pop.play();
        CNV_EL.balls[UTIL.index] = new Ball(  
            msg.id,
            msg.name,
            msg.message,
            msg.color,
            width/2 + random(-width/2, width/2),
            height,
            random(width*0.2-10, width*0.2+10),
            UTIL.index,
            CNV_EL.balls,
          );
        UTIL.index++;
      }
    }
});
}

function addUser(id,name){
  DOM_EL.userList[id] = createDiv();
  DOM_EL.userList[id].addClass("user-list");
  let userTitle = createDiv(name);
  let userStatus = createDiv("❌");
  userTitle.parent(DOM_EL.userList[id]);
  userTitle.addClass("user-list-title");
  DOM_EL.userList[id].mouseOver(()=>{
    CNV_EL.balls.forEach((ball)=>{
      if(ball.socketId == id){
        ball.mouseOverBubble();
      }
    });
  });
  DOM_EL.userList[id].mouseOut(()=>{
    CNV_EL.balls.forEach((ball)=>{
      if(ball.socketId == id){
        ball.mouseOutBubble();
      }
    });
  });
  DOM_EL.userList[id].mousePressed(()=>{
    if(!APP_STATE.pauseAnimation){
      CNV_EL.balls.forEach((ball)=>{
        if(ball.socketId == id){
          setTimeout(()=>{ball.displayContentDiv()},20);
        }
      });
    }
  });
  userStatus.parent(DOM_EL.userList[id]);
  userStatus.addClass("user-list-status");
  DOM_EL.userList[id].parent(DOM_EL.userListContainer);
  // DOM_EL.userList[id].elt.children[1].innerHTML = "✔️";
}


function preload() {
  soundFormats('mp3', 'ogg');
  SOUNDS.pop = loadSound('sound/pop', function () {
  });
}

var DOM_EL = {
  loginContainer: null,
      loginTitleContainer: null,
      loginInputContainer: null,
        loginRoomPinInput: null,
      loginButton: null,
      loginInfoContainer: null,
        loginInfo: null,

  lobbyContainer: null,
    lobbyUsers : [],
  lobbyQRContainer: null,
  lobbyInstructionContainer: null,
    lobbyQR: null,


  mainContainer: null,

  activityContainer: null,
  activityContentPrompter: null,
    activityNext: null,
    activityPrev: null,
      activityTitleContainer: null,
          activityTitle: null,
          activityInstructions: null,
      activityContentContainer: null,
        canvasContainer: null,
      activityContent: null,

  questionContainers: [],

  canvas: null,
  speechBubbleContainer: null,
  speechBubble: null,

  userContainer: null,
  userCounter: null,
  userHideContainer: null,
  userListContainer: null,
  userList : {}
}

function setup(){
    window.jsPDF = window.jspdf.jsPDF

    UTIL.pdf = new jsPDF();

    let params = (new URL(document.location)).searchParams;
    URL_PARAMS.room = parseInt(params.get('room')); 
    URL_PARAMS.name = params.get('name');
    
    if(URL_PARAMS.room !== null){console.log(URL_PARAMS.room);}
    if(URL_PARAMS.name !== null){console.log(URL_PARAMS.name);}

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
      DOM_EL.loginRoomPinInput = select("#room-pin-input");
        DOM_EL.loginRoomPinInput.addClass("no-error");
        DOM_EL.loginRoomPinInput.input(loginRoomPinInputEvent);
      DOM_EL.loginRoomPasswordInput = select("#room-password-input");
      DOM_EL.loginButton = select("#login-button");
        DOM_EL.loginButton.mousePressed(loginEvent);
      DOM_EL.loginInfoContainer = select("#login-info-container");
        DOM_EL.loginInfo = select("#login-info");

        
    DOM_EL.lobbyContainer = select("#lobby-container");
        DOM_EL.lobbyRoom = select("#lobby-room");
      DOM_EL.lobbyContentContainer = select("#lobby-content-container");
        DOM_EL.lobbyContentCounter = select("#lobby-content-counter");
        DOM_EL.lobbyUserContainer = select("#lobby-user-container");
      DOM_EL.lobbyInstructionContainer = select("#lobby-instruction-container");
      DOM_EL.lobbyInstructionContainer.mousePressed(showQR);
      DOM_EL.lobbyQRContainer = select("#lobby-qr-container");
      DOM_EL.lobbyQRContainer.hide();
      DOM_EL.lobbyQR = select("#lobby-qr");
      DOM_EL.lobbyQRClose = select("#lobby-qr-close");
      DOM_EL.lobbyQRClose.mousePressed(hideQR);


    DOM_EL.lobbyButton = select("#lobby-button");
      DOM_EL.lobbyButton.mousePressed(lobbyEvent);

    
    DOM_EL.mainContainer = select("#main-container");
      DOM_EL.activityContainer = select("#activity-container");

          DOM_EL.activityTitleContainer = select("#activity-title-container");
           DOM_EL.activityInstructionsContainer = select("#activity-instructions-container");
           DOM_EL.activityInstructionsContainer.mousePressed(backToLobby);
           DOM_EL.activityInstructionsRoom = select("#activity-instructions-room");
              DOM_EL.activityPause = select("#activity-title-button-pause");
              DOM_EL.activityPause.mousePressed(pauseEvent);
              DOM_EL.activityClear = select("#activity-title-button-clear");
              DOM_EL.activityClear.mousePressed(clearEvent);
              DOM_EL.activityAnon = select("#activity-title-button-anon");
              DOM_EL.activityAnon.mousePressed(toggleAnon);
              DOM_EL.activityExport = select("#activity-title-button-export");
              DOM_EL.activityExport.mousePressed(archivePdf);
              DOM_EL.activityFeedback = select("#activity-title-button-feedback");
              DOM_EL.activityFeedback.mousePressed(triggerFeedback);

          DOM_EL.activityContentContainer = select("#activity-content-container");
            DOM_EL.canvasContainer = select("#canvas-container");
            DOM_EL.activityContentPrompter = select("#activity-content-prompter");
            DOM_EL.canvas.parent(DOM_EL.canvasContainer);
    
      DOM_EL.questionContainer = select("#question-container");
        DOM_EL.addQuestionContainer = select("#add-question-container");
        DOM_EL.addQuestionContainer.mousePressed(addQuestionEvent);
        DOM_EL.questionsListContainer = select("#questions-list-container");

      DOM_EL.questionHideContainer = select("#question-hide-container");
        DOM_EL.questionHideContainer.mousePressed(toggleQuestionContainer)
      DOM_EL.activityQuestionInput = select("#activity-question-input");
      DOM_EL.activityQuestionInput.input(()=>{
        APP_STATE.activeQuestion.html(DOM_EL.activityQuestionInput.value());
      });
      DOM_EL.activityQuestionInput.elt.onblur = function(){
        APP_STATE.activeQuestion.html(DOM_EL.activityQuestionInput.value());
        updateRoomQuestion(APP_STATE.room,APP_STATE.activeQuestionContainer,DOM_EL.activityQuestionInput.value());
      }.bind(this);

    DOM_EL.userContainer = select("#user-container");
      DOM_EL.userCounter = select("#user-counter-container");
      DOM_EL.userHideContainer = select("#user-hide-container");
      DOM_EL.userHideContainer.mousePressed(toggleUserList);
      DOM_EL.userListContainer = select("#user-list-container");

    DOM_EL.newActivityContainer = select("#new-activity-container");
      DOM_EL.newActivityCreateContainer = select("#new-activity-create-container");
      DOM_EL.newActivityCreateContainer.mousePressed(createNewActivity);
      DOM_EL.newActivityCancelContainer = select("#new-activity-cancel-container");
      DOM_EL.newActivityCancelContainer.mousePressed(hideNewActivityContainer);
    DOM_EL.newActivityInput = select("#new-activity-input");
    
    
    DOM_EL.activityTypeDraw= select("#activity-type-draw");
    DOM_EL.activityTypeDraw.mousePressed(activityTypeDrawChosenEvent);
    DOM_EL.activityTypePhoto= select("#activity-type-photo");
    DOM_EL.activityTypePhoto.mousePressed(activityTypePhotoChosenEvent);
    DOM_EL.activityTypeSpeech= select("#activity-type-speech"); 
    DOM_EL.activityTypeSpeech.mousePressed(activityTypeSpeechChosenEvent);
    DOM_EL.activityTypeShape= select("#activity-type-shape");
    DOM_EL.activityTypeShape.mousePressed(activityTypeShapeChosenEvent);

    DOM_EL.optionTypeAnonymous= select("#option-type-anonymous");
    DOM_EL.optionTypeAnonymous.mousePressed(toggleOptionTypeAnon);
    DOM_EL.optionTypeCategorize= select("#option-type-categorize");
    DOM_EL.optionTypeCategorize.mousePressed(toggleOptionTypeCategorize);
    DOM_EL.optionTypeBubble= select("#option-type-bubble"); 
    DOM_EL.optionTypeBubble.mousePressed(toggleOptionTypeBubble);


    UTIL.scribble = new Scribble();
    windowResized();
  
    DOM_EL.lobbyContainer.hide();
    DOM_EL.newActivityContainer.hide();
    DOM_EL.mainContainer.hide();
}

function showQR(){
  DOM_EL.lobbyQRContainer.style("display","flex");
}

function hideQR(){
  DOM_EL.lobbyQRContainer.hide();
}

function backToLobby(){
  DOM_EL.mainContainer.hide();
  DOM_EL.lobbyContainer.show();
}

function triggerFeedback(){
  UTIL.socket.emit("bubblepit_feedback",{room:APP_STATE.room});
}

function toggleOptionTypeAnon(){
  if(DOM_EL.optionTypeAnonymous.elt.children[0].children[1].classList.contains("active")){
    DOM_EL.optionTypeAnonymous.elt.children[0].children[1].classList.remove("active"); 
  }
  else{
    DOM_EL.optionTypeAnonymous.elt.children[0].children[1].classList.add("active");
  }
}
function toggleOptionTypeCategorize(){
  if(DOM_EL.optionTypeCategorize.elt.children[0].children[1].classList.contains("active")){
    DOM_EL.optionTypeCategorize.elt.children[0].children[1].classList.remove("active"); 
  }
  else{
    DOM_EL.optionTypeCategorize.elt.children[0].children[1].classList.add("active");
  }
}
function toggleOptionTypeBubble(){
  if(DOM_EL.optionTypeBubble.elt.children[0].children[1].classList.contains("active")){
    DOM_EL.optionTypeBubble.elt.children[0].children[1].classList.remove("active"); 
  }
  else{
    DOM_EL.optionTypeBubble.elt.children[0].children[1].classList.add("active");
  }
}

function removeActiveActivityType(){
  APP_STATE.activityOptionTypeChosen = null;

  DOM_EL.activityTypeDraw.elt.children[0].children[1].classList.remove("active");
  DOM_EL.activityTypePhoto.elt.children[0].children[1].classList.remove("active");
  DOM_EL.activityTypeShape.elt.children[0].children[1].classList.remove("active");
  DOM_EL.activityTypeSpeech.elt.children[0].children[1].classList.remove("active");
}
function activityTypeSpeechChosenEvent(){
  removeActiveActivityType();
  DOM_EL.activityTypeSpeech.elt.children[0].children[1].classList.add("active");
  APP_STATE.activityOptionTypeChosen = "💬";
}
function activityTypeDrawChosenEvent(){
  removeActiveActivityType();
  DOM_EL.activityTypeDraw.elt.children[0].children[1].classList.add("active");
  APP_STATE.activityOptionTypeChosen = "🎨";
}
function activityTypePhotoChosenEvent(){
  removeActiveActivityType();
  DOM_EL.activityTypePhoto.elt.children[0].children[1].classList.add("active");
  APP_STATE.activityOptionTypeChosen = "📸";
}
function activityTypeShapeChosenEvent(){
  removeActiveActivityType();
  DOM_EL.activityTypeShape.elt.children[0].children[1].classList.add("active");
  APP_STATE.activityOptionTypeChosen = "🔠";
}

function createNewActivity(){
  if(DOM_EL.newActivityInput.value().length > 0){
    if(APP_STATE.activityOptionTypeChosen !== null){
      let n = Date.now();
      DOM_EL.questionContainers[n] = new QuestionContainer(DOM_EL.newActivityInput.value(), DOM_EL.questionContainers, APP_STATE.activityOptionTypeChosen ,false, false, false, [],{},n);
      newQuestionCache(n,DOM_EL.newActivityInput.value(),APP_STATE.activityOptionTypeChosen,false,false,false);
      hideNewActivityContainer();
      toggleActivityPrompt();
    }
    else{
      alert("you need to choose an activity type!");
    }
  }
  else{
    if(APP_STATE.activityOptionTypeChosen !== null){
      alert("you need to type in your question!");
    }
    else{
      alert("you need to type in your question AND choose an activity type!");
    }
  }


}

function newQuestionCache(key,title,type,anon, categorize, limited){
  let u = "?room=" + APP_STATE.room;
  let k = "&key=" + key;
  let t = "&type=" + type;
  let q = "&question=" + title;
  let a = "&anon=" + anon;
  let c = "&categorize=" + categorize;
  let l = "&limited=" + limited;


  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/create_room_cache' + u + k + t + q + a + c + l, true);
  xhr.onload = function () {
      console.log("updated room cache!!");
  };
  xhr.send(JSON.stringify());
}

function hideNewActivityContainer(){
  APP_STATE.activityOptionTypeChosen = null;
  DOM_EL.newActivityInput.value("");
  DOM_EL.newActivityContainer.hide();
  toggleActivityPrompt();
}

function toggleActivityPrompt(){
  if(Object.keys(DOM_EL.questionContainers).length > 0){
    DOM_EL.activityContentPrompter.hide();
  }
  else{
    DOM_EL.activityContentPrompter.style("display","flex");
  }
}

function addQuestionEvent(){
  DOM_EL.newActivityContainer.style("display","flex");
  globalStopDisplayMain();
}

function toggleQuestionContainer(){
  if(DOM_EL.questionContainer.class().includes("hidden")){
    DOM_EL.questionContainer.removeClass("hidden");
  }
  else{
    DOM_EL.questionContainer.addClass("hidden");
  }
}

function toggleUserList(){
  if(DOM_EL.userContainer.class().includes("hidden")){
    DOM_EL.userContainer.removeClass("hidden");
  }
  else{
    DOM_EL.userContainer.addClass("hidden");
  }
}

function pauseEvent(){
  if(DOM_EL.activityPause.class().includes("active")){
    console.log(`unpause all particpants in room ${APP_STATE.room}`);
    DOM_EL.activityPause.removeClass("active");
    UTIL.socket.emit("bubblepit_all_play",{"room" : APP_STATE.room});
    APP_STATE.pause = false;
  }
  else{
    console.log(`pause all particpants in room ${APP_STATE.room}`);
    DOM_EL.activityPause.addClass("active");
    UTIL.socket.emit("bubblepit_all_pause",{"room" : APP_STATE.room});
    APP_STATE.pause = true;
  }
}

function clearEvent(){
  if (confirm('Are you sure you want to clear responses? Changes are permanent')) {
    clearRoomResponses(APP_STATE.room,APP_STATE.activeQuestionContainer);
      CNV_EL.balls.forEach((ball) => {
        ball.div.remove();
      }
      );
      CNV_EL.balls = [];
      DOM_EL.questionContainers[APP_STATE.activeQuestionContainer].responses = {};
      } 
    else {
    console.log('No Change');
  }

}

function toggleAnon(){
  if(DOM_EL.activityAnon.class().includes("active")){
    DOM_EL.activityAnon.removeClass("active");
    APP_STATE.anonymous = false;
  }
  else{
    DOM_EL.activityAnon.addClass("active");
    APP_STATE.anonymous = true;
  }
}


function draw(){
    background("#f5f5f5");

    APP_STATE.ballDiameter= round(sqrt(width*height*2/(3*CNV_EL.balls.length)));
    if(APP_STATE.ballDiameter > height/3){APP_STATE.ballDiameter = height/3;}
    document.documentElement.style.setProperty('--ball', `${APP_STATE.ballDiameter/100}px`);

    CNV_EL.balls.forEach(ball => {
        ball.updateDiameter(CNV_EL.balls.length);
        ball.collide();
        ball.move();
        ball.display();
        ball.updateDiameterMultiplier();
      });
}


function addWrappedText({text, textWidth, doc, fontSize = 10, fontType = 'normal', lineSpacing = 7, xPosition = 10, initialYPosition = 10, pageWrapInitialYPosition = 10}) {
  var textLines = doc.splitTextToSize(text, textWidth); // Split the text into lines
  var pageHeight = doc.internal.pageSize.height;        // Get page height, well use this for auto-paging
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

      Object.keys(DOM_EL.questionContainers).forEach((key)=>{
        addWrappedText({
          text: "Question: " + DOM_EL.questionContainers[key].questionListContent.html(), // Put a really long string here
          textWidth: 220,
          doc: UTIL.pdf ,
          fontSize: '14',
          fontType: 'bold',
        });  
        Object.keys(DOM_EL.questionContainers[key].responses).forEach((person)=>{
          if(DOM_EL.questionContainers[key].responses[person].payload.includes("data:image/png;base64")){
            var pageHeight = UTIL.pdf.internal.pageSize.height;
            var pageWidth = UTIL.pdf.internal.pageSize.width;
            
            if(pageHeight - APP_STATE.cursorY < (pageWidth/2 - 30)){
              UTIL.pdf.addPage();
              APP_STATE.cursorY = 0;
            }
            addWrappedText({
              text: person + ": ", 
              textWidth: 220,
              doc : UTIL.pdf ,
            
              // Optional
              fontSize: '12',
              fontType: 'normal',
              initialYPosition: 5,
            });  
            UTIL.pdf.addImage(DOM_EL.questionContainers[key].responses[person].payload, "JPEG", 15, APP_STATE.cursorY + 5, pageWidth/2 - 30, pageWidth/2 - 30);
            APP_STATE.cursorY += (pageWidth/2 - 15);
          }
          else{
            addWrappedText({
              text: person + ": ", 
              textWidth: 220,
              doc : UTIL.pdf ,
              fontSize: '12',
              fontType: 'normal',
              initialYPosition: 15,
            });  
      
            addWrappedText({
              text: DOM_EL.questionContainers[key].responses[person].payload,
              textWidth: 220,
              doc : UTIL.pdf ,
              fontSize: '10',
              fontType: 'normal',
              lineSpacing: 5,               // Space between lines
              xPosition: 10,                // Text offset from left of document
              initialYPosition: 15,         // Initial offset from top of document; set based on prior objects in document
              pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
            });  
          }
        });
      });
    
      UTIL.pdf.autoPrint();
      UTIL.pdf.save();
      UTIL.pdf = null;
      UTIL.pdf = new jsPDF();
  
}



// function questionInputEvent(){
//   UTIL.socket.emit("bubblepit_question", {room : APP_STATE.room,value : this.value(),type: APP_STATE.questionType});
// }


function windowResized(){
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
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    }
}


function addBalls(){
  for(let i = 0; i<30; i++){
    CNV_EL.balls[UTIL.index] = new Ball(  
      i,
      i,
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eleifend aliquet purus nec iaculis. Nullam ut vestibulum nibh. Donec condimentum ligula a ex maximus, fermentum scelerisque nunc rutrum. Curabitur ac facilisis elit, at maximus elit. Duis luctus sagittis condimentum. Vivamus purus dui, faucibus nec congue quis, ornare vel ligula. Donec ultricies molestie risus sed vulputate. ",
      {R:255,G:255,B:255},
      (UTIL.index%4)*width*0.2 + width*0.1,
      round(UTIL.index/5)*width*0.2,
      random(width*0.2-10, width*0.2+10),
      UTIL.index,
      CNV_EL.balls,
    );
    UTIL.index++;
  }

}

function globalStopDisplayMain(){
  APP_STATE.pauseAnimation = false;
  CNV_EL.balls.forEach(ball => {
    ball.displayMain = false;
    ball.closeContentDiv.addClass("hide");
    ball.contentDiv.removeClass("expanded");
    ball.nameDiv.removeClass("expanded");
    ball.praiseDiv.removeClass("expanded");
    ball.closeDiv.removeClass("expanded");
  });
}



class Ball {
  constructor(id, title,contents,color,xin, yin, din, idin, oin) {
    this.socketId = id;
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
    if(contents.includes("data:image/png;base64") || contents.includes("data:image/jpeg;base64")){
      this.imageBall = true;
    }
    this.diameterMultiplier = 1.0;
    this.diameterMultiplierTarget = 1.0;
    this.div = null;
    this.contentDiv = null;
    this.nameDiv = null;
    this.closeDiv = null;
    this.displayBall = true;
    this.displayMain = false;
    this.mouseHold = false;
    this.hovered = false;
    this.ignorePropagate = false;
    
    this.div = createDiv();
    this.div.addClass("bubble-container");
    this.div.parent(DOM_EL.activityContentContainer);
    this.div.attribute("tabindex", "-1");
    this.div.elt.onblur = function(){
      APP_STATE.pauseAnimation = false;
      this.displayMain = false;
    }.bind(this);

    this.div.elt.addEventListener('mouseenter',this.mouseOverBubble.bind(this));
    this.div.elt.addEventListener('mouseleave',this.mouseOutBubble.bind(this));
    this.div.mouseMoved(this.bubbleMove.bind(this));
    this.div.touchMoved(this.bubbleMove.bind(this));

    this.divHandler = new Hammer(this.div.elt);
    this.divHandler.on('tap press pressup panend', function(ev) {
      if(ev.type == "tap"){
        if(this.displayBall){
          if(this.ignorePropagate){
            this.ignorePropagate = false;
          }
          else{
            this.displayContentDiv();
            console.log("bubble clicked");
          }
        }
      }
      else if(ev.type == "press"){
        this.bubbleSelected();
        this.div.addClass("grab");
      }
      else if(ev.type == "pressup"){
        this.bubbleDeselected();
        this.mouseOutBubble();
        this.div.removeClass("grab");
      }
      else if(ev.type == "panend"){
        this.bubbleDeselected();
        this.mouseOutBubble();
        this.div.removeClass("grab");
      }
    }.bind(this));

    this.div.elt.ondragstart = function() {
      return false;
    }

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
      this.contentDiv = createDiv();
      this.nameDiv = createDiv(this.title);
      this.nameDiv.parent(this.contentDiv);
      this.nameDiv.addClass("bubble-title");
    }

    this.contentDiv.attribute("tabindex", "-1");
    this.contentDiv.addClass("bubble");
    this.contentDiv.parent(this.div);

    this.contentDivChild = createDiv(contents);
    this.contentDivChild.addClass("bubble-text");
    this.contentDivChild.parent(this.contentDiv);

    this.closeContentDiv = createDiv("❌");
    this.closeContentDiv.addClass("bubble-close-content");
    this.closeContentDiv.addClass("hide");
    this.closeContentDiv.mousePressed(this.stopDisplayMain.bind(this));
    this.closeContentDiv.parent(this.div);

    this.closeDiv = createDiv("🗑️");
    this.closeDiv.parent(this.div);
    this.closeDiv.addClass("bubble-close");
    this.closeDiv.addClass("hidden");
    this.closeDiv.mousePressed(this.closeBubble.bind(this));

    this.praiseDiv = createDiv("👍");
    this.praiseDiv.parent(this.div);
    this.praiseDiv.addClass("bubble-praise");
    this.praiseDiv.addClass("hidden");
    this.praiseDiv.mousePressed(this.praiseEvent.bind(this));

  }

  stopDisplayMain(){
    APP_STATE.pauseAnimation = false;
    this.ignorePropagate = true;
    this.displayMain = false;
    this.closeContentDiv.addClass("hide");
    this.contentDiv.removeClass("expanded");
    this.nameDiv.removeClass("expanded");
    this.praiseDiv.removeClass("expanded");
    this.closeDiv.removeClass("expanded");
  }

  bubbleMove() {
    if(this.mouseHold){
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  bubbleSelected(){
    this.mouseHold = true;
    this.x = mouseX;
    this.y = mouseY;
  }

  bubbleDeselected(){
    this.mouseHold = false;
  }

  displayContentDiv(){
    this.closeContentDiv.removeClass("hide");
    this.contentDiv.addClass("expanded");
    this.nameDiv.addClass("expanded");
    this.praiseDiv.addClass("expanded");
    this.closeDiv.addClass("expanded");
    APP_STATE.pauseAnimation = true;
    this.displayMain = true;
  }

  showOptions(){
    this.closeDiv.removeClass("hidden");
    this.praiseDiv.removeClass("hidden");
  }

  hideOptions(){
    this.closeDiv.addClass("hidden");
    this.praiseDiv.addClass("hidden");
  }

  closeBubble(){ 
    this.div.style("display","none");
    this.contentDiv.hide();
    this.nameDiv.hide();
    this.closeDiv.hide();
    this.displayBall = false;
    this.div.remove();
    this.mouseOutBubble();

    if(DOM_EL.userList[this.socketId]){
      if(DOM_EL.userList[this.socketId].elt.children[1].innerHTML == "(archived)"){
        DOM_EL.userList[this.socketId].remove();
        delete DOM_EL.userList[this.socketId];
        delete CNV_EL.balls[this.id];
        CNV_EL.balls = arrayRemove(CNV_EL.balls,this.id);
        CNV_EL.balls.forEach((ball)=>{
          ball.others = CNV_EL.balls;
        });
      }
      else{
        DOM_EL.userList[this.socketId].elt.children[1].innerHTML = "❌";
      }
    }
    if(APP_STATE.pauseAnimation){
      globalStopDisplayMain();
    }
    clearRoomResponse(APP_STATE.room,APP_STATE.activeQuestionContainer,this.title,this.socketId);
    updateUserCount();
  }

  praiseEvent(){
    this.ignorePropagate = true;
    console.log("add thumbs up");
    if(this.praiseDiv.class().includes("highlighted")){
      this.div.removeClass("highlighted");
      this.praiseDiv.removeClass("highlighted");
      updatePraiseList(APP_STATE.room,APP_STATE.activeQuestionContainer,this.socketId);
    }
    else{
      this.div.addClass("highlighted");
      this.praiseDiv.addClass("highlighted");
      updatePraiseList(APP_STATE.room,APP_STATE.activeQuestionContainer,this.socketId,1);

    }
  }

  mouseOverBubble(){
    this.diameterMultiplierTarget = 1.2;
    this.hovered = true;
    this.showOptions();
  }

  mouseOutBubble(){
    this.diameterMultiplierTarget = 1.0;
    this.hovered = false;
    this.hideOptions();
    this.div.removeClass("grab");
    this.bubbleDeselected();
  }

  updateDiameterMultiplier(){
    this.diameterMultiplier = lerp(this.diameterMultiplier,this.diameterMultiplierTarget,0.3);
  }

  updateDiameter(index){
    this.diameter= round(sqrt(width*height*2/(3*index)));
    if(this.diameter > height/3){this.diameter = height/3;}
  }

  collide() {
    for (let i = this.id + 1; i < CNV_EL.balls.length; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      // let minDist = this.others[i].diameter*this.others[i].diameterMultiplier/2 + this.diameter*this.diameterMultiplier/2;
      let minDist = this.others[i].diameter/2 + this.diameter/2;


      if (distance < minDist) {
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
    if(!this.hovered){
      this.x += this.vx;
      this.y += this.vy;
      this.x += (this.randomSeed * (this.y-this.diameter/2)/height);

      if (this.x + this.diameter / 2 > width - APP_STATE.ballDiameter/5) {
        this.x = width - this.diameter / 2;
        this.vx *= UTIL.friction;
      } else if (this.x - this.diameter / 2 < APP_STATE.ballDiameter/5) {
        this.x = this.diameter / 2;
        this.vx *= UTIL.friction;
      }
      if (this.y + this.diameter / 2 > height) {
        this.y = height - this.diameter / 2;
        this.vy *= UTIL.friction;
      } else if (this.y - this.diameter / 2 < 0) {
        this.y = this.diameter / 2;
        this.vy *= UTIL.friction;
      }
    }
    else{
      if (this.x + this.diameter*this.diameterMultiplier / 2 > width - APP_STATE.ballDiameter/10) {
        this.x = width - this.diameter*this.diameterMultiplier / 2 - APP_STATE.ballDiameter/10;
        this.vx *= UTIL.friction;
      } else if (this.x - this.diameter*this.diameterMultiplier / 2 < APP_STATE.ballDiameter/10) {
        this.x = this.diameter*this.diameterMultiplier / 2 + APP_STATE.ballDiameter/10;
        this.vx *= UTIL.friction;
      }else{
        this.vx = 0;
        this.vy = 0;
      }
    }
  }

  display() {
    let titleHeight = document.getElementById('activity-title-container').offsetHeight;
    let questionHeight = 0;
    let inputHeight = document.getElementById('activity-question-input').offsetHeight;

    // if(this.imageBall){
    if(!APP_STATE.anonymous){
      this.nameDiv.show();
    }
    else{
      this.nameDiv.hide();
    }
    // }
    if(!APP_STATE.pauseAnimation){
      this.div.style("display","flex");
      if(this.displayBall){

        noStroke();
        noFill();
        // fill(this.color.R,this.color.G,this.color.B,10);
        // ellipse(    this.x, 
        //             this.y, 
        //             this.diameter * this.diameterMultiplier + this.randomSeed* sin(frameCount+this.randomPhase) - 3, 
        //             this.diameter * this.diameterMultiplier + this.randomSeed* cos(frameCount+this.randomPhase) - 3 
        // );
    
        fill(0);
    
        this.div.position(
                          this.x,
                          this.y + titleHeight + questionHeight + inputHeight
                          // this.y
                          );
        if(this.imageBall){
          this.div.size(
            this.diameter * this.diameterMultiplier,
            this.diameter * this.diameterMultiplier,
            );
        }
        else{
          this.div.size(
            this.diameter * this.diameterMultiplier,
            this.diameter * this.diameterMultiplier,
            );
        }
      }
    }
    else{
      if(this.displayMain){
        noStroke();
        noFill();
        ellipse(    width/2, 
                    height*0.9/2, 
                    height*0.9-20, 
                    height*0.9-20 
        );            
    
        fill(0); 
        this.div.position(
                          width/2,
                          height*0.9/2 + titleHeight + questionHeight + inputHeight
                          );
          this.div.size(
            height*0.9,
            height*0.9,
            );
      }
      else{
        this.div.hide();
      }
    }
  }
}

class QuestionContainer {
  constructor(title, array, type, anon, categorize, limit, responses, praises, key) {
    this.id = key;
    this.questionListContainer = createDiv();
    this.questionListContainer.addClass("question-list-container");
    this.questionListContainer.parent(DOM_EL.questionsListContainer);
    this.questionListContainer.mousePressed(this.questionClicked.bind(this));
    
    this.questionListIcon = createDiv(type);
    this.questionListIcon.addClass("question-list-icon");
    this.questionListIcon.parent(this.questionListContainer);

    this.questionListRemove = createDiv("🗑️");
    this.questionListRemove.addClass("question-list-remove");
    this.questionListRemove.parent(this.questionListContainer);
    this.questionListRemove.mousePressed(this.removeQuestion.bind(this));

    this.questionListContent = createDiv(title);
    this.questionListContent.addClass("question-list-content");
    this.questionListContent.parent(this.questionListContainer);

    this.type = type;
    this.anon = anon;
    this.responses = responses;
    this.praises = praises;
  }

 questionClicked(){
  windowResized();
  this.loadQuestion();
  UTIL.socket.emit("bubblepit_question", {room : APP_STATE.room, value : this.questionListContent.html(),type: this.type});
  UTIL.socket.emit("bubblepit_load_question", {room : APP_STATE.room, value : this.questionListContent.html(),type: this.type, id: UTIL.socket.id});
  }

  loadQuestion(){
   DOM_EL.activityQuestionInput.removeClass("hidden");
   DOM_EL.activityQuestionInput.value(this.questionListContent.html());
   DOM_EL.activityContentPrompter.hide();

   globalStopDisplayMain();

   Object.keys(DOM_EL.questionContainers).forEach((key)=>{
    DOM_EL.questionContainers[key].questionListContainer.removeClass("active");
   });
   this.questionListContainer.addClass("active");

   APP_STATE.question = this.questionListContent.html();
   APP_STATE.activeQuestion = this.questionListContent;
   APP_STATE.activeQuestionContainer = this.id;

  //  if(!APP_STATE.preventEcho){ 

  //  }else{
  //   APP_STATE.preventEcho = false;
  //  }


  Object.keys(DOM_EL.userList).forEach((key)=>{
    DOM_EL.userList[key].remove();
  });
  DOM_EL.userList = {}; //NEW
  Object.keys(APP_STATE.users).forEach((id)=>{ //populate active users first
    addUser(id,APP_STATE.users[id]);
  });

  CNV_EL.balls.forEach(ball => {
    ball.div.remove(); 
    });
    
  CNV_EL.balls = [];
  UTIL.index = 0;

  noLoop();
   Object.keys(this.responses).forEach((key)=>{ //populate all balls
      CNV_EL.balls[UTIL.index] = new Ball(  
        this.responses[key].socketId,
        key,
        this.responses[key].payload,
        this.responses[key].color,
        (UTIL.index%4)*width*0.2 + width*0.1,
        round(UTIL.index/5)*width*0.2,
        random(width*0.2-10, width*0.2+10),
        UTIL.index,
        CNV_EL.balls,
      );
      if(this.praises){
        console.log("praise list found");
        if(this.praises[this.responses[key].socketId]){
          CNV_EL.balls[UTIL.index].praiseEvent();
        }
      }
      if(!APP_STATE.users[this.responses[key].socketId]){ // Ball id dont match with current set of active user IDs
        addUser( this.responses[key].socketId,key);
        DOM_EL.userList[this.responses[key].socketId].addClass("archive");
        DOM_EL.userList[this.responses[key].socketId].elt.children[1].innerHTML = "(archived)";
      }
      else{  // Ball id  match with current set of active user IDs
        // if(DOM_EL.userList[this.responses[key].socketId].class().includes("archive")){}
        // else{
          console.log(`${this.responses[key].socketId} matches current user`);
          DOM_EL.userList[this.responses[key].socketId].elt.children[1].innerHTML = "✔️";
        // }
      }
      UTIL.index++;
   });
   loop();
   updateUserCount();
   }
  

 removeQuestion(){
  if (confirm('Are you sure you want to delete this question? Changes are permanent')) {
    let index = 0;
    DOM_EL.questionContainers.forEach((qContainer)=>{
      if(qContainer.questionListContent.html() == this.questionListContent.html()){
        DOM_EL.questionContainers.splice(index,1);
      }
      index++;
    });
    this.questionListContainer.remove();
    
    let u = "?room=" + APP_STATE.room;
    let k = "&key=" + this.id;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/delete_room_question' + u + k, true);
    xhr.onload = function () {
        console.log("deleted room question!!");
    };
    xhr.send(JSON.stringify());
    CNV_EL.balls = [];
    toggleActivityPrompt();
  }
  else{
    console.log("false alarm");
  }
 }
}

function arrayRemove(arr, value) {
  return arr.filter(function(ele){ 
      return ele != value; 
});
}

function convertRemToPixels(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}



