
var DOM_EL = {
    loginContainer: null,

    activitiesContainer: null,
    
    menuContainer: null,

    canvas: null,

}


var UTIL = {
    socket: null,
}

var APP_STATE = {
    width: null,
    height: null,
    username: null
}


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  APP_STATE.username = profile.getEmail();
 
  DOM_EL.loginContainer.hide();
  DOM_EL.menuContainer.style("display", "inline-flex");
  DOM_EL.activitiesContainer.show();

  // DOM_EL.projectsContainer.style("display", "flex");
  // DOM_EL.addProjectContainer.style("display", "flex");

  // DOM_EL.menuTitle.html("Choose quiz to edit");

  // loadProjectList();
}

window.onbeforeunload = function(){
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
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
}

function setup(){
    imageMode(CENTER);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    frameRate(10);
    startCon();

    windowResized();

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    // DOM_EL.canvas = createCanvas(APP_STATE.width,APP_STATE.height - titleHeight);


    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.menuContainer = select("#menu-container");
    DOM_EL.activitiesContainer = select("#activities-container");

    DOM_EL.menuContainer.hide();
    DOM_EL.activitiesContainer.hide();


    
}

function draw(){
    // background("#f5f5f5");

}



function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
    // resizeCanvas(APP_STATE.width, APP_STATE.height);

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      document.documentElement.style.setProperty('--vmin', `${vw}px`);
    //   DOM_EL.orientationContainer.style("display", "none");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh}px`);
    //   DOM_EL.orientationContainer.style("display", "flex");
    }
}






