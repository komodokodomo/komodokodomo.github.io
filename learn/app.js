
var DOM_EL = {

  loginContainer: null,
    loginTitleContainer: null,
    loginInput: null,
    loginButton: null,
  
  onboardContainer: null,
    onboardContentContainer: null,
    onboardButton: null,
  
  captureContainer: null,
    captureHeaderContainer: null,
      captureHeader: null,
      captureInstanceTitle: null,
      captureSubheader: null,
    canvasContainer: null,
      capture: null,
      captureOverlay: null,
      captureFlip: null,
      captureChange: null,
      canvas: null,
    personaContainer: null,
      personaAvatar: null,
    personaTextContainer: null,
      personaText: null,
      personaButton: null,
    evidenceContainer: null,
      evidenceBox: null,
      evidenceHeader: null,
      evidenceSubheader: null,
      evidenceListContainer: null,
      evidenceList: null,
      evidenceListItemContainer: [],
      evidenceListItem: [],
        evidenceListItemImage: [],
        evidenceListItemNudge: [],
      evidenceListItemTitle: [],
      
  contentContainer: null,
    contentClose: null,
    contentTitleContainer: null,
      contentHeader: null,
      contentImageContainer: null,
      contentClass: null,
    contentBoxContainer: null,
      contentBox: null,
        content: null,
      contentSocialContainer: null,
        contentSocial: null,
        contentSocialChatbox: null,
        contentSocialButton: null,
      contentInstruction: null,
   
    contentLensesContainer: null,
      carouselContainer: null,
        carouselCell: [],
          carouselCellEmoji: [],
          carouselCellTitle: [],
    
  completionContainer: null,
      completionHeader: null,
      completionImageContainer: null,
      completionContent: null,
    completionButton: null,

  loadingContainer: null,
    loadingBarContainer: null,
      loadingBar: null,
    loadingHeader: null,
    loadingContent: null,

  orientationContainer: null,
    orientationImageContainer: null,
      orientationImage: null,
    orientationHeader: null,
    orientationContent: null,
}

var APP_STATE = {
  pinJson : null,
  data: null,
  predictedClass: null,
  probability: null,

  promptTimer: 0,
  prompt: false,

  displayName: [],
  lensName: [],
  whitelist: [],

  DOMRegistered: false,
  switchFlag: false,
  mobileDevice: false,
  loginCode: null,
  cameraFlip: false,
  numClasses: null,
  numClassesObtained: false,
  numLens: null,
  swipeCounter: 0,
  lensCounter: 0,
  evidenceFound: false,
  evidencesFound: [],
  evidenceCounter: 0,
  evidenceDetected: null,
  prevEvidenceDetected: null,
  completed: false
}

var MISC = {
  thinking: ".",
  findingText: "I need a better angle",
  redirectText: "Nope, we should look elsewhere",
  hardcoded: true,
}

var SOUNDS = {
  shutter: null,
  evidence: null,
  complete: null,
  background: null
}

var UTIL = {
  quill: null,
  descriptionQuill: null,
  description: null,
}

let model;
let dictionary;

var featureExtractor,classifier;
const PREDICT_UPPERBOUND = 0.97;
const PREDICT_LOWERBOUND = 0.92;
let projectFiles = [];


function loadQuizManifest(){

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/pinlist', true);
  xhr.responseType = "json";

  xhr.onload = function(e) {
      if (this.status == 200) {
        var data = this.response;
        APP_STATE.pinJson = data;
        console.log(data);
      }
      else if(this.status == 404) {
        console.log("no pin package active");
      }
    };
  xhr.send("load all active pin");
}

function loadProjectDetails(account,project){
  let u = "?account=" + account;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/LIST_PROJECT' + u, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
          var data = JSON.parse(this.response);
          console.log(data);
          let modelFound = false;
          Object.keys(data).forEach(key => {
            if(data[key].pin == DOM_EL.loginInput.value() && data[key].modelTrained){
            console.log("model detected, proceeding");
            loadProjectModel(account, project);
            // UTIL.description = JSON.parse(JSON.stringify(data[key].description));
            if(typeof data[key].description === 'string'){
              UTIL.descriptionQuill.setContents(JSON.parse(data[key].description));
            }
            else{
                UTIL.descriptionQuill.setContents(data[key].description);
            }
            // UTIL.descriptionQuill.setContents(UTIL.description);
            DOM_EL.captureInstanceTitle.html(data[key].name);
            console.log(UTIL.description);
            modelFound = true;
          }
            // else{
            //   console.log("quiz project found but no model detected, not proceeding"); //ABIT DIRTY HERE SINCE THE MESSAGE REPEATS OVER THE LOOP
            //   showLoginError(); 
            // }
        });
        if(!modelFound){
          console.log("quiz project found but no model detected, not proceeding"); 
          showLoginError(); 
        }
          // init();
      }
      else if(this.status == 404) {
        console.log("no quiz manifest found");
        showLoginError();
      }
    };
  xhr.send("load projectlist.json");
}

function loadProjectAssets(account,project){
  let u = "?account=" + account;
  let p = "&project=" + project;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/LIST_CLASS' + u + p, true);

  xhr.onload = function(e) {
      if (this.status == 200) {
          var data = JSON.parse(this.response);
          APP_STATE.data = data;
          Object.keys(APP_STATE.data).forEach(key => APP_STATE.displayName[key] = APP_STATE.data[key].name);
          Object.keys(APP_STATE.data[Object.keys(APP_STATE.data)[0]].content).forEach(key => APP_STATE.lensName[key] = APP_STATE.data[Object.keys(APP_STATE.data)[0]].content[key].name);
          
          for(let i = 0; i < Object.keys(APP_STATE.lensName).length; i++){
            DOM_EL.carouselCellTitle[i].html(APP_STATE.data[Object.keys(APP_STATE.displayName)[0]].content[Object.keys(APP_STATE.lensName)[i]].name); 
            DOM_EL.carouselCellEmoji[i].html(twemoji.parse(APP_STATE.data[Object.keys(APP_STATE.displayName)[0]].content[Object.keys(APP_STATE.lensName)[i]].emoji));
          }
          console.log(APP_STATE.data);
          init();
      }
      else if(this.status == 404) {
        console.log("no classList.json detected, new project maybe?");
      }
    };
  xhr.send("load classlist.json");
}


function loadProjectModel(account,project){
  let jsonFile;
  let weightsFile;
  let u = "?account=" + account;
  let p = "&project=" + project;
  APP_STATE.modelTrained = false;


  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/admin/model' + u + p, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function(e) {
      if (this.status == 200) {
        var data = this.response;

        jsonFile = new File([String.fromCharCode.apply(null, new Uint8Array(data))], "model.json");

        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', '/admin/model_weight' + u + p, true);
        xhr2.responseType = "blob";
        xhr2.onload = function(e) {
          if (this.status == 200) {
              let d = this.response;
              console.log(d);
              let dd = new Blob([d], {type: 'application/octet-stream'});
              weightsFile = new File([dd], "model.weights.bin");
              projectFiles.push(jsonFile);
              projectFiles.push(weightsFile);
              featureExtractor = null; //reset featureExtractor
              featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded); 

              DOM_EL.loginContainer.hide();
              DOM_EL.onboardContainer.show();
              loadProjectAssets(account,project);
              // init();
              // hideAlertStatus();
          }
        };

        xhr2.send("get weights");
      }
      else if(this.status == 404) {
        console.log("no zipped model detected, new project maybe?");
        showLoginError();
        // hideAlertStatus();
      }
    };
  xhr.send("load project model");
}

async function modelLoaded() {
  console.log("Model Loaded!");
  classifier = featureExtractor.classification();
  Array.from(projectFiles).forEach((file) => {
    if (file.name.includes('.json')) {
        console.log("found a json file")
    } else if (file.name.includes('.bin')) {
        console.log("found a bin file")
    }
  });
  await classifier.load(projectFiles);
  classifier.classify( DOM_EL.canvas.elt, gotNumClasses);
}

function gotResults(err, result) {

  let label = APP_STATE.data[result[0].label].name;
  
  if(result)
      {
        if(label !== "irrelevant"){
          if(result[0].confidence > PREDICT_LOWERBOUND && result[0].confidence < PREDICT_UPPERBOUND && APP_STATE.evidenceFound == false){
            let s = "Hmmm" + MISC.thinking + "is it a " + label +" ?";
            DOM_EL.personaText.html( MISC.thinking+ "is it a " +label +"?");
            DOM_EL.personaButton.addClass("inactive");
          }
          else if(result[0].confidence > PREDICT_LOWERBOUND && result[0].confidence < PREDICT_UPPERBOUND && APP_STATE.evidenceFound){
          }
          else if(result[0].confidence > PREDICT_UPPERBOUND && APP_STATE.evidenceFound == false){
            APP_STATE.evidenceFound = true;
            DOM_EL.personaText.html("I see a " + label +".");
            APP_STATE.evidenceDetected = label;
            DOM_EL.personaButton.removeClass("inactive");
          }
          else if(result[0].confidence > PREDICT_UPPERBOUND && APP_STATE.evidenceFound){
          }
          else if(result[0].confidence < PREDICT_LOWERBOUND){
            if(APP_STATE.evidenceFound){
              APP_STATE.evidenceFound = false;
            }
            DOM_EL.personaText.html(MISC.findingText + MISC.thinking);
            DOM_EL.personaButton.addClass("inactive");
          }
        }
        else if(label == "irrelevant"){
          if(APP_STATE.evidenceFound){
            APP_STATE.evidenceFound = false;
          }
          DOM_EL.personaText.html(MISC.findingText + MISC.thinking);
          DOM_EL.personaButton.addClass("inactive");
        }
      }
    if(err){
      console.log(error);
    }
  setTimeout(function(){classifier.classify( DOM_EL.canvas.elt, gotResults);},20);
}

function preload() {
  soundFormats('mp3', 'ogg');
  SOUNDS.shutter = loadSound('sound/shutter');
  SOUNDS.evidence = loadSound('sound/evidence');
  SOUNDS.complete = loadSound('sound/complete');
}

window.addEventListener('DOMContentLoaded', () => {
  APP_STATE.mobileDevice = isMobile();
});

window.addEventListener("visibilitychange", () => {
  if(document.hidden){
    if(APP_STATE.DOMRegistered){
      DOM_EL.capture.elt.pause();
    }
    console.log("window hidden");
  }
  else{
    if(APP_STATE.DOMRegistered){
      DOM_EL.capture.elt.play();
    }    
    console.log("window shown");
  }
});


function checkOrientation(){
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;

  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);

  if(vh > vw){
    document.documentElement.style.setProperty('--vmin', `${vw*2}px`);
    DOM_EL.orientationContainer.style("display", "none");
  }
  else{
    document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    DOM_EL.orientationContainer.style("display", "flex");
  }
}

function addChatLog(){
  let listEl = createElement('li');
  listEl.addClass("content-social-list")
  let usernameSpanEl = createSpan();
  let textSpanEl = createSpan();

  usernameSpanEl.addClass('username');
  usernameSpanEl.html("you");
  textSpanEl.addClass('text');
  textSpanEl.html(DOM_EL.contentSocialChatbox.value());

  listEl.child(usernameSpanEl);
  listEl.child(textSpanEl);

  DOM_EL.contentSocial.child(listEl);
  listEl.elt.scrollIntoView();
  DOM_EL.contentSocialChatbox.value('');
}

function onboard(){
  DOM_EL.onboardContainer.hide();
  DOM_EL.captureContainer.show();
  classifier.classify( DOM_EL.canvas.elt, gotResults);
}

function login(){
  
  let account;
  let project;

  if(APP_STATE.pinJson[DOM_EL.loginInput.value()] !== undefined){
    account = APP_STATE.pinJson[DOM_EL.loginInput.value()].directory.split("/")[0];
    project = APP_STATE.pinJson[DOM_EL.loginInput.value()].directory.split("/")[1];
    console.log(account + ", " + project);
    loadProjectDetails(account,project);
  }
  else{
    showLoginError();
  }
}

function showLoginError(){
  DOM_EL.loginInput.removeClass("no-error");
  setTimeout(function(){
    DOM_EL.loginInput.addClass("no-error");
  },300);
}

function openContent(){
  // DOM_EL.contentHeader.html("Evidence " + i);
  DOM_EL.contentContainer.style("display","flex");
  setTimeout(function(){
    DOM_EL.contentContainer.removeClass("fade");
  },0);
}

function contentCloseEvent(){
  APP_STATE.promptTimer = millis();
  DOM_EL.contentContainer.addClass("fade");
  setTimeout(function(){
    DOM_EL.contentContainer.hide();
    if(APP_STATE.evidencesFound.length == APP_STATE.numClasses && APP_STATE.completed == false){
      APP_STATE.completed = true;
      SOUNDS.complete.play();
      DOM_EL.completionContainer.show();
      DOM_EL.evidenceHeader.html("All Evidence Collected!");
    }
  },300);
}

function captureEvidenceEvent(){
  if(DOM_EL.personaButton.class() !== "inactive"){

    DOM_EL.captureOverlay.addClass("snap");
    SOUNDS.shutter.play();
    setTimeout(function(){
      DOM_EL.captureOverlay.removeClass("snap");
    },50);

    if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
      console.log("replacing image");
      for(let i = 0; i<DOM_EL.evidenceListItemTitle.length; i++){
        if(DOM_EL.evidenceListItemTitle[i].html() == APP_STATE.evidenceDetected){
          let dataUrl = DOM_EL.canvas.elt.toDataURL(0.5);
          DOM_EL.evidenceListItem[i].elt.children[0].src = dataUrl;
        }
      }
    }
    else{
      APP_STATE.promptTimer = millis();
      let dataUrl = DOM_EL.canvas.elt.toDataURL(0.5);
      let i = createImg(dataUrl);
      i.class("evidence-list-item-image");
      i.parent(DOM_EL.evidenceListItem[APP_STATE.evidenceCounter]);
  
      DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter].html(APP_STATE.evidenceDetected);

      DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter].elt.scrollIntoView({behavior: 'smooth'});
      DOM_EL.evidenceListItem[APP_STATE.evidenceCounter].removeClass("noimage");
      DOM_EL.evidenceSubheader.html("Click on the captured evidence to see what can be done with it!");
      
      APP_STATE.evidencesFound[APP_STATE.evidenceCounter] = APP_STATE.evidenceDetected;
      APP_STATE.evidenceCounter++;

      DOM_EL.evidenceHeader.html(APP_STATE.evidenceCounter.toString()+ "/" + APP_STATE.numClasses + " Evidence Collected");

      
      DOM_EL.contentHeader.html("Evidence " +  DOM_EL.evidenceListItemContainer[APP_STATE.evidenceCounter-1].attribute("index"));
      DOM_EL.contentClass.html(DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter-1].html());
      
      // let t = DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter-1].html().replace( / /g , "_" );
      changeContent(Object.keys(APP_STATE.lensName)[overflow(APP_STATE.lensCounter, APP_STATE.numLens)], getKeyByValue(APP_STATE.displayName, APP_STATE.evidenceDetected));

      let d = document.getElementById("content-image");
      d.src = DOM_EL.evidenceListItem[APP_STATE.evidenceCounter-1].elt.childNodes[0].src;
      DOM_EL.contentContainer.style("display","flex");
      setTimeout(function(){
        DOM_EL.contentContainer.removeClass("fade");
      },0);

    }
    

  }
  
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function registerDOM(){
  DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginTitleContainer = select("#login-title-container");
    DOM_EL.loginInput = select("#login-input");
      DOM_EL.loginInput.addClass("no-error");
    DOM_EL.loginButton = select("#login-button");
      DOM_EL.loginButton.mousePressed(login);

  DOM_EL.onboardContainer = select("#onboard-container");
    DOM_EL.onboardContentContainer = select("#onboard-content-container");
    DOM_EL.onboardButton = select("#onboard-button");
      DOM_EL.onboardButton.mousePressed(onboard);
  DOM_EL.onboardContainer.hide();

  DOM_EL.captureContainer = select("#capture-container");
    DOM_EL.captureHeaderContainer = select("#capture-header-container");
      DOM_EL.captureHeader = select("#capture-header");
      DOM_EL.captureInstanceTitle = select("#capture-instance-title");
      DOM_EL.captureSubheader = select("#capture-subheader");
    
      DOM_EL.canvasContainer = select("#canvas-container");

      DOM_EL.canvas = createCanvas(224/pixelDensity(),224/pixelDensity());
      DOM_EL.canvas.id("canvas");
      DOM_EL.canvas.parent(DOM_EL.canvasContainer);

      DOM_EL.capture = createCapture({
        video: {
            facingMode: "environment"
        }});
      DOM_EL.capture.parent(DOM_EL.canvasContainer);
      DOM_EL.capture.id("video");
      
      DOM_EL.captureOverlay = createDiv();
      DOM_EL.captureOverlay.parent(DOM_EL.canvasContainer);
      DOM_EL.captureOverlay.id("video-overlay");
      // if(APP_STATE.mobileDevice == false){
      //   DOM_EL.captureOverlay.style("transform", "translate(-50%, -50%)");
      // }
      DOM_EL.captureChange = createImg("img/change.png");
      DOM_EL.captureChange.parent(DOM_EL.captureOverlay);
      DOM_EL.captureChange.id("canvas-camera-change");
      DOM_EL.captureChange.mousePressed(switchCamera);
  
      DOM_EL.captureFlip = createImg("img/flip.png");
      DOM_EL.captureFlip.parent(DOM_EL.captureOverlay);
      DOM_EL.captureFlip.id("canvas-camera-flip");
      DOM_EL.captureFlip.mousePressed(function(){
          APP_STATE.cameraFlip = !APP_STATE.cameraFlip;
          DOM_EL.capture.toggleClass("flip");
      });
    DOM_EL.personaContainer = select("#persona-container");
      DOM_EL.personaAvatar = select("#persona-avatar");
      DOM_EL.personaTextContainer = select("#persona-text-container");
        DOM_EL.personaText = select("#persona-text");
        DOM_EL.personaButton = select("#persona-button");
        DOM_EL.personaButton.mousePressed(captureEvidenceEvent);
    DOM_EL.evidenceContainer = select("#evidence-container");
      DOM_EL.evidenceBox = select("#evidence-box");
      DOM_EL.evidenceHeader = select("#evidence-header");
      DOM_EL.evidenceSubheader = select("#evidence-subheader");
      DOM_EL.evidenceListContainer = select("#evidence-list-container");
      DOM_EL.evidenceList = select("#evidence-list");

      
  DOM_EL.captureContainer.hide();
  
  DOM_EL.contentContainer = select("#content-container");
    DOM_EL.contentClose = select("#content-close");
    DOM_EL.contentClose.mousePressed(contentCloseEvent);
    DOM_EL.contentTitleContainer = select("#content-title-container");
      DOM_EL.contentHeader = select("#content-header");
      DOM_EL.contentImageContainer = select("#content-image-container");
      DOM_EL.contentClass = select("#content-class");
    DOM_EL.contentBoxContainer = select("#content-box-container");
      DOM_EL.contentBox = select("#content-box");
        DOM_EL.content = select("#content");
      DOM_EL.contentSocialContainer = select("#content-social-container");
        DOM_EL.contentSocial = select("#content-social");
        DOM_EL.contentSocialChatbox = select("#content-social-chatbox");
        DOM_EL.contentSocialButton = select("#content-social-button");
        DOM_EL.contentSocialButton.mousePressed(addChatLog);
      DOM_EL.contentSocialContainer.hide();
      DOM_EL.contentInstruction = select("#content-instruction-container");
    DOM_EL.contentLensesContainer = select("#content-lenses-container");
      DOM_EL.carouselContainer = select("#lens-carousel");
  DOM_EL.contentContainer.hide();

  
  DOM_EL.completionContainer = select("#completion-container");
  DOM_EL.completionContainer.position(0,0);
    DOM_EL.completionHeader = select("#completion-header");
    DOM_EL.completionImageContainer = select("#completion-image-container");
    DOM_EL.completionContent = select("#completion-content");
    DOM_EL.completionButton = select("#completion-button");
    DOM_EL.completionButton.mousePressed(completeEvent);
  DOM_EL.completionContainer.hide();


  for(let i = 0; i < 3; i++){
    DOM_EL.carouselCell[i] = createDiv();
    DOM_EL.carouselCell[i].addClass("carousel-cell");
  
    DOM_EL.carouselCellEmoji[i] = createDiv("🕵️");
    twemoji.parse(DOM_EL.carouselCellEmoji[i].elt);
    DOM_EL.carouselCellEmoji[i].addClass("carousel-cell-emoji");
  
    DOM_EL.carouselCellTitle[i] = createDiv("lens_name");
    DOM_EL.carouselCellTitle[i].addClass("carousel-cell-title");
    
    DOM_EL.carouselCell[i].child(DOM_EL.carouselCellEmoji[i]);    
    DOM_EL.carouselCell[i].child(DOM_EL.carouselCellTitle[i]);    
    DOM_EL.carouselContainer.child(DOM_EL.carouselCell[i]);
  }

  DOM_EL.carouselCell[0].addClass("left");
  DOM_EL.carouselCell[1].addClass("center");
  DOM_EL.carouselCell[2].addClass("right");
  DOM_EL.carouselCellEmoji[0].addClass("left");
  DOM_EL.carouselCellEmoji[1].addClass("center");
  DOM_EL.carouselCellEmoji[2].addClass("right");
  DOM_EL.carouselCellTitle[0].addClass("left");
  DOM_EL.carouselCellTitle[1].addClass("center");
  DOM_EL.carouselCellTitle[2].addClass("right");

  let pinchZoom = new Hammer(DOM_EL.captureContainer.elt);
  pinchZoom.on('pinchend', function (e) {
    console.log("do nothing on zoom");
  });

  let carouselSwipe = new Hammer(DOM_EL.contentContainer.elt);
  carouselSwipe.on('swiperight swipeleft', function(ev) {
    APP_STATE.carouselFlag = !APP_STATE.carouselFlag;
    if(ev.type == 'swipeleft'){
      APP_STATE.swipeCounter++;
      APP_STATE.lensCounter++;

      let prevL = overflow( APP_STATE.swipeCounter - 1, 3 );
      let prevC = overflow( APP_STATE.swipeCounter, 3 );
      let prevR = overflow( APP_STATE.swipeCounter + 1, 3 );

      let lensL = overflow(  APP_STATE.lensCounter - 1, APP_STATE.numLens );
      let lensC = overflow(  APP_STATE.lensCounter, APP_STATE.numLens );
      let lensR = overflow(  APP_STATE.lensCounter + 1, APP_STATE.numLens );

      DOM_EL.carouselCell[prevC].removeClass('center');
      DOM_EL.carouselCell[prevC].addClass('left');
      DOM_EL.carouselCellEmoji[prevC].removeClass('center');
      DOM_EL.carouselCellEmoji[prevC].addClass('left');
      DOM_EL.carouselCellTitle[prevC].removeClass('center');
      DOM_EL.carouselCellTitle[prevC].addClass('left');
      DOM_EL.carouselCellTitle[prevC].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensL]].name); //APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensL]].name
      // DOM_EL.carouselCellEmoji[prevC].html(APP_STATE.data[lensL].lens_emoji);        
      DOM_EL.carouselCellEmoji[prevC].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensL]].emoji,{  //APP_STATE.data[objectID].content[lensID].emoji
        folder: 'svg',
        ext: '.svg'
      }));

      DOM_EL.carouselCell[prevR].removeClass('right');
      DOM_EL.carouselCell[prevR].addClass('center');
      DOM_EL.carouselCellEmoji[prevR].removeClass('right');
      DOM_EL.carouselCellEmoji[prevR].addClass('center');
      DOM_EL.carouselCellTitle[prevR].removeClass('right');
      DOM_EL.carouselCellTitle[prevR].addClass('center');
      DOM_EL.carouselCellTitle[prevR].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensC]].name);
      // DOM_EL.carouselCellEmoji[prevR].html(APP_STATE.data[lensC].lens_emoji);
      DOM_EL.carouselCellEmoji[prevR].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensC]].emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      DOM_EL.carouselCell[prevL].removeClass('left');
      DOM_EL.carouselCell[prevL].addClass('right');
      DOM_EL.carouselCellEmoji[prevL].removeClass('left');
      DOM_EL.carouselCellEmoji[prevL].addClass('right');
      DOM_EL.carouselCellTitle[prevL].removeClass('left');
      DOM_EL.carouselCellTitle[prevL].addClass('right');
      DOM_EL.carouselCellTitle[prevL].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensR]].name);
      // DOM_EL.carouselCellEmoji[prevL].html(APP_STATE.data[lensR].lens_emoji);
      DOM_EL.carouselCellEmoji[prevL].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensR]].emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      // if(APP_STATE.data[lensC].lens_display_name == "Other opinions"){
      //   DOM_EL.content.hide();
      //   DOM_EL.contentSocialContainer.show();
      // }
      // else{
      //   DOM_EL.content.show();
      //   DOM_EL.contentSocialContainer.hide();
      // }

      //set alt chatbox and divs to the right and start moving them
      //set main chatbox and divs to move to left
      DOM_EL.contentBoxContainer.addClass("fade");
      setTimeout(function(){
        changeContent(Object.keys(APP_STATE.lensName)[overflow(APP_STATE.lensCounter, APP_STATE.numLens)], getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html()));
        DOM_EL.contentBoxContainer.removeClass("fade");
      },300);
    }
    else if (ev.type == 'swiperight'){
      APP_STATE.swipeCounter--;
      APP_STATE.lensCounter--;

      let prevL = overflow( APP_STATE.swipeCounter + 1, 3 );
      let prevC = overflow( APP_STATE.swipeCounter + 2, 3 );
      let prevR = overflow( APP_STATE.swipeCounter + 3, 3 );

      let lensL = overflow(  APP_STATE.lensCounter - 1, APP_STATE.numLens );
      let lensC = overflow(  APP_STATE.lensCounter, APP_STATE.numLens );
      let lensR = overflow(  APP_STATE.lensCounter + 1, APP_STATE.numLens );
    
      DOM_EL.carouselCell[prevC].removeClass('center');
      DOM_EL.carouselCell[prevC].addClass('right');
      DOM_EL.carouselCellEmoji[prevC].removeClass('center');
      DOM_EL.carouselCellEmoji[prevC].addClass('right');
      DOM_EL.carouselCellTitle[prevC].removeClass('center');
      DOM_EL.carouselCellTitle[prevC].addClass('right');
      DOM_EL.carouselCellTitle[prevC].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensR]].name);
      // DOM_EL.carouselCellEmoji[prevC].html(APP_STATE.data[lensR].lens_emoji);
      DOM_EL.carouselCellEmoji[prevC].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensR]].emoji,{
        folder: 'svg',
        ext: '.svg'
      }));

      DOM_EL.carouselCell[prevL].removeClass('left');
      DOM_EL.carouselCell[prevL].addClass('center');
      DOM_EL.carouselCellEmoji[prevL].removeClass('left');
      DOM_EL.carouselCellEmoji[prevL].addClass('center');
      DOM_EL.carouselCellTitle[prevL].removeClass('left');
      DOM_EL.carouselCellTitle[prevL].addClass('center');
      DOM_EL.carouselCellTitle[prevL].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensC]].name);
      DOM_EL.carouselCellEmoji[prevL].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensC]].emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      DOM_EL.carouselCell[prevR].removeClass('right');
      DOM_EL.carouselCell[prevR].addClass('left');
      DOM_EL.carouselCellEmoji[prevR].removeClass('right');
      DOM_EL.carouselCellEmoji[prevR].addClass('left');
      DOM_EL.carouselCellTitle[prevR].removeClass('right');
      DOM_EL.carouselCellTitle[prevR].addClass('left');
      DOM_EL.carouselCellTitle[prevR].html(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensL]].name);
      DOM_EL.carouselCellEmoji[prevR].html(twemoji.parse(APP_STATE.data[getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html())].content[Object.keys(APP_STATE.lensName)[lensL]].emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      //set alt chatbox and divs to the left and start moving them
      //set main chatbox and divs to move to right
      DOM_EL.contentBoxContainer.addClass("fade");
      setTimeout(function(){
        changeContent(Object.keys(APP_STATE.lensName)[overflow(APP_STATE.lensCounter, APP_STATE.numLens)], getKeyByValue(APP_STATE.displayName, DOM_EL.contentClass.html()));
        DOM_EL.contentBoxContainer.removeClass("fade");
      },300);
    }
  });

  DOM_EL.loadingContainer = select("#loading-container");
  DOM_EL.loadingContainer.position(0,0);
  DOM_EL.loadingBarContainer = select("#loading-bar-container");
  DOM_EL.loadingBar = select("#loading-bar");
  DOM_EL.loadingHeader = select("#loading-header");
  DOM_EL.loadingContent = select("#loading-content");
  DOM_EL.loadingContainer.hide();

  DOM_EL.orientationContainer = select("#orientation-container");
  DOM_EL.orientationContainer.position(0,0);
  APP_STATE.DOMRegistered = true;
}


function completeEvent(){
  DOM_EL.completionContainer.hide();
}

function setup(){

  UTIL.quill = new Quill('#content', {
    modules: {
      toolbar: false
    },
    placeholder: 'Add/Choose a lens to start adding content!',
    theme: 'snow'  // or 'bubble'
  });

  UTIL.descriptionQuill = new Quill('#onboard-content', {
    modules: {
      toolbar: false
    },
    placeholder: 'No background has been given for this quiz',
    theme: 'snow'  // or 'bubble'
  });

  getAudioContext().suspend();
  setInterval(function(){
    MISC.thinking += ".";
    if(MISC.thinking == "...."){
      MISC.thinking = ".";
    }
    if(millis() - APP_STATE.promptTimer> 15000){
      APP_STATE.promptTimer = millis();
      APP_STATE.prompt = false;
      if(APP_STATE.evidenceCounter > 0 && APP_STATE.evidenceCounter < APP_STATE.numClasses){
        for(let i = 0; i < APP_STATE.evidenceCounter; i++){
          if(DOM_EL.evidenceListItemContainer[i].attribute("explored") == "false"){APP_STATE.prompt = true;}
        }
        if(APP_STATE.prompt == true){
          DOM_EL.evidenceBox.addClass("highlight");
          setTimeout(function(){
            DOM_EL.evidenceBox.removeClass("highlight");
          },300);
        }
      }
    }
    DOM_EL.contentInstruction.toggleClass("fade");
  },1000);
  registerDOM();
  checkOrientation();
  loadQuizManifest();
  imageMode(CENTER);
}


 function draw(){
  if(APP_STATE.cameraFlip){
    translate(DOM_EL.canvas.width, 0);
    scale(-1, 1);
  }

  if(DOM_EL.capture.width > DOM_EL.capture.height){
      image(DOM_EL.capture, width/2, height/2, DOM_EL.capture.width * height/DOM_EL.capture.height, height);
  }
  else{
      image(DOM_EL.capture, width/2, height/2, width, DOM_EL.capture.height * width/DOM_EL.capture.width);
  }  
}

// function switchCamera()
// {
//   APP_STATE.switchFlag = !APP_STATE.switchFlag;
//   if(APP_STATE.switchFlag==true)
//   {
//     DOM_EL.capture.remove();
//    options = {
//      video: {
//          facingMode: "environment" 
//      }
//    };

//   }
//   else{
//     DOM_EL.capture.remove();
//    options = {
//      video: {
//          facingMode: "user" 
//      }
//    };
//   }
//   DOM_EL.capture = createCapture(options);
//   DOM_EL.capture.id("video");
//   DOM_EL.capture.style("z-index","-1");
//   DOM_EL.capture.parent(DOM_EL.canvasContainer);
//   DOM_EL.captureChange.style("z-index","3");
//   DOM_EL.captureFlip.style("z-index","3");
// }

function switchCamera()
{
  APP_STATE.switchFlag = !APP_STATE.switchFlag;
  if(APP_STATE.switchFlag==true)
  {
    DOM_EL.capture.stop();
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "environment" 
     }
   };

  }
  else{
    DOM_EL.capture.stop();
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "user" 
     }
   };
  }
  DOM_EL.capture = createCapture(options, function(stream) {
    console.log(stream);
  });
  DOM_EL.capture.id("video");
  DOM_EL.capture.style("z-index","-1");
  DOM_EL.capture.parent(DOM_EL.canvasContainer);
  DOM_EL.cameraChange.style("z-index","3");
  DOM_EL.cameraFlip.style("z-index","3");
}

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


const overflow = function(i,ii){
  if (i < 0) {i = ((i%ii)+ii)%ii; }
  else if (i >0) { i = i%ii; }
  return i;
}

function windowResized(){
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
  if(vh > vw){
    document.documentElement.style.setProperty('--vmin', `${vw*2}px`);
    DOM_EL.orientationContainer.style("display", "none");
  }
  else{
    document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    DOM_EL.orientationContainer.style("display", "flex");
  }
}

function modifyHyperlinks(){
  var links = document.links;
  for (var i = 0; i < links.length; i++) {
      links[i].target = "_blank";
      console.log(links);
  }
}

async function init() {
  DOM_EL.loadingContainer.style("display","flex");

  setupModel();

  userStartAudio();


  // DOM_EL.carouselCellTitle[0].html(APP_STATE.data[0].lens_display_name);
  // DOM_EL.carouselCellTitle[1].html(APP_STATE.data[1].lens_display_name);
  // DOM_EL.carouselCellTitle[2].html(APP_STATE.data[2].lens_display_name);

  // DOM_EL.carouselCellEmoji[0].html(APP_STATE.data[0].lens_emoji);
  // DOM_EL.carouselCellEmoji[1].html(APP_STATE.data[1].lens_emoji);
  // DOM_EL.carouselCellEmoji[2].html(APP_STATE.data[2].lens_emoji);
  let n = Object.keys(APP_STATE.data)[0];
  APP_STATE.numLens = Object.keys(APP_STATE.data[n].content).length; 
  // console.log(APP_STATE.data);
}

function gotNumClasses(err,result){

  if(err){
    console.log(err)
    setTimeout(function(){
      classifier.classify( DOM_EL.canvas.elt, gotNumClasses);
    },100);
  }

  else{    
    APP_STATE.numClasses = result.length - 1;

    for(let i = 0; i < APP_STATE.numClasses; i++){
      DOM_EL.evidenceListItemContainer[i] = createDiv();
      DOM_EL.evidenceListItemContainer[i].attribute("index", (i+1).toString());
      DOM_EL.evidenceListItemContainer[i].attribute("id", Object.keys(APP_STATE.data)[i]);
      DOM_EL.evidenceListItemContainer[i].attribute("explored", "false");
      DOM_EL.evidenceListItemContainer[i].class("evidence-list-item-container");
      DOM_EL.evidenceListItemContainer[i].parent( DOM_EL.evidenceList);

      DOM_EL.evidenceListItem[i] = createElement("li");
      DOM_EL.evidenceListItem[i].addClass("evidence-list-item");
      DOM_EL.evidenceListItem[i].addClass("noimage");
      DOM_EL.evidenceListItem[i].parent( DOM_EL.evidenceListItemContainer[i]);

      DOM_EL.evidenceListItemTitle[i] = createP("???");
      DOM_EL.evidenceListItemTitle[i].class("evidence-list-item-title");
      DOM_EL.evidenceListItemTitle[i].parent(DOM_EL.evidenceListItemContainer[i]);

      DOM_EL.evidenceListItem[i].mousePressed(function(){
        if(DOM_EL.evidenceListItem[i].class().includes("noimage")){
          console.log("nothing captured yet");
        }
        else{
          SOUNDS.evidence.play();
          DOM_EL.contentHeader.html("Evidence " +  DOM_EL.evidenceListItemContainer[i].attribute("index"));
          DOM_EL.contentClass.html(DOM_EL.evidenceListItemTitle[i].html());

          changeContent(Object.keys(APP_STATE.lensName)[overflow(APP_STATE.lensCounter, APP_STATE.numLens)], getKeyByValue(APP_STATE.displayName, DOM_EL.evidenceListItemTitle[i].html()));
            
          let d = document.getElementById("content-image");
          d.src = DOM_EL.evidenceListItem[i].elt.childNodes[0].src;
          DOM_EL.contentContainer.style("display","flex");
          setTimeout(function(){
            DOM_EL.contentContainer.removeClass("fade");
          },0);

          if(DOM_EL.evidenceListItemContainer[i].attribute("explored") == "false"){
            DOM_EL.evidenceListItemContainer[i].attribute("explored","true");
            DOM_EL.evidenceListItemNudge[i].removeClass("h");
          }
        }
      });
    }
    DOM_EL.evidenceHeader.html("0/" + APP_STATE.numClasses + " Evidence Collected");
    console.log("Custom Model Loaded!");
  }
}

 async function setupModel() {

    DOM_EL.loadingContainer.hide();
    modifyHyperlinks();
  
}

function changeContent(lensID,objectID){
  let stuff = APP_STATE.data[objectID].content[lensID];
  console.log(stuff);
  if (stuff.operation === undefined) {
    UTIL.quill.setContents();
  } else {
    UTIL.quill.setContents(stuff.operation);
  }
}
 





