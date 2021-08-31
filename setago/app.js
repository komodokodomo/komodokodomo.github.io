/*
NOTES and INSTRUCTIONS

Today we will start playing around with a little bit of Javascript. 
We need to use it so that we respond to button clicks, change how the webpage looks, send requests to server, etc.

We can definitely use plain javascript but there are libraries out there that simplify the usage / understanding.
We will be using a library called p5.js. (https://p5js.org/reference/)

you will need to copy this two lines into your html file: 
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.js"></script>  --------------- PLACE within the <head> tag
<script type="text/javascript" src="js/app.js"></script>   ----------------------------------------- PLACE within the <body> tag

lastly you need to place this file in your js folder.
*/
/////////////////////////////////////////////////////////////////////////

var DOM_EL = {
    loginPage : null,
        loginButton : null,
        loginPageUsername : null,
        loginPagePassword : null,
    focusAreaPage : null,
        focusArea: {},
        focusInnerContainer: null,
    focusAreaTab : null,
    mainPage : null,
        sidebarContainer : null,
            setagoTab : null,
            dashboardTab : null,
            challengeTab : null,
            progressionTab : null,
        dashboardPage : null,
            dashboardTitle: null,
            dashboardProgressBar: null,
            dashboardProgressBarText: null,
        challengePage : null,
        progressionPage : null,
            progressBars : {},
            progressionChosenContainer: null,
            progressionOtherContainer: null,
}

var APP_STATE = {
    data : null,
    username : null,
}

/////////////////////////////////////////////////////////////////////////


function setup(){ // a function that runs once

    noCanvas();

    DOM_EL.loginPage = select("#login-page");
        DOM_EL.loginButton = select("#login-button");
        DOM_EL.loginButton.mousePressed(loginEvent);
        DOM_EL.loginPageUsername = select("#login-page-username");
        DOM_EL.loginPagePassword = select("#login-page-password");
    DOM_EL.focusAreaPage = select("#focus-area-page");
        DOM_EL.focusArea = document.getElementsByClassName("flex-cell");
        DOM_EL.focusInnerContainer = select("#focus-inner-container");
        DOM_EL.focusAreaTab = select("#focus-area-donebutn");
        DOM_EL.focusAreaTab.mousePressed(focusAreaEvent);
    DOM_EL.mainPage = select("#main-page");
        DOM_EL.dashboardPage = select("#dashboard-page");
            DOM_EL.dashboardTitle = select("#dashboard-title");
            DOM_EL.dashboardProgressBar = select("#dashboard-progress-bar");
            DOM_EL.dashboardProgressBarText = select("#dashboard-progress-bar-text");
        DOM_EL.setagoTab = select("#title");
        DOM_EL.setagoTab.mousePressed(logoEvent);
        DOM_EL.dashboardTab = select("#dashboard-tab");
        DOM_EL.dashboardTab.mousePressed(dashboardEvent);
        DOM_EL.challengeTab = select("#challenge-tab");
        DOM_EL.challengeTab.mousePressed(challengeEvent);
        DOM_EL.progressionTab = select("#progression-tab");
        DOM_EL.progressionTab.mousePressed(progressionEvent);
        DOM_EL.challengePage = select ("#challenge-page");
        DOM_EL.progressionPage = select ("#progression-page");
            DOM_EL.progressionChosenContainer = select ("#progression-chosen-container");
            DOM_EL.progressionOtherContainer = select ("#progression-other-container");

    updateCSSVar();

    DOM_EL.focusAreaPage.hide();
    DOM_EL.mainPage.hide();
    DOM_EL.dashboardPage.hide();
    DOM_EL.challengePage.hide();
    DOM_EL.progressionPage.hide();

    Array.from(DOM_EL.focusArea).forEach((el)=>{
        el.addEventListener("click",() => {
            if(el.classList.contains("selected")){
                el.classList.remove("selected");
            }
            else{
                let num = Array.from(document.querySelectorAll(".flex-cell.selected")).length;
                if(num < 5){
                    el.classList.add("selected");
                }
            }
        });
    });
}


///////////////////////////////////////////////////////////////////////////

function draw(){  // a function that runs in a loop once function setup is finished

}
///////////////////////////////////////////////////////////////////////////
function changeUsernameTitles(){
    let titles = document.getElementsByClassName("username-title");
    titles.forEach((title)=>{
        title.innerHTML = "Welcome, " + APP_STATE.username;
    });
}

///////////////////////////////////////////////////////////////////////////

function loginEvent(){

let u = "?user=" + DOM_EL.loginPageUsername.value();
let k = "&password=" + DOM_EL.loginPagePassword.value();

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://cotf.cf/admin/SETAGO_GET_USER' + u + k, true);
xhr.onload = function () {
    if(this.status == 200){
        APP_STATE.username = DOM_EL.loginPageUsername.value();
        APP_STATE.data = JSON.parse(this.response);
        if(APP_STATE.data.competenciesChosen == null){
            console.log("show focus area survey");
            DOM_EL.loginPage.hide();
            DOM_EL.focusAreaPage.style("display","flex");
            changeUsernameTitles();
            initializeFocusAreaPage();
            // DOM_EL.dashboardTitle.html("Welcome, "+ APP_STATE.username);
            updateProgressBar();
        }
        else{
            console.log("show dashboard");
            DOM_EL.loginPage.hide();
            DOM_EL.mainPage.style("display","flex");
            DOM_EL.dashboardPage.style("display","flex");
            changeUsernameTitles();
            updateProgressBar();
            initializeProgressionPage(APP_STATE.data.competenciesChosen.split(","));
        }
    }
    else if(this.status == 404){
        console.log(this.response);
    }
};
xhr.send();
}

///////////////////////////////////////////////////////////////////////////

function updateProgressBar(){
    let totalPoints = 0;
    Object.keys(APP_STATE.data.competencies).forEach((key)=>{
        totalPoints += APP_STATE.data.competencies[key].points;
    });
    DOM_EL.dashboardProgressBarText.html(totalPoints + " points");
}


///////////////////////////////////////////////////////////////////////////

function initializeProgressionPage(arr){
    Object.keys(APP_STATE.data.competencies).forEach((key)=>{
        DOM_EL.progressBars[key] = new ProgressBar(APP_STATE.data.competencies[key].title,APP_STATE.data.competencies[key].points)
        DOM_EL.progressBars[key].container.parent(DOM_EL.progressionOtherContainer);
    });
    arr.forEach((key)=>{
        DOM_EL.progressBars[key].container.parent(DOM_EL.progressionChosenContainer);
    });
}

///////////////////////////////////////////////////////////////////////////

function initializeFocusAreaPage(){
    Object.keys(APP_STATE.data.competencies).forEach((key)=>{
        DOM_EL.focusArea[key] = new FocusArea(key, APP_STATE.data.competencies[key].title)
        // DOM_EL.focusArea[key].container.parent(DOM_EL.focusInnerContainer);
    });
}


///////////////////////////////////////////////////////////////////////////


function focusAreaEvent(){

    let arr = Array.from(document.querySelectorAll(".flex-cell.selected"));
    let num = arr.length;
    let arrToSend = [];
    if(num < 5){
        console.log("less than 5 areas chosen");
    }else{
        arr.forEach((el)=>{
            arrToSend.push(el.getAttribute("competency"));
        });
        let u = "?user=" + DOM_EL.loginPageUsername.value();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://cotf.cf/admin/SETAGO_SET_USER' + u, true);
        xhr.onload = function () {
            if(this.status == 200){
                hideAllsubPage();
                DOM_EL.mainPage.style("display", "flex");
                DOM_EL.dashboardPage.style("display","flex");
                initializeProgressionPage(arrToSend);
            }
            else if(this.status == 404){
                console.log(this.response);
            }
        };
        xhr.send(arrToSend);
    }
}

///////////////////////////////////////////////////////////////////////////

function logoEvent(){
    hideAllsubPage();
    DOM_EL.dashboardPage.style("display","flex");
}

///////////////////////////////////////////////////////////////////////////

function dashboardEvent(){
    hideAllsubPage();
    DOM_EL.dashboardPage.style("display","flex");
}

///////////////////////////////////////////////////////////////////////////

function challengeEvent(){
    hideAllsubPage();
    DOM_EL.challengePage.style("display","flex");
}

///////////////////////////////////////////////////////////////////////////

function progressionEvent(){
    hideAllsubPage();
    DOM_EL.progressionPage.style("display", "flex");
}

///////////////////////////////////////////////////////////////////////////

function hideAllsubPage(){
    DOM_EL.focusAreaPage.hide();
    DOM_EL.dashboardPage.hide();
    DOM_EL.challengePage.hide();
    DOM_EL.progressionPage.hide();
}

///////////////////////////////////////////////////////////////////////////

function updateCSSVar(){
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    let activityWidth = document.getElementById("focus-area-page").offsetWidth;
    let activityHeight = document.getElementById("focus-area-page").offsetHeight;
  
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

  ///////////////////////////////////////////////////////////////////////////

  function windowResized(){
    updateCSSVar();
  }

  class FocusArea { //FOR FUTURE TO POPULATE FROM JSON
      constructor(key,title,image){
        this.key = key;
        this.image = image;
        this.title = title;
  
        this.container = createDiv();
        this.container.addClass("flex-cell");
        this.container.attribute("competency",this.key);
        this.container.parent(DOM_EL.focusInnerContainer);
        this.container.mousePressed(this.clickEvent.bind(this));
  
        this.innerContainer = createDiv();
        this.innerContainer.addClass("activity-type");
        this.innerContainer.parent(this.container);
  
        this.titleContainer = createDiv();
        this.titleContainer.addClass("activity-type-title-container");
        this.titleContainer.parent(this.innerContainer);
  
        this.titleDiv = createDiv(this.title);
        this.titleDiv.addClass("activity-type-title");
        this.titleDiv.parent(this.titleContainer);
      }
      clickEvent(){
        if(this.container.elt.classList.contains("selected")){
            this.container.elt.classList.remove("selected");
        }
        else{
            let num = Array.from(document.querySelectorAll(".flex-cell.selected")).length;
            if(num < 5){
                this.container.elt.classList.add("selected");
            }
        }
      }
  }

  class ProgressBar { //FOR FUTURE TO POPULATE FROM JSON
      constructor(title,progress){
        this.container = createDiv();
        this.container.addClass("progress-bar-container");

        this.bar = createDiv();
        this.bar.addClass("progress-bar");
        this.bar.parent(this.container);
        this.bar.style("width", progress+"%");

        this.title = createDiv(title);
        this.title.addClass("progress-bar-text");
        this.title.parent(this.container);
      }

    updateprogress(percentage){
        this.bar.style("width", percentage+"%");
    }
  }

  class ChallengeActivity {
      constructor (title,description,image)
  }