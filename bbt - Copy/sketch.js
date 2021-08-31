

window.addEventListener('DOMContentLoaded', (event) => {
  updateCSSVar();
  registerDOM();
  registerEvents();
  registerAudio();
  SKETCHES.play = new p5(play,'sidebar-play');
  SKETCHES.activities = new p5(activities,'activities-inner-container');
  GLOBAL_DOM.contentContainer.classList.add("hide");
});

window.addEventListener("resize", updateCSSVar);

window.onbeforeunload = function(){
  var auth2 = gapi.auth2.getAuthInstance();
  sendLogoutTimestamp();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}


function onSignIn(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

  var profile = googleUser.getBasicProfile();
  GLOBAL_APP_STATE.username = profile.getEmail();
  sendLoginTimestamp();

  let u = "?account=" + GLOBAL_APP_STATE.username;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/GET_BBT_PROFILE' + u, true);
  xhr.onload = function(e) {
      if (this.status == 200) {
          GLOBAL_APP_STATE.activityJSON = JSON.parse(this.response);
          updateTimerFromCache();
          displayActivityPage();
          playMainAudio();
          getConsolidatedRatings();
          // SKETCHES.activities.populateActivityCells();
      }
      else if(this.status == 404 || this.status == 504) {
          console.log("server failed received request to get BBT profile,fall back on local default");
          fetch("activities.json")
          .then(response => response.json())
          .then(json => {
            console.log(json);
            GLOBAL_APP_STATE.activityJSON = json;
            updateTimerFromCache();
            playMainAudio();
            displayActivityPage();
            getConsolidatedRatings();
          });
      }
      GLOBAL_APP_STATE.local = false;
    };
  xhr.send();
}

function getConsolidatedRatings(){
  fetch("/admin/GET_BBT_RATINGS")
  .then(response => response.json())
  .then(json => {
    console.log(json);
    Object.keys(GLOBAL_APP_STATE.activityJSON.activities).forEach((key)=>{
      if(json[key]){
        GLOBAL_APP_STATE.activityJSON.activities[key].ratings = json[key];
      }
      else{
        GLOBAL_APP_STATE.activityJSON.activities[key].ratings = {"uses" : 0, "brain": 0, "happy": 0};
      }
    });
    SKETCHES.activities.populateActivityCells();
    updateCloudProfile();
  });
}


function displayActivityPage(){
  GLOBAL_DOM.navUser.innerHTML = GLOBAL_APP_STATE.username;
  GLOBAL_DOM.optionsContainer.classList.add("hide");
  GLOBAL_DOM.contentContainer.classList.remove("hide");
}


function updateTimerFromCache(){
  GLOBAL_APP_STATE.timerStartingValue = GLOBAL_APP_STATE.activityJSON.timing;
  GLOBAL_APP_STATE.timerValue = GLOBAL_APP_STATE.timerStartingValue;
  GLOBAL_DOM.sidebarTimerTitle.innerHTML = GLOBAL_APP_STATE.timerStartingValue + "s";
}

function getCachedVariables(){
  if(localStorage.getItem('username')){
    GLOBAL_APP_STATE.username = localStorage.getItem('username');
  }
  else{
    localStorage.setItem('username',"anon"+Date.now());
  }

  if(localStorage.getItem('activityJSON')){
    GLOBAL_APP_STATE.activityJSON = JSON.parse(localStorage.getItem('activityJSON'));
    SKETCHES.activities.populateActivityCells();
    updateTimerFromCache();
  }
  else{
    fetch("activities.json")
    .then(response => response.json())
    .then(json => {
      console.log(json);
      GLOBAL_APP_STATE.activityJSON = json;
      updateTimerFromCache();
      SKETCHES.activities.populateActivityCells();
      localStorage.setItem('activityJSON',JSON.stringify(json));
    });
  }
}

function updateCSSVar(){
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;

  let activityWidth = document.getElementById("activities-container").offsetWidth;
  let activityHeight = document.getElementById("activities-container").offsetHeight;

  if(activityWidth/activityHeight < 4/3){
    document.documentElement.style.setProperty('--vact', `${activityWidth*0.9/5}px`);
  }
  else{
    document.documentElement.style.setProperty('--vact', `${activityHeight/4}px`);
  }


  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);

  if(vh > vw){
    document.documentElement.style.setProperty('--vmin', `${vw}px`);
    document.documentElement.style.setProperty('--vmax', `${vh}px`);
  }
  else{
    document.documentElement.style.setProperty('--vmin', `${vh}px`);
    document.documentElement.style.setProperty('--vmax', `${vw}px`);
  }
}

function registerAudio(){
    GLOBAL_AUDIO.main = document.getElementById("audio-wheel");
    for(let i = 0; i < 4; i++){
      let name = "audio-f"+ (i+1);
      GLOBAL_AUDIO.fast[i] = document.getElementById(name);
    }
}

function playMainAudio(){
  let promise = GLOBAL_AUDIO.main.play();
  let audioPromise = [];
  if (promise !== undefined) {
    promise.then(_ => {
      GLOBAL_APP_STATE.activeMusic = GLOBAL_AUDIO.main;
      // console.log("audio started");
    }).catch(error => {
      console.error(error);
      console.log("looks like need some other way to start audio");
    });
  }
  for(let i=0; i<4; i++){
    audioPromise[i] = GLOBAL_AUDIO.fast[i].play();
    if (audioPromise[i] !== undefined) {
      audioPromise[i].then(_ => {
        // console.log("other audio started");
      }).catch(error => {
        console.error(error);
        console.log("looks like need some other way to start audio");
      });
    }
    GLOBAL_AUDIO.fast[i].volume = 0;
  }
}

function registerDOM(){

  GLOBAL_DOM.optionsContainer = document.getElementById("options-container");
    GLOBAL_DOM.optionsBuzz = document.getElementById("options-buzz");
    GLOBAL_DOM.optionsChill = document.getElementById("options-chill");
    // GLOBAL_DOM.optionsSkip = document.getElementById("options-skip");
  GLOBAL_DOM.contentContainer = document.getElementById("content-container");
    GLOBAL_DOM.contentInnerContainer = document.getElementById("content-inner-container");
    GLOBAL_DOM.activitiesContainer = document.getElementById("activities-container");
      GLOBAL_DOM.activitiesInnerContainer = document.getElementById("activities-inner-container");
      GLOBAL_DOM.activitiesContainerBG = document.getElementById("activities-container-bg");
      GLOBAL_DOM.activitiesEdit = document.getElementById("activities-edit");
      GLOBAL_DOM.activityContainers = document.getElementsByClassName("flex-cell");
    GLOBAL_DOM.sidebarContainer = document.getElementById("sidebar-container");
      GLOBAL_DOM.sidebarTimer = document.getElementById("sidebar-timer");
        GLOBAL_DOM.sidebarTimerTitle = document.getElementById("sidebar-timer-title");
        GLOBAL_DOM.sidebarTimerInput = document.getElementById("sidebar-timer-input");
        // GLOBAL_DOM.sidebarTimerEdit = document.getElementById("sidebar-timer-edit");
      GLOBAL_DOM.sidebarPlay = document.getElementById("sidebar-play");
      GLOBAL_DOM.sidebarRandom = document.getElementById("sidebar-random");
      GLOBAL_DOM.sidebarBack = document.getElementById("sidebar-back");
        // GLOBAL_DOM.sidebarRandomEdit = document.getElementById("sidebar-random-edit");
      GLOBAL_DOM.feedbackContainer = document.getElementById("feedback-container");
      // GLOBAL_DOM.feedbackStars = document.getElementsByClassName("star");
      GLOBAL_DOM.feedbackBrain = document.getElementsByClassName("brain");
      GLOBAL_DOM.feedbackHappy = document.getElementsByClassName("happy");
    GLOBAL_DOM.navUser = document.getElementById("nav-user");
    GLOBAL_DOM.navMute = document.getElementById("nav-mute");
}

function sendLoginTimestamp(){
  GLOBAL_APP_STATE.loginTimestamp = Date.now();
  let u = "?account=" + GLOBAL_APP_STATE.username;
  let t = "&timestamp=" + GLOBAL_APP_STATE.loginTimestamp;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/BBT_LOGIN' + u + t, true);
  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log("login timestamp sent")
      }
    };
  xhr.send();
}

function sendLogoutTimestamp(){
  let u = "?account=" + GLOBAL_APP_STATE.username;
  let t = "&timestamp=" + GLOBAL_APP_STATE.loginTimestamp;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/BBT_LOGOUT' + u + t, true);
  xhr.onload = function(e) {
      if (this.status == 200) {
        console.log("logout timestamp sent")
      }
    };
  xhr.send();
}

function registerEvents(){
  GLOBAL_DOM.optionsBuzz.addEventListener("click",() => {
    GLOBAL_APP_STATE.local = true;
    getCachedVariables();
    sendLoginTimestamp();
    displayActivityPage();
    playMainAudio();
  });
  GLOBAL_DOM.optionsChill.addEventListener("click",() => {
  });

  GLOBAL_DOM.activitiesContainerBG.addEventListener("click",() => {
    Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
      el.classList.remove('edit');
      el.classList.remove('selected');
    });
    Array.from(document.getElementsByClassName("cell-corner-title")).forEach((el)=>{
      el.classList.add('hide');
    });
    Array.from(document.getElementsByClassName("cell-corner-delete")).forEach((el)=>{
      el.classList.add('hide');
    });
    GLOBAL_APP_STATE.editActivities = false;
  });

  GLOBAL_DOM.activitiesEdit.addEventListener("click", function(){
    if(GLOBAL_APP_STATE.editActivities){
      GLOBAL_APP_STATE.editActivities = false;
      Array.from(document.getElementsByClassName("cell-corner-title")).forEach((el)=>{
        el.classList.add('hide');
      });
      Array.from(document.getElementsByClassName("cell-corner-delete")).forEach((el)=>{
        el.classList.add('hide');
      });
      Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
        el.classList.remove('edit');
      });
    }
    else{
      GLOBAL_APP_STATE.editActivities = true;
      Array.from(document.getElementsByClassName("cell-corner-title")).forEach((el)=>{
        el.classList.remove('hide');
      });
      Array.from(document.getElementsByClassName("cell-corner-delete")).forEach((el)=>{
        el.classList.remove('hide');
      });
      Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
        el.classList.add('edit');
        el.classList.remove('selected');
      });
    }
  });

  GLOBAL_DOM.sidebarTimer.addEventListener("click",() => {
    GLOBAL_DOM.sidebarTimerInput.classList.remove("hide");
    GLOBAL_DOM.sidebarTimerTitle.classList.add("hide");
    GLOBAL_DOM.sidebarTimerInput.value = GLOBAL_DOM.sidebarTimerTitle.innerHTML.split("s")[0];
    setTimeout(()=>{GLOBAL_DOM.sidebarTimerInput.focus();},20);
  });
  GLOBAL_DOM.sidebarTimerInput.addEventListener("blur",() => {
    GLOBAL_DOM.sidebarTimerInput.classList.add("hide");
    GLOBAL_DOM.sidebarTimerTitle.classList.remove("hide");
    if(GLOBAL_APP_STATE.timerStartingValue == GLOBAL_DOM.sidebarTimerInput.value){
      console.log("no change in value, no need to do anything");
    }
    else{
      GLOBAL_DOM.sidebarTimerTitle.innerHTML = GLOBAL_DOM.sidebarTimerInput.value +"s";
      GLOBAL_APP_STATE.timerStartingValue = GLOBAL_DOM.sidebarTimerInput.value;
      GLOBAL_APP_STATE.activityJSON.timing = GLOBAL_APP_STATE.timerStartingValue;
      if(GLOBAL_APP_STATE.local){
        localStorage.setItem("activityJSON",JSON.stringify(GLOBAL_APP_STATE.activityJSON));
      }
      else if(GLOBAL_APP_STATE.local == false){
        updateCloudProfile();
      }
      GLOBAL_APP_STATE.timerValue = GLOBAL_APP_STATE.timerStartingValue;
    }
  });

  GLOBAL_DOM.sidebarPlay.addEventListener("click",() => {
      if(GLOBAL_APP_STATE.activitySelected){
        GLOBAL_DOM.sidebarRandom.classList.add("hide");
        GLOBAL_DOM.sidebarBack.classList.remove("hide");
        GLOBAL_DOM.activitiesEdit.classList.add("hide");
        audioVolumeOut(GLOBAL_AUDIO.main);

        if(!GLOBAL_APP_STATE.activityStarted){
          GLOBAL_APP_STATE.activityStarted = true;
          if(!GLOBAL_APP_STATE.muted){
            audioVolumeIn(GLOBAL_AUDIO.fast);
          }
          GLOBAL_APP_STATE.activeMusic = GLOBAL_AUDIO.fast;
          UTIL.timer = setInterval(updateTimer, 1000);
          Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
            if(el.classList.contains("selected")){
              el.classList.remove('selected');
              el.classList.add('expanded');
              Array.from(el.children[0].children).forEach((child)=>{
                child.classList.add("expanded");
              });
            }else{
              el.classList.add('hide');
            }
            // index++;
          });
          if(!GLOBAL_APP_STATE.muted){
            audioVolumeIn(GLOBAL_AUDIO.fast[GLOBAL_APP_STATE.activityIndex%4]);
          }
          GLOBAL_APP_STATE.activeMusic = GLOBAL_APP_STATE.activityIndex%4;
        }
        else{
          GLOBAL_APP_STATE.activityStarted = false;
          audioVolumeOut(GLOBAL_AUDIO.fast[GLOBAL_APP_STATE.activityIndex%4]);
          clearInterval(UTIL.timer);
        }
        SKETCHES.play.toggleAnimation();

      }


  });
  GLOBAL_DOM.sidebarRandom.addEventListener("click",() => {
    if(!GLOBAL_APP_STATE.editActivities){
    let length =  Array.from(document.getElementsByClassName("flex-cell")).length;
    for(let i = 0; i<5; i++){
      setTimeout(()=>{
        let randomSelection = getRandomInt(length);
        Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
          el.classList.remove('selected');
        });
        GLOBAL_DOM.activityContainers[randomSelection].classList.add('selected');
      },300*i);
    }
    // let randomSelection = getRandomInt(length);
    // Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
    //   el.classList.remove('selected');
    // });
    // GLOBAL_DOM.activityContainers[randomSelection].classList.add('selected');
    GLOBAL_APP_STATE.activitySelected = true;
  }
  });

  GLOBAL_DOM.sidebarBack.addEventListener("click",() => {

    clearInterval(UTIL.timer);
    resetToMainMenu();

    Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
      el.classList.remove('selected');
      if(el.classList.contains('expanded')){
        Array.from(el.children[0].children).forEach((child)=>{
          // console.log(child);
          child.classList.remove("expanded");
        });
      }
      el.classList.remove('expanded');
      el.classList.remove('hide');

    });
    audioVolumeOut(GLOBAL_AUDIO.fast[GLOBAL_APP_STATE.activityIndex%4]);
    if(!GLOBAL_APP_STATE.muted){
      audioVolumeIn(GLOBAL_AUDIO.main);
    }
    GLOBAL_APP_STATE.activeMusic = GLOBAL_AUDIO.main;
  });

  for (let i = 0; i < GLOBAL_DOM.feedbackBrain.length; i++) {
    GLOBAL_DOM.feedbackBrain[i].addEventListener("click", function(){
      Array.from(document.querySelectorAll(".brain.selected")).forEach((el)=>{
          el.classList.remove('selected');
      });
        GLOBAL_DOM.feedbackBrain[i].classList.add("selected");
        GLOBAL_APP_STATE.brainFeedbackRating = GLOBAL_DOM.feedbackBrain.length-i;
        GLOBAL_APP_STATE.brainFeedbackGiven = true;
        checkFeedbackCompletion();
    });
  }

  for (let i = 0; i < GLOBAL_DOM.feedbackHappy.length; i++) {
    GLOBAL_DOM.feedbackHappy[i].addEventListener("click", function(){
      Array.from(document.querySelectorAll(".happy.selected")).forEach((el)=>{
          el.classList.remove('selected');
      });
        GLOBAL_DOM.feedbackHappy[i].classList.add("selected");
        GLOBAL_APP_STATE.happyFeedbackRating = GLOBAL_DOM.feedbackHappy.length-i;
        GLOBAL_APP_STATE.happyFeedbackGiven = true;
        checkFeedbackCompletion();
    });
  }

  GLOBAL_DOM.navMute.addEventListener("click", function(){
    if(GLOBAL_DOM.navMute.innerHTML == "🔊"){
      GLOBAL_DOM.navMute.innerHTML = "🔈";
      GLOBAL_APP_STATE.muted = true;
      audioVolumeOut(GLOBAL_APP_STATE.activeMusic,0.1);
    }
    else{
      GLOBAL_DOM.navMute.innerHTML = "🔊";
      GLOBAL_APP_STATE.muted = false;
      audioVolumeIn(GLOBAL_APP_STATE.activeMusic,0.1);
    }
  });
}

function updateCloudProfile(){
  let u = "?account=" + GLOBAL_APP_STATE.username;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/SET_BBT_PROFILE' + u, true);
  xhr.onload = function(e) {
    console.log("BBT profile updated");
  }
  xhr.send(JSON.stringify(GLOBAL_APP_STATE.activityJSON));
}

function checkFeedbackCompletion(){
  if(GLOBAL_APP_STATE.happyFeedbackGiven && GLOBAL_APP_STATE.brainFeedbackGiven){
    GLOBAL_APP_STATE.activitySelected = false;
    GLOBAL_APP_STATE.happyFeedbackGiven = false;
    GLOBAL_APP_STATE.brainFeedbackGiven = false;
    GLOBAL_DOM.feedbackContainer.classList.add("hide");

    SKETCHES.activities.containers[GLOBAL_APP_STATE.activityChosen].updateRatings(GLOBAL_APP_STATE.brainFeedbackRating,GLOBAL_APP_STATE.happyFeedbackRating);

    Array.from(document.querySelectorAll(".happy.selected, .brain.selected")).forEach((el)=>{
      el.classList.remove('selected');
  });
  }
}

function resetToMainMenu(){
  GLOBAL_APP_STATE.activityStarted = false;
  GLOBAL_APP_STATE.activitySelected = false;
  SKETCHES.play.toggleAnimation();

  setTimeout(()=>{  
    GLOBAL_DOM.sidebarRandom.classList.remove("hide");
    GLOBAL_DOM.sidebarBack.classList.add("hide");
    GLOBAL_DOM.activitiesEdit.classList.remove("hide");
    GLOBAL_DOM.sidebarTimerTitle.innerHTML = GLOBAL_APP_STATE.timerStartingValue + "s";
    GLOBAL_APP_STATE.timerValue = GLOBAL_APP_STATE.timerStartingValue;
  },10);

}

function updateTimer(){
      GLOBAL_APP_STATE.timerValue--;
      GLOBAL_DOM.sidebarTimerTitle.innerHTML = GLOBAL_APP_STATE.timerValue + "s";
      if(GLOBAL_APP_STATE.timerValue == 0){

        clearInterval(UTIL.timer);
        resetToMainMenu();

        Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
          el.classList.remove('selected');
          if(el.classList.contains('expanded')){
            Array.from(el.children[0].children).forEach((child)=>{
              child.classList.remove("expanded");
            });
          }
          el.classList.remove('expanded');
          el.classList.remove('hide');
      });
      audioVolumeOut(GLOBAL_AUDIO.fast[GLOBAL_APP_STATE.activityIndex%4]);
      if(!GLOBAL_APP_STATE.muted){
        audioVolumeIn(GLOBAL_AUDIO.main);
      }
      GLOBAL_APP_STATE.activeMusic = GLOBAL_AUDIO.main;
      GLOBAL_DOM.feedbackContainer.classList.remove("hide");
      }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var SKETCHES = {
  play: null,
}

var UTIL = {
  timer: null,
}

var GLOBAL_APP_STATE = {
  local: null,
  activityJSON: {},
  username: null,
  activitySelected: false,
  activityChosen : null,
  activityIndex: null,
  timerStartingValue: null,
  timerValue: null,
  editActivities: false,
  happyFeedbackGiven : false,
  brainFeedbackGiven: false,
  happyFeedbackRating : 0,
  brainFeedbackRating : 0,
  activeMusic : null,
  muted : null,
  activityFilter: "fast",
  loginTimestamp: null,
}

var GLOBAL_DOM = {
  optionsContainer: null,
    optionsBuzz: null,
    optionsChill: null,
  contentContainer: null,
    contentInnerContainer: null,
    activitiesContainer: null,
      activitiesInnerContainer: null,
      activitiesContainerBG: null,
      activitiesEdit: null,
    activityContainers: [],
    sidebarContainer: null,
      sidebarTimer: null,
        sidebarTimerTitle: null,
        sidebarTimerInput: null,
      sidebarPlay: null,
      sidebarRandom: null,
      sidebarBack: null,

  feedbackContainer: null,
  feedbackBrain: [],
  feedbackHappy: [],

  navUser: null,
  navMute: null,
}

var GLOBAL_AUDIO = {
  main: null,
  fast: [],
}



let play = ( sketch ) => {
  
  sketch.w = GLOBAL_DOM.sidebarPlay.offsetWidth;
  sketch.h = GLOBAL_DOM.sidebarPlay.offsetHeight;
  sketch.canvas;
  sketch.play = false;

  sketch.target1;
  sketch.target2;

  sketch.target1Actual;
  sketch.target2Actual;

  sketch.setup = () => {
    sketch.canvas = sketch.createCanvas(sketch.w,sketch.w);
    sketch.target1 = sketch.height/2;
    sketch.target2 = sketch.height/2;
    sketch.target1Actual = sketch.height/2;
    sketch.target2Actual = sketch.height/2;
    // sketch.canvas.id("play-canvas");
    sketch.fill(0);
    sketch.beginShape();
    sketch.vertex(sketch.width/4, sketch.height/4);
    sketch.vertex(3* sketch.width/4, sketch.target1);
    sketch.vertex(3* sketch.width/4, sketch.target2);
    sketch.vertex(sketch.width/4, 3 * sketch.height/4);
    sketch.endShape();
  }
  sketch.draw = () => {
    if(sketch.abs(sketch.target1-sketch.target1Actual)<0.01 && sketch.abs(sketch.target2-sketch.target2Actual)<0.01){
      sketch.noLoop();
    }
    else{
      sketch.target1Actual = sketch.lerp(sketch.target1Actual,sketch.target1,0.2);
      sketch.target2Actual = sketch.lerp(sketch.target2Actual,sketch.target2,0.2);
      sketch.clear();
      sketch.beginShape();
      sketch.vertex(sketch.width/4, sketch.height/4);
      sketch.vertex(3* sketch.width/4, sketch.target1Actual);
      sketch.vertex(3* sketch.width/4, sketch.target2Actual);
      sketch.vertex(sketch.width/4, 3 * sketch.height/4);
      sketch.endShape();
    }

  }
  sketch.toggleAnimation = () => {

    if(GLOBAL_APP_STATE.activityStarted){
      sketch.target1 = sketch.height/4;
      sketch.target2 = 3 * sketch.height/4;
    }
    else{
      sketch.target1 = sketch.height/2;
      sketch.target2 = sketch.height/2;
    }
    sketch.loop();

  }
  sketch.windowResized = () => {
    sketch.w = GLOBAL_DOM.sidebarPlay.offsetWidth;
    sketch.h = GLOBAL_DOM.sidebarPlay.offsetHeight;
    sketch.resizeCanvas(sketch.w,sketch.w);
    sketch.toggleAnimation();
  }
}
 

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function audioVolumeIn(q,r=0.02){
      var InT = 0;
      var setVolume = 1.0; // Target volume level for new song
      var speed = r; // Rate of increase
      q.volume = InT;
      var eAudio = setInterval(function(){
          InT += speed;
          q.volume = InT.toFixed(1);
          if(InT.toFixed(1) >= setVolume){
            clearInterval(eAudio);
            //alert('clearInterval eAudio'+ InT.toFixed(1));
          };
      },50);
}

function audioVolumeOut(q,r=0.005){
    if(q.volume){
       var InT = 0.4;
       var setVolume = 0;  // Target volume level for old song 
       var speed = r;  // Rate of volume decrease
       q.volume = InT;
       var fAudio = setInterval(function(){
           InT -= speed;
           q.volume = InT.toFixed(1);
           if(InT.toFixed(1) <= setVolume){
              clearInterval(fAudio);
              //alert('clearInterval fAudio'+ InT.toFixed(1));
           };
       },50);
    };
}

let activities = ( sketch ) => {
  sketch.containers = {};
  sketch.defaultJSON;
  sketch.sel;

  sketch.setup = () => {
    sketch.noCanvas();
    sketch.sel = sketch.createSelect();
    sketch.sel.id("activities-select");
    sketch.sel.option('fast');
    sketch.sel.option('slow');
    sketch.sel.option('mixed');
    sketch.sel.selected('fast');
    sketch.sel.changed(sketch.selEvent);
  }

  sketch.populateActivityCells = () =>{
    let index = 0;
    Object.keys(GLOBAL_APP_STATE.activityJSON.activities).forEach((k)=>{
      if(index == 12){
        console.log("12 activities already populated, stopping loop");
        return;
      }
      if(GLOBAL_APP_STATE.activityJSON.activities[k].type == GLOBAL_APP_STATE.activityFilter || GLOBAL_APP_STATE.activityFilter == "mixed"){
        sketch.containers[k] = new ActivityCell({
          "key":k,
          "emoji":GLOBAL_APP_STATE.activityJSON.activities[k].emoji,
          "image": GLOBAL_APP_STATE.activityJSON.activities[k].image,
          "ratings":{
            "uses":GLOBAL_APP_STATE.activityJSON.activities[k].ratings.uses,
            "brain":GLOBAL_APP_STATE.activityJSON.activities[k].ratings.brain,
            "happy":GLOBAL_APP_STATE.activityJSON.activities[k].ratings.happy
          },
          "title":GLOBAL_APP_STATE.activityJSON.activities[k].title
        });
        index++;
      }

    });
  }

  sketch.selEvent = () =>{
    GLOBAL_APP_STATE.activityFilter = sketch.sel.value();
    Object.keys(sketch.containers).forEach((key)=>{
      sketch.containers[key].container.remove();
      delete sketch.containers[key];
    });
    sketch.containers = {};
    setTimeout(sketch.populateActivityCells,200);
  }

  sketch.draw = () => {
    
  }

  class ActivityCell {
    constructor({key = null, image = null,emoji = null,ratings = null,title = null}) {
      this.key = key;
      this.image = image;
      this.ratings = ratings;
      this.emoji = emoji;
      this.title = title;

      this.container = sketch.createDiv();
      this.container.addClass("flex-cell");
      this.container.parent(GLOBAL_DOM.activitiesInnerContainer);
      this.container.mousePressed(this.clickEvent.bind(this));

      this.innerContainer = sketch.createDiv();
      this.innerContainer.addClass("activity-type");
      this.innerContainer.parent(this.container);

      this.titleContainer = sketch.createDiv();
      this.titleContainer.addClass("activity-type-title-container");
      this.titleContainer.parent(this.innerContainer);

      this.titleDiv = sketch.createDiv(this.title);
      this.titleDiv.addClass("activity-type-title");
      this.titleDiv.parent(this.titleContainer);
      
      this.feedbackContainer = sketch.createDiv();
      this.feedbackContainer.addClass("activity-type-feedback-container");
      if(ratings.uses == 0){
        this.feedbackContainer.addClass("inactive");
      }
      this.feedbackContainer.parent(this.innerContainer);

      this.feedbackUses = sketch.createDiv(ratings.uses + " uses");
      this.feedbackUses.addClass("activity-type-feedback-uses");
      this.feedbackUses.parent(this.feedbackContainer);
      if(ratings.uses == 0){
        this.feedbackBrain = sketch.createDiv("🧠 N.A");
      }
      else{
        this.feedbackBrain = sketch.createDiv("🧠 " + (ratings.brain/ratings.uses).toFixed(1) + "/5");
      }
      this.feedbackBrain.addClass("activity-type-feedback-brain");
      this.feedbackBrain.parent(this.feedbackContainer);
      if(ratings.uses == 0){
        this.feedbackHappy = sketch.createDiv("😬 N.A");
      }
      else{
        this.feedbackHappy = sketch.createDiv("😬 " + (ratings.happy/ratings.uses).toFixed(1) + "/5");
      }
      this.feedbackHappy.addClass("activity-type-feedback-happy");
      this.feedbackHappy.parent(this.feedbackContainer);
      
      this.imageContainerDiv = sketch.createDiv();
      if(this.emoji !== null){
        this.imageContainerDiv.html(this.emoji);
      }
      this.imageContainerDiv.addClass("activity-type-image-container");
      this.imageContainerDiv.parent(this.innerContainer);

      if(this.image !== null){
        this.imageDiv = sketch.createImg(image,title);
        this.imageDiv.addClass("activity-type-image");
        this.imageDiv.parent(this.imageContainerDiv);
      }
      
      this.editDiv = sketch.createDiv("✏️");
      this.editDiv.addClass("cell-corner-title");
      this.editDiv.addClass("hide");
      this.editDiv.mousePressed(editActivityEvent);
      this.editDiv.parent(this.innerContainer);
      
      this.deleteDiv = sketch.createDiv("🗑️");
      this.deleteDiv.addClass("cell-corner-delete");
      this.deleteDiv.addClass("hide");
      this.deleteDiv.mousePressed(this.deleteEvent.bind(this));
      this.deleteDiv.parent(this.innerContainer);
    }

    updateRatings(brain,happy){
      this.feedbackContainer.removeClass("inactive");
      this.ratings.brain = this.ratings.brain + brain;
      this.ratings.happy = this.ratings.happy + happy;
      this.ratings.uses++;

      this.feedbackUses.html(this.ratings.uses + " uses");
      this.feedbackBrain.html("🧠 " + (this.ratings.brain/this.ratings.uses).toFixed(1) + "/5");
      this.feedbackHappy.html("😬 " + (this.ratings.happy/this.ratings.uses).toFixed(1) + "/5");

      GLOBAL_APP_STATE.activityJSON.activities[this.key].ratings = this.ratings;
      if(GLOBAL_APP_STATE.local){
        localStorage.setItem("activityJSON",JSON.stringify(GLOBAL_APP_STATE.activityJSON));
      }
      else if(GLOBAL_APP_STATE.local == false){
        updateCloudProfile();
      }

      let u = "?key=" + GLOBAL_APP_STATE.activityChosen;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/admin/UPDATE_BBT_RATINGS' + u, true);
      xhr.onload = function(e) {
        console.log("BBT consolidated ratings updated");
      }
      xhr.send(JSON.stringify({"brain":brain,"happy":happy}));
    }

    deleteEvent(){
      this.container.addClass("fade");
      setTimeout(()=>{
        this.container.hide();
        this.container.removeClass("fade");
      },300);
    }

    clickEvent(){
      GLOBAL_APP_STATE.activityChosen = this.key;
        Array.from(document.getElementsByClassName("flex-cell")).forEach((el)=>{
            el.classList.remove('selected');
        });
        if(!GLOBAL_APP_STATE.editActivities){
          this.container.addClass("selected");
          GLOBAL_APP_STATE.activityIndex = Array.prototype.indexOf.call(this.container.elt.parentNode.children, this.container.elt);
          GLOBAL_APP_STATE.activitySelected = true;
        }
    }
  }
}

function editActivityEvent(){
  console.log("open edit activity modal");
}






