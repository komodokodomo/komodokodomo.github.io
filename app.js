
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
  data: null,
  predictedClass: null,
  probability: null,

  promptTimer: 0,
  prompt: false,

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
  hardcoded: true,
  whitelist: ["fabric_on_handle", "fabric_in_hand", "footprint_1", "footprint_2", "head_trauma", "hammer", "screwdriver", "fingerprint_bedframe", "fingerprint_mug", "blood_drip_on_floor", "blood_on_wall", "blood_on_mat"],
}

var URLS = {
  proxy : "https://cors-anywhere.herokuapp.com/",
  model : "https://storage.googleapis.com/wtf-snap-models/ICN612526932717731840/model.json", 
  lens : "https://cotf.online/api/public/lenses/ICN612526932717731840",
  dict : "https://storage.googleapis.com/wtf-snap-models/ICN612526932717731840/dict.txt",
  content: "https://cotf.online/api/public/contents/ICN612526932717731840",
}

let model;
let dictionary;

var featureExtractor,classifier;


// function modelLoaded() {
//   console.log("Model Loaded!");
//   classifier = featureExtractor.classification();
//   classifier.load("model/myModel_1594629618667.json",customModelReady);
// }

// function customModelReady(){
//   console.log("Custom Model Loaded!");
//   classifier.classify( DOM_EL.canvas.elt, gotResults);
// }

// function gotResults(err, result) {
//   if(APP_STATE.numClassesObtained == false){
//     APP_STATE.numClassesObtained = true;
//     console.log(result);
//     console.log("number of classes: "+ result.length);
//     APP_STATE.numClasses = result.length - 1;
//     for(let i = 0; i < APP_STATE.numClasses; i++){
//       DOM_EL.evidenceListItemContainer[i] = createDiv();
//       DOM_EL.evidenceListItemContainer[i].attribute("index", (i+1).toString());
//       DOM_EL.evidenceListItemContainer[i].class("evidence-list-item-container");
//       DOM_EL.evidenceListItemContainer[i].parent( DOM_EL.evidenceList);
//       DOM_EL.evidenceListItemContainer[i].mousePressed(function(){
//         if(DOM_EL.evidenceListItemContainer[i].class == "noimage"){
//           console.log("nothing captured yet");
//         }
//         else{
//           DOM_EL.contentHeader.html("Evidence " +  DOM_EL.evidenceListItemContainer[i].attribute("index"));
//           DOM_EL.contentClass.html(DOM_EL.evidenceListItemTitle[i].html());
//           changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), DOM_EL.evidenceListItemTitle[i].html());
//           let d = document.getElementById("content-image");
//           d.src = DOM_EL.evidenceListItem[i].elt.childNodes[0].src;
//           DOM_EL.contentContainer.style("display","flex");
//           setTimeout(function(){
//             DOM_EL.contentContainer.removeClass("fade");
//           },0);
//         }
//       });

//       DOM_EL.evidenceListItem[i] = createElement("li");
//       DOM_EL.evidenceListItem[i].addClass("evidence-list-item");
//       DOM_EL.evidenceListItem[i].addClass("noimage");
//       DOM_EL.evidenceListItem[i].parent( DOM_EL.evidenceListItemContainer[i]);

//       DOM_EL.evidenceListItemTitle[i] = createP("???");
//       DOM_EL.evidenceListItemTitle[i].class("evidence-list-item-title");
//       DOM_EL.evidenceListItemTitle[i].parent(DOM_EL.evidenceListItemContainer[i]);
//     }

//     DOM_EL.evidenceHeader.html("0/" + APP_STATE.numClasses + " Evidence Collected");
//   }
//   if(result)
//       {
//         if(result[0].label !== "Irrelevant"){
//           if(result[0].confidence > 0.6 && result[0].confidence < 0.9 && APP_STATE.evidenceFound == false){
//             let s = "Hmmm" + MISC.thinking + "is it a " + result[0].label +" ?";
//             DOM_EL.personaText.html( MISC.thinking+ "is it a " + result[0].label +"?");
//             DOM_EL.personaButton.addClass("inactive");
//           }
//           else if(result[0].confidence > 0.6 && result[0].confidence < 0.9 && APP_STATE.evidenceFound){
//           }
//           else if(result[0].confidence > 0.9 && APP_STATE.evidenceFound == false){
//             APP_STATE.evidenceFound = true;
//             DOM_EL.personaText.html("I see a " + result[0].label +".");
//             APP_STATE.evidenceDetected = result[0].label;
//             DOM_EL.personaButton.removeClass("inactive");
//           }
//           else if(result[0].confidence > 0.9 && APP_STATE.evidenceFound){
//           }
//           else if(result[0].confidence < 0.6){
//             if(APP_STATE.evidenceFound){
//               APP_STATE.evidenceFound = false;
//             }
//             DOM_EL.personaText.html("Trying to figure this out" + MISC.thinking);
//             DOM_EL.personaButton.addClass("inactive");
//           }
//         }
//         else if(result[0].label == "Irrelevant"){
//           if(APP_STATE.evidenceFound){
//             APP_STATE.evidenceFound = false;
//           }
//           DOM_EL.personaText.html("Trying to figure this out" + MISC.thinking);
//           DOM_EL.personaButton.addClass("inactive");
//         }
//       }
//     if(err){
//       console.log(error);
//     }
//   setTimeout(function(){classifier.classify( DOM_EL.canvas.elt, gotResults);},20);
// }

window.addEventListener('DOMContentLoaded', () => {
  APP_STATE.mobileDevice = isMobile();
});

document.addEventListener("visibilitychange", () => {
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
  // predictAsync();
}
function login(){
  if(DOM_EL.loginInput.value() === "123456"){
    DOM_EL.loginContainer.hide();
    // DOM_EL.onboardContainer.style("display", "flex");
    DOM_EL.onboardContainer.show();
    // featureExtractor = ml5.featureExtractor("Mobilenet", modelLoaded);
    init();
  }
  else{
    DOM_EL.loginInput.removeClass("no-error");
    setTimeout(function(){
      DOM_EL.loginInput.addClass("no-error");
    },300);
  }
}

function openContent(){
  // DOM_EL.contentHeader.html("Evidence " + i);
  DOM_EL.contentContainer.style("display","flex");
  setTimeout(function(){
    DOM_EL.contentContainer.removeClass("fade");
  },0);
}

function contentCloseEvent(){
  DOM_EL.contentContainer.addClass("fade");
  setTimeout(function(){
    DOM_EL.contentContainer.hide();
  },300);
}

function captureEvidenceEvent(){
  if(DOM_EL.personaButton.class() !== "inactive"){

    DOM_EL.captureOverlay.addClass("snap");
    setTimeout(function(){
      DOM_EL.captureOverlay.removeClass("snap");
    },50);

    if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
      console.log("replacing image");
      for(let i = 0; i<DOM_EL.evidenceListItemTitle.length; i++){
        if(DOM_EL.evidenceListItemTitle[i].html().replace( / /g , "_" ) == APP_STATE.evidenceDetected){
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
  
      // if(MISC.hardcoded){
        let s = APP_STATE.evidenceDetected.replace( /_/g , " " );
        DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter].html(s);
      // }
      // else{
      //   DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter].html(APP_STATE.evidenceDetected);
      // }
      DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter].elt.scrollIntoView({behavior: 'smooth'});
      DOM_EL.evidenceListItem[APP_STATE.evidenceCounter].removeClass("noimage");
      DOM_EL.evidenceSubheader.html("Click on the captured evidence to see what can be done with it!");
      
      APP_STATE.evidencesFound[APP_STATE.evidenceCounter] = APP_STATE.evidenceDetected;
      APP_STATE.evidenceCounter++;

      DOM_EL.evidenceHeader.html(APP_STATE.evidenceCounter.toString()+ "/" + APP_STATE.numClasses + " Evidence Collected");

      if(APP_STATE.evidencesFound.length == APP_STATE.numClasses && APP_STATE.completed == false){
        APP_STATE.completed = true;
        DOM_EL.completionContainer.show();
      }
    }
    

  }
  
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


  let carouselSwipe = new Hammer(DOM_EL.carouselContainer.elt);
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

      console.log(APP_STATE.data[lensL].lens_display_name + ", " + APP_STATE.data[lensC].lens_display_name  + ", " + APP_STATE.data[lensR].lens_display_name);

      DOM_EL.carouselCell[prevC].removeClass('center');
      DOM_EL.carouselCell[prevC].addClass('left');
      DOM_EL.carouselCellEmoji[prevC].removeClass('center');
      DOM_EL.carouselCellEmoji[prevC].addClass('left');
      DOM_EL.carouselCellTitle[prevC].removeClass('center');
      DOM_EL.carouselCellTitle[prevC].addClass('left');
      DOM_EL.carouselCellTitle[prevC].html(APP_STATE.data[lensL].lens_display_name);
      DOM_EL.carouselCellEmoji[prevC].html(APP_STATE.data[lensL].lens_emoji);
      DOM_EL.carouselCellEmoji[prevC].html(twemoji.parse(APP_STATE.data[lensL].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      DOM_EL.carouselCell[prevR].removeClass('right');
      DOM_EL.carouselCell[prevR].addClass('center');
      DOM_EL.carouselCellEmoji[prevR].removeClass('right');
      DOM_EL.carouselCellEmoji[prevR].addClass('center');
      DOM_EL.carouselCellTitle[prevR].removeClass('right');
      DOM_EL.carouselCellTitle[prevR].addClass('center');
      DOM_EL.carouselCellTitle[prevR].html(APP_STATE.data[lensC].lens_display_name);
      DOM_EL.carouselCellEmoji[prevR].html(APP_STATE.data[lensC].lens_emoji);
      DOM_EL.carouselCellEmoji[prevR].html(twemoji.parse(APP_STATE.data[lensC].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      DOM_EL.carouselCell[prevL].removeClass('left');
      DOM_EL.carouselCell[prevL].addClass('right');
      DOM_EL.carouselCellEmoji[prevL].removeClass('left');
      DOM_EL.carouselCellEmoji[prevL].addClass('right');
      DOM_EL.carouselCellTitle[prevL].removeClass('left');
      DOM_EL.carouselCellTitle[prevL].addClass('right');
      DOM_EL.carouselCellTitle[prevL].html(APP_STATE.data[lensR].lens_display_name);
      // DOM_EL.carouselCellEmoji[prevL].html(APP_STATE.data[lensR].lens_emoji);
      DOM_EL.carouselCellEmoji[prevL].html(twemoji.parse(APP_STATE.data[lensR].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      if(APP_STATE.data[lensC].lens_display_name == "Other opinions"){
        DOM_EL.content.hide();
        DOM_EL.contentSocialContainer.show();
      }
      else{
        DOM_EL.content.show();
        DOM_EL.contentSocialContainer.hide();
      }

      //set alt chatbox and divs to the right and start moving them
      //set main chatbox and divs to move to left
      DOM_EL.contentBoxContainer.addClass("fade");
      setTimeout(function(){
        // if(MISC.hardcoded){
          let s = DOM_EL.contentClass.html().replace( / /g , "_" );
          changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), s);
        // }
        // else{
        //   changeContent(lensC, DOM_EL.contentClass.html());
        // }
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

      console.log(APP_STATE.data[lensL].lens_display_name + ", " + APP_STATE.data[lensC].lens_display_name  + ", " + APP_STATE.data[lensR].lens_display_name);
    
      DOM_EL.carouselCell[prevC].removeClass('center');
      DOM_EL.carouselCell[prevC].addClass('right');
      DOM_EL.carouselCellEmoji[prevC].removeClass('center');
      DOM_EL.carouselCellEmoji[prevC].addClass('right');
      DOM_EL.carouselCellTitle[prevC].removeClass('center');
      DOM_EL.carouselCellTitle[prevC].addClass('right');
      DOM_EL.carouselCellTitle[prevC].html(APP_STATE.data[lensR].lens_display_name);
      // DOM_EL.carouselCellEmoji[prevC].html(APP_STATE.data[lensR].lens_emoji);
      DOM_EL.carouselCellEmoji[prevC].html(twemoji.parse(APP_STATE.data[lensR].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));

      DOM_EL.carouselCell[prevL].removeClass('left');
      DOM_EL.carouselCell[prevL].addClass('center');
      DOM_EL.carouselCellEmoji[prevL].removeClass('left');
      DOM_EL.carouselCellEmoji[prevL].addClass('center');
      DOM_EL.carouselCellTitle[prevL].removeClass('left');
      DOM_EL.carouselCellTitle[prevL].addClass('center');
      DOM_EL.carouselCellTitle[prevL].html(APP_STATE.data[lensC].lens_display_name);
      // DOM_EL.carouselCellEmoji[prevL].html(APP_STATE.data[lensC].lens_emoji);
      DOM_EL.carouselCellEmoji[prevL].html(twemoji.parse(APP_STATE.data[lensC].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));


      DOM_EL.carouselCell[prevR].removeClass('right');
      DOM_EL.carouselCell[prevR].addClass('left');
      DOM_EL.carouselCellEmoji[prevR].removeClass('right');
      DOM_EL.carouselCellEmoji[prevR].addClass('left');
      DOM_EL.carouselCellTitle[prevR].removeClass('right');
      DOM_EL.carouselCellTitle[prevR].addClass('left');
      DOM_EL.carouselCellTitle[prevR].html(APP_STATE.data[lensL].lens_display_name);
      // DOM_EL.carouselCellEmoji[prevR].html(APP_STATE.data[lensL].lens_emoji);
      DOM_EL.carouselCellEmoji[prevR].html(twemoji.parse(APP_STATE.data[lensL].lens_emoji,{
        folder: 'svg',
        ext: '.svg'
      }));

      if(APP_STATE.data[lensC].lens_display_name == "Other opinions"){
        DOM_EL.content.hide();
        DOM_EL.contentSocialContainer.show();
      }
      else{
        DOM_EL.content.show();
        DOM_EL.contentSocialContainer.hide();
      }

      //set alt chatbox and divs to the left and start moving them
      //set main chatbox and divs to move to right
      DOM_EL.contentBoxContainer.addClass("fade");
      setTimeout(function(){
        // if(MISC.hardcoded){
          let s = DOM_EL.contentClass.html().replace( / /g , "_" );
          changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), s);
        // }
        // else{
        // changeContent(lensC, DOM_EL.contentClass.html());
        // }
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
}


function completeEvent(){
  DOM_EL.completionContainer.hide();
}

function setup(){

  setInterval(function(){
    MISC.thinking += ".";
    if(MISC.thinking == "...."){
      MISC.thinking = ".";
    }
    if(millis() - APP_STATE.promptTimer> 10000){
      APP_STATE.prompt = true;
      APP_STATE.promptTimer = millis();
      if(APP_STATE.evidenceCounter > 0 && APP_STATE.evidenceCounter < APP_STATE.numClasses){
        // prompt();
        console.log("prompt user to look at evidence");
        DOM_EL.evidenceBox.addClass("highlight");
        setTimeout(function(){
          DOM_EL.evidenceBox.removeClass("highlight");
          APP_STATE.prompt = false;
        },300);
      }
    }
  },1000);
  registerDOM();
  APP_STATE.DOMRegistered = true;
  checkOrientation();
  imageMode(CENTER);
}


 function draw(){
  if(APP_STATE.cameraFlip){
    translate(DOM_EL.canvas.width, 0);
    scale(-1, 1);
    // DOM_EL.canvas.style("z-index","-3");
  }

  if(DOM_EL.capture.width > DOM_EL.capture.height){
      image(DOM_EL.capture, width/2, height/2, DOM_EL.capture.width * height/DOM_EL.capture.height, height);
  }
  else{
      image(DOM_EL.capture, width/2, height/2, width, DOM_EL.capture.height * width/DOM_EL.capture.width);
  }  
}

function switchCamera()
{
  APP_STATE.switchFlag = !APP_STATE.switchFlag;
  if(APP_STATE.switchFlag==true)
  {
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "environment" 
     }
   };

  }
  else{
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "user" 
     }
   };
  }
  DOM_EL.capture = createCapture(options);
  DOM_EL.capture.id("video");
  DOM_EL.capture.parent(DOM_EL.canvasContainer);
  DOM_EL.captureChange.style("z-index","3");
  DOM_EL.captureFlip.style("z-index","3");
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


async function init() {
  setupModel();
  APP_STATE.data = await loadData();

  // if(MISC.hardcoded){
  //   let social = {lens: "other-opinions", lens_display_name: "Other opinions", lens_emoji: "💬" };
  //   APP_STATE.data.push(social);
  // }

  DOM_EL.carouselCellTitle[0].html(APP_STATE.data[0].lens_display_name);
  DOM_EL.carouselCellTitle[1].html(APP_STATE.data[1].lens_display_name);
  DOM_EL.carouselCellTitle[2].html(APP_STATE.data[2].lens_display_name);

  DOM_EL.carouselCellEmoji[0].html(APP_STATE.data[0].lens_emoji);
  DOM_EL.carouselCellEmoji[1].html(APP_STATE.data[1].lens_emoji);
  DOM_EL.carouselCellEmoji[2].html(APP_STATE.data[2].lens_emoji);
  APP_STATE.numLens = APP_STATE.data.length;
  console.log(APP_STATE.data);
}

 async function setupModel() {

    DOM_EL.loadingContainer.style("display","flex");
    model = await tf.loadGraphModel(URLS.model, { 'onProgress': updateModelDownloadProgress});
    DOM_EL.loadingContainer.hide();
    dictionary = await loadDictionary();
    predictAsync();
    console.log("autoML model loaded");
    console.log(dictionary);

    var links = document.links;
    for (var i = 0; i < links.length; i++) {
        links[i].target = "_blank";
        console.log(links);
    }

    if(MISC.hardcoded){
      APP_STATE.numClasses = MISC.whitelist.length;
    }
    else{
      APP_STATE.numClasses = dictionary.length;    
    }
    
    for(let i = 0; i < APP_STATE.numClasses; i++){
      DOM_EL.evidenceListItemContainer[i] = createDiv();
      DOM_EL.evidenceListItemContainer[i].attribute("index", (i+1).toString());
      // DOM_EL.evidenceListItemContainer[i].attribute("explored", "false");
      DOM_EL.evidenceListItemContainer[i].class("evidence-list-item-container");
      DOM_EL.evidenceListItemContainer[i].parent( DOM_EL.evidenceList);

      DOM_EL.evidenceListItem[i] = createElement("li");
      DOM_EL.evidenceListItem[i].addClass("evidence-list-item");
      DOM_EL.evidenceListItem[i].addClass("noimage");
      DOM_EL.evidenceListItem[i].parent( DOM_EL.evidenceListItemContainer[i]);

      // DOM_EL.evidenceListItemNudge[i] = createDiv(),
      // DOM_EL.evidenceListItemNudge[i].addClass("evidence-list-item-nudge");
      // DOM_EL.evidenceListItemNudge[i].addClass("h");
      // DOM_EL.evidenceListItemNudge[i].parent( DOM_EL.evidenceListItemContainer[i]);

      DOM_EL.evidenceListItemTitle[i] = createP("???");
      DOM_EL.evidenceListItemTitle[i].class("evidence-list-item-title");
      DOM_EL.evidenceListItemTitle[i].parent(DOM_EL.evidenceListItemContainer[i]);

      DOM_EL.evidenceListItemContainer[i].mousePressed(function(){
        if(DOM_EL.evidenceListItemContainer[i].class == "noimage"){
          console.log("nothing captured yet");
        }
        else{
          DOM_EL.contentHeader.html("Evidence " +  DOM_EL.evidenceListItemContainer[i].attribute("index"));
          DOM_EL.contentClass.html(DOM_EL.evidenceListItemTitle[i].html());
          // if(MISC.hardcoded){
            let s = DOM_EL.evidenceListItemTitle[i].html().replace( / /g , "_" );
            changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), s);
          // }
          // else{
          //   changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), DOM_EL.evidenceListItemTitle[i].html());
          // }
          let d = document.getElementById("content-image");
          d.src = DOM_EL.evidenceListItem[i].elt.childNodes[0].src;
          DOM_EL.contentContainer.style("display","flex");
          setTimeout(function(){
            DOM_EL.contentContainer.removeClass("fade");
          },0);

          // if(DOM_EL.evidenceListItemContainer[i].attribute("explored") == "false"){
          //   DOM_EL.evidenceListItemContainer[i].attribute("explored","true");
          //   DOM_EL.evidenceListItemNudge[i].removeClass("h");
          // }
        }
      });
    }

      DOM_EL.evidenceHeader.html("0/" + APP_STATE.numClasses + " Evidence Collected");

    const zeros = tf.zeros([1, 224, 224, 3]);
    // warm-up the model
    model.predict(zeros);
  
}


const loadData = async function() {
  return fetch(URLS.lens)
    .then(res => res.json())
    .then(body => {
      // populate lenses first
      let lenses = [];
      for (let i = 0; i < body.data.length; i++) {
        lenses.push({
          lens: body.data[i].lens,
          lens_display_name: body.data[i].lens_display_name,
          lens_emoji: body.data[i].lens_emoji
        })
      }
      // grab content
      return fetch(URLS.content)
        .then(res => res.json())
        .then(body => prepData(body.data, lenses))
    })
}

 async function predictAsync() {

  const scores = tf.tidy(() => {
    const imgAsTensor = tf.browser.fromPixels(DOM_EL.canvas.elt);
    const centerCroppedImg = centerCropAndResize(imgAsTensor);
    const processedImg = centerCroppedImg.div(127.5).sub(1);
    return model.predict(processedImg);
  })
  const probabilities = await scores.data();
  scores.dispose();
  const result = Array.from(probabilities)
                     .map((prob, i) => ({label: dictionary[i], prob}));

  // console.log(result);
  const prediction = result.reduce(function(prev, current) {
    return (prev.prob > current.prob) ? prev : current
  })

  APP_STATE.predictedClass = prediction.label;
  APP_STATE.probability = parseFloat(prediction.prob.toFixed(2));

  if(APP_STATE.prompt){
    DOM_EL.personaText.html( "I think we should look at the evidences collected for hints" );
  }
  else{
    if(MISC.hardcoded){
      if(MISC.whitelist.includes(APP_STATE.predictedClass)){
        if(APP_STATE.probability > 0.5 && APP_STATE.probability < 0.8 && APP_STATE.evidenceFound == false){
          let s = "Hmmm" + MISC.thinking + "is it a " + APP_STATE.predictedClass +" ?";
          DOM_EL.personaText.html( MISC.thinking+ "is it a " + APP_STATE.predictedClass +"?");
          DOM_EL.personaButton.addClass("inactive");
          DOM_EL.personaButton.html("📸 capture evidence");
        }
        else if(APP_STATE.probability > 0.5 && APP_STATE.probability < 0.8 && APP_STATE.evidenceFound){
        }
        else if(APP_STATE.probability > 0.8 && APP_STATE.evidenceFound == false){
          APP_STATE.evidenceFound = true;
          DOM_EL.personaText.html("I see a " + APP_STATE.predictedClass +".");
          APP_STATE.evidenceDetected = APP_STATE.predictedClass;
          DOM_EL.personaButton.removeClass("inactive");
          if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
            DOM_EL.personaButton.html("📸 recapture evidence");
          }
        }
        else if(APP_STATE.probability > 0.8 && APP_STATE.evidenceFound){
          if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
            DOM_EL.personaButton.html("📸 recapture evidence");
          }
        }
        else if(APP_STATE.probability < 0.5){
          if(APP_STATE.evidenceFound){
            APP_STATE.evidenceFound = false;
          }
          DOM_EL.personaText.html("Trying to figure this out" + MISC.thinking);
          DOM_EL.personaButton.addClass("inactive");
          DOM_EL.personaButton.html("📸 capture evidence");
        }
      }
      else{
        if(APP_STATE.evidenceFound){
          APP_STATE.evidenceFound = false;
        }
        if(APP_STATE.probability > 0.5){
          DOM_EL.personaText.html("I think we should look elsewhere" + MISC.thinking);
          DOM_EL.personaButton.addClass("inactive");
          DOM_EL.personaButton.html("📸 capture evidence");
        }
        else{
          DOM_EL.personaText.html("Trying to figure this out" + MISC.thinking);
          DOM_EL.personaButton.addClass("inactive");
          DOM_EL.personaButton.html("📸 capture evidence");
        }
      }
    }
    else{
      if(APP_STATE.probability > 0.5 && APP_STATE.probability < 0.8 && APP_STATE.evidenceFound == false){
        let s = "Hmmm" + MISC.thinking + "is it a " + APP_STATE.predictedClass +" ?";
        DOM_EL.personaText.html( MISC.thinking+ "is it a " + APP_STATE.predictedClass +"?");
        DOM_EL.personaButton.addClass("inactive");
        DOM_EL.personaButton.html("📸 capture evidence");
      }
      else if(APP_STATE.probability > 0.5 && APP_STATE.probability < 0.8 && APP_STATE.evidenceFound){
      }
      else if(APP_STATE.probability > 0.8 && APP_STATE.evidenceFound == false){
        APP_STATE.evidenceFound = true;
        DOM_EL.personaText.html("I see a " + APP_STATE.predictedClass +".");
        APP_STATE.evidenceDetected = APP_STATE.predictedClass;
        DOM_EL.personaButton.removeClass("inactive");
        if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
          DOM_EL.personaButton.html("📸 recapture evidence");
        }
        // else{
        //   DOM_EL.personaButton.html("📸 capture evidence");
        // }
      }
      else if(APP_STATE.probability > 0.8 && APP_STATE.evidenceFound){
        if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
          DOM_EL.personaButton.html("📸 recapture evidence");
        }
        // else{
        //   DOM_EL.personaButton.html("📸 capture evidence");
        // }
      }
      else if(APP_STATE.probability < 0.5){
        if(APP_STATE.evidenceFound){
          APP_STATE.evidenceFound = false;
        }
        DOM_EL.personaText.html("Trying to figure this out" + MISC.thinking);
        DOM_EL.personaButton.addClass("inactive");
        DOM_EL.personaButton.html("📸 capture evidence");
      }
    }
  }


  setTimeout(function(){
    predictAsync();
  },100);
}

async function loadDictionary(){
  const response = await tf.util.fetch(URLS.dict);
  const text = await response.text();
  return text.trim().split('\n');
}


const updateModelDownloadProgress = function(fraction) {
  console.log(`Downloading model... ${fraction.toFixed(2) * 100}%`);
  DOM_EL.loadingBar.style("width", fraction.toFixed(2) * 100 +"%");
  DOM_EL.loadingContent.html(Math.round(fraction * 100) +"% loaded");
}


const prepData = (data, lenses) => {
  for (let i = 0; i < data.length; i++) {
    let content = data[i].content;
    let index = lenses.findIndex(lens => lens.lens === data[i].lens);
    if (index !== -1) {
      if (typeof lenses[index][`${data[i].object}`] !== 'undefined' && lenses[index][`${data[i].object}`] instanceof Array) {
        lenses[index][`${data[i].object}`].push(content);
      } else {
        lenses[index][`${data[i].object}`] = [];
        lenses[index][`${data[i].object}`].push(content);
      }
    } else {
      let newLens = {
        lens: data[i].lens,
        lens_display_name: data[i].lens_display_name
      };
      newLens[`${data[i].object}`] = [];
      newLens[`${data[i].object}`].push(content);
      lenses.push(newLens);
    }
  }

  return lenses;
}

function centerCropAndResize(img) {
  return tf.tidy(() => {
    const [height, width] = img.shape.slice(0, 2);
    let top = 0;
    let left = 0;
    if (height > width) {
      top = (height - width) / 2;
    } else {
      left = (width - height) / 2;
    }
    const size = Math.min(width, height);
    const boxes = [
      [top / height, left / width, (top + size) / height, (left + size) / width]
    ];
    const boxIndices = [0];
    return tf.image.cropAndResize(
        img.toFloat().expandDims(), 
        boxes, 
        boxIndices, 
        [224, 224]
    );
  });
}


function changeContent(a,b){
  let stuff = APP_STATE.data[a][b];
  console.log(stuff);
  if (stuff === undefined) {
    DOM_EL.content.html("I don't have much to say about this for now");
  } else {
    let allContent = [];

    for (let i = 0; i < stuff.length; i++) {
      let isJson = false;
      let contents = stuff[i];
      try {
        contents = JSON.parse(contents);
        isJson = true;
      } catch {
        // Not JSON
      }

      if (isJson) {
        let arr = contents.map(node => serialiseJSONContent(node));
        let container = document.createElement("div");
        arr.forEach(item => container.appendChild(item));
        allContent.push(container);
      } else {
        let container = document.createElement("div");
        let el = document.createElement("span");
        let text = document.createTextNode(contents);
        el.appendChild(text);
        container.append(el);
        // if (contents.indexOf('{') > -1){
        //   let i = contents.match(/\{(.*)\}/i)[1];
        //   content = content.replace((contents.match( /\{(.*)\}/i)[0] ), "");
        //   if (i.length > 0) {
        //     content +=  "<img src=\"" + i + "\">";
        //   }
        // }
        allContent.push(container);
      }
      console.log(allContent);
    }
    DOM_EL.content.html("");
    allContent.forEach(node => DOM_EL.content.elt.appendChild(node));
}
}


const serialiseJSONContent = node => {
  let el, el2, children;
  switch (node.type) {
    case 'block-quote':
      el = document.createElement("blockquote");
      el2 = document.createElement("p");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el2.appendChild(child));
      el.appendChild(el2);
      return el;
    case 'heading-one':
      el = document.createElement("h1");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'heading-two':
      el = document.createElement("h2");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'list-item':
      el = document.createElement("li");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'numbered-list':
      el = document.createElement("ol");
      children = node.children.map(child => serialiseJSONContent(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'bulleted-list':
      el = document.createElement("ul");
      children = node.children.map(child => serialiseJSONContent(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'paragraph':
      el = document.createElement("p");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
    case 'link':
      el = document.createElement("a");
      el.href = node.url;
      el.target = '_blank';
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
    default:
      el = document.createElement("div");
      children = node.children.map(child => renderMark(child));
      children.forEach(child => el.appendChild(child));
      return el;
  }
}


const renderMark = child => {
  let el, children, text;
  switch (true) {
    case child.type === 'link':
      el = document.createElement("a");
      el.target = '_blank';
      el.href = child.url;
      children = child.children.map(innerChild => renderMark(innerChild));
      children.forEach(child => el.appendChild(child));
      return el;
    case child.bold:
      el = document.createElement("strong");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
    case child.italic:
      el = document.createElement("em");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
    case child.code:
      el = document.createElement("code");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
    case child.underline:
      el = document.createElement("u");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
    case child.strikethrough:
      el = document.createElement("s");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
    default:
      el = document.createElement("span");
      text = document.createTextNode(child.text);
      el.appendChild(text);
      return el;
  }
}
