var DOM_EL = {
    
    video: null,
    ////////////////////MENU///////////////////////
    menuContainer: null,
        menuCollectButton: null,
        menuTrainButton: null,
        menuEmbedButton: null,

    ////////////////////GATHER MODE///////////////////////
    collectContainer: null,

    classContainer: null,
        classSelect: null,
        classInput: null,
        classEdit: null,
        classAdd: null,
        classRemove: null,
        classSubmit: null,
    
    canvasContainer: null,
        capture: null,
        canvas: null,
        ctx: null,

    imageSampleContainer: null,
    imageSampleCounter: null,
        imageSampleList: [],

    collectButtonContainer: null,
        recordButton: null,
        uploadButton: null,
        settingButton: null,

    settingContainer: null,
        settingFps: null,
        settingFpsInput: null,
        settingSaveButton: null,

    ////////////////////TRAIN MODE///////////////////////
    trainContainer: null,

    ////////////////////EMBED MODE///////////////////////
    embedContainer: null,
}

var videoConstraints = {
    // video: { facingMode: { exact: "environment" } },
    video: true,
    audio: false
  };

var UTIL = {

}

var APP_STATE = {
    mode : 0,            // either COLLECT or TRAIN or EMBED
    class: 0,
    width: 0,
    height: 0,
    editClass: false,
    addClass: false,
    classInputString: "",
    selectedClass: "",
    selectedClassNumber: null,
    switchFlag: false
}

window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
  });

  const init = async function() {
    
    // DOM_EL.video = select("#canvas-camera");
    // DOM_EL.video.elt.srcObject = await setupCamera();

    DOM_EL.video = document.getElementById("canvas-camera");
    DOM_EL.video.srcObject = await setupCamera();

    
    DOM_EL.canvasContainer = select("#canvas-container");
    // DOM_EL.canvas = select("#canvas");
    // DOM_EL.ctx = DOM_EL.canvas.elt.getContext("2d", { alpha: false });

    DOM_EL.canvas = document.getElementById("canvas");
    DOM_EL.ctx = DOM_EL.canvas.getContext("2d", { alpha: false, desynchronized: false });
   
    DOM_EL.video.onloadeddata = e => {
        // DOM_EL.video.elt.play();
        //   DOM_EL.video.hide();
        DOM_EL.video.play();
        DOM_EL.video.style.display = "none";
        render();
    }
  }

const setupCamera = async function() {
    return navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" }, audio: false })
    .then(stream => stream)
    .catch(function(error) {
      alert("Oops. Something is broken.", error);
    });
  }

const render = function() {
    DOM_EL.ctx.drawImage(DOM_EL.video, 0, 0, DOM_EL.canvas.width, DOM_EL.canvas.width * DOM_EL.video.videoWidth/DOM_EL.video.videoHeight);
    window.requestAnimationFrame(render);
  }

function changeGatherEvent(){
    APP_STATE.mode = 0;
    DOM_EL.collectContainer.show();

    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeTrainEvent(){
    APP_STATE.mode = 1;
    DOM_EL.collectContainer.hide();
    DOM_EL.menuTrainButton.class("selected");
    DOM_EL.menuCollectButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeEmbedEvent(){
    APP_STATE.mode = 2;
    DOM_EL.collectContainer.hide();
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuCollectButton.removeClass("selected");
    DOM_EL.menuEmbedButton.class("selected");
}

function classInputEvent(){
    APP_STATE.classInputString = DOM_EL.classInput.value();
    console.log(APP_STATE.classInputString);
}

function selectEvent(){
    APP_STATE.selectedClass = DOM_EL.classSelect.value();
    console.log(APP_STATE.selectedClass);


    DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].hide();


    let x = document.getElementById("class-select").length;
    for(let i = 0; i < x; i++){  
        if(DOM_EL.classSelect.elt.options[i].text == APP_STATE.selectedClass){
            APP_STATE.selectedClassNumber = i;
            // DOM_EL.imageSampleContainer[i].show();   
            DOM_EL.imageSampleList[i].style("display", "inline-flex");              
        }
    }
    let n = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childElementCount;
    if(n > 0){
        DOM_EL.imageSampleCounter.html(n.toString() + " Sample Images");
    }
    else{
        DOM_EL.imageSampleCounter.html("Press or hold on record to add sample images");
    }

}

function recordButtonEvent(){
    
    let l = createDiv();
    l.class("sample-list");
    l.parent(DOM_EL.imageSampleList[APP_STATE.selectedClassNumber]);

    let c = document.getElementById('canvas');

    dataUrl = c.toDataURL();
    
    let i = createImg(dataUrl);
    i.class("sample-list-image");
    i.parent(l);

    let r = createDiv("X");
    r.class("sample-list-remove");

    r.hide();
    r.parent(l);

    l.mouseOver(function(){r.show();});
    l.mouseOut(function(){r.hide();});
    // r.parent(l);

    r.mousePressed(function(){
        l.class("removed"); 
        setTimeout(function(){
            l.remove();
            let n = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childElementCount;
            if(n > 0){
                DOM_EL.imageSampleCounter.html(n.toString() + " Sample Images");
            }
            else{
                DOM_EL.imageSampleCounter.html("Press or hold on record to add sample images");
            }
        },300);
    });


    let n = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childElementCount;
    if(n > 0){
        DOM_EL.imageSampleCounter.html(n.toString() + " Sample Images");
    }
    else{
        DOM_EL.imageSampleCounter.html("Press or hold on record to add sample images");
    }

}

function preload(){
}

function classAddEvent(){
    APP_STATE.addClass = true;
    console.log("time to add class");

    DOM_EL.classSelect.hide();

    DOM_EL.classInput.show();
    DOM_EL.classInput.value("");
    DOM_EL.classInput.elt.focus();

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();
}
function classEditEvent(){
    APP_STATE.editClass = true;
    console.log("time to edit class");

    DOM_EL.classSelect.hide();

    DOM_EL.classInput.show();
    DOM_EL.classInput.value(APP_STATE.selectedClass);
    DOM_EL.classInput.elt.focus();

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();
}
function classRemoveEvent(){
// switch on classRemoveAlert
}

function classSubmitEvent(){

    if(APP_STATE.editClass == true){
        APP_STATE.editClass = false;
        DOM_EL.classSelect.option(APP_STATE.selectedClass ,APP_STATE.classInputString);
        APP_STATE.selectedClass = APP_STATE.classInputString;
        DOM_EL.classInput.value("");
    }

    else if(APP_STATE.addClass == true){

        APP_STATE.addClass = false;
        // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber].hide();
        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].hide();


        let x = document.getElementById("class-select");
        let option = document.createElement("option");
        option.text = APP_STATE.classInputString;
        x.add(option);

        DOM_EL.classSelect.selected(APP_STATE.classInputString);
        APP_STATE.selectedClass = APP_STATE.classInputString;
        APP_STATE.selectedClassNumber = x.length - 1;
        DOM_EL.classInput.value("");

        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber] = createElement("ol");
        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].id("image-sample-list");
        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].parent(DOM_EL.imageSampleContainer);

        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].style("display", "inline-flex");
        
        let n = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childElementCount;
        if(n > 0){
            DOM_EL.imageSampleCounter.html(n.toString() + " Sample Images");
        }
        else{
            DOM_EL.imageSampleCounter.html("Press or hold on record to add sample images");
        }
    }

    DOM_EL.classSubmit.hide();
    DOM_EL.classInput.hide();
    DOM_EL.classSelect.show();

    DOM_EL.classAdd.show();
    DOM_EL.classEdit.show();
    DOM_EL.classRemove.show();
    }

 function setup(){

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    DOM_EL.menuContainer = select("#menu-container");

    DOM_EL.menuCollectButton = select("#menu-collect-button");
    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuCollectButton.mousePressed(changeGatherEvent);

    DOM_EL.menuTrainButton = select("#menu-train-button");
    DOM_EL.menuTrainButton.mousePressed(changeTrainEvent);

    DOM_EL.menuEmbedButton = select("#menu-embed-button");
    DOM_EL.menuEmbedButton.mousePressed(changeEmbedEvent);

    DOM_EL.collectContainer = select("#collect-container");

    DOM_EL.classContainer = select("#class-container");

    DOM_EL.classSelect = select("#class-select");
    DOM_EL.classSelect.selected('class2');
    APP_STATE.selectedClass = "class2";
    DOM_EL.classSelect.changed(selectEvent);
    DOM_EL.classInput = select("#class-input");
    DOM_EL.classInput.input(classInputEvent);
    DOM_EL.classInput.hide();
    DOM_EL.classSubmit = select("#class-submit-button");
    DOM_EL.classSubmit.mousePressed(classSubmitEvent);
    DOM_EL.classSubmit.hide();
    DOM_EL.classEdit = select("#class-edit-button");
    DOM_EL.classEdit.mousePressed(classEditEvent);
    DOM_EL.classAdd = select("#class-add-button");
    DOM_EL.classAdd.mousePressed(classAddEvent);
    DOM_EL.classRemove = select("#class-remove-button");
    DOM_EL.classRemove.mousePressed(classRemoveEvent);

    DOM_EL.canvasContainer = select("#canvas-container");
   
    let cLength = constrain(APP_STATE.width * 0.85, 0 , APP_STATE.height * 0.6 * 0.85);
    DOM_EL.canvas = createCanvas(cLength,cLength);
    DOM_EL.canvas.id("canvas");
    DOM_EL.canvas.mousePressed(switchCamera);
    DOM_EL.canvas.parent(DOM_EL.canvasContainer);
    
    DOM_EL.capture = createCapture({
        video: {
            facingMode: "user"
        }});
    DOM_EL.capture.parent(DOM_EL.canvasContainer);
    DOM_EL.capture.hide();


    DOM_EL.imageSampleCounter = select("#image-sample-counter");
    DOM_EL.imageSampleContainer = select("#image-sample-container");

    let x = document.getElementById("class-select").length;
    for(let i = 0; i < x; i++){

        DOM_EL.imageSampleList[i] = createElement("ol");
        DOM_EL.imageSampleList[i].class("image-sample-list");
        DOM_EL.imageSampleList[i].parent(DOM_EL.imageSampleContainer);

        if(DOM_EL.classSelect.elt.options[i].text != APP_STATE.selectedClass){
            DOM_EL.imageSampleList[i].hide();
        }
        else{
            APP_STATE.selectedClassNumber = i;
        }
    }

    DOM_EL.collectButtonContainer = select("#collect-button-container");

    DOM_EL.settingButton = select("#setting-button");

    DOM_EL.recordButton = select("#record-button");

    DOM_EL.recordButton.mousePressed(recordButtonEvent);

    DOM_EL.uploadButton = select("#upload-button");

    // init();

    imageMode(CENTER);
}

function draw(){
image(DOM_EL.capture,width/2,height/2);
}

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
}

function switchCamera()
{
  APP_STATE.switchFlag = !APP_STATE.switchFlag;
//   stopCapture();
  if(APP_STATE.switchFlag==true)
  {
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "environment"
     }
   };

  }
  else
  {
    DOM_EL.capture.remove();
   options = {
     video: {
         facingMode: "user"
     }
   };
  }
  DOM_EL.capture = createCapture(options);
}


function stopCapture() {
    let stream = DOM_EL.capture.elt.srcObject;
    let tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    DOM_EL.capture.elt.srcObject = null;
  }