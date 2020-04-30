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
        canvas: null,

    // imageSampleContainer: [],
    //     imageSampleCounter: [],
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
    video: { facingMode: { exact: "environment" } },
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
    selectedClassNumber: null
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


    // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber].hide();
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
    let l = createElement("li");
    let r = createDiv("X");
    r.style("position", "absolute");
    r.style("padding", "3px");
    r.style("font-size", "3rem");
    r.style("color", "white");
    r.hide();
    r.parent(l);

    let c = document.getElementById('p5Canvas');

    l.mouseOver(function(){r.show();});
    l.mouseOut(function(){r.hide();});
    l.style("padding-right", "3px");
    l.style("border-radius", "5px");
    // l.style("display", "flex");
    // l.style("justify-content", "center");
    // l.style("align-items", "center");

    r.mousePressed(function(){
        l.class("removed"); 
        setTimeout(function(){
            l.remove();
        },300);
    });
    
    dataUrl = c.toDataURL();
    imageFoo = createImg(dataUrl);

    // Style your image here
    imageFoo.elt.style.width = '100px';
    imageFoo.elt.style.height = '100px';

    imageFoo.parent(l);
    // After you are done styling it, append it to the BODY element
    l.parent(DOM_EL.imageSampleList[APP_STATE.selectedClassNumber]);

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

        // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber] = createDiv();
        // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber].class("image-sample-container");
        // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber].parent(DOM_EL.collectContainer);
    
        // DOM_EL.imageSampleCounter[APP_STATE.selectedClassNumber] = createDiv("number of images");
        // DOM_EL.imageSampleCounter[APP_STATE.selectedClassNumber].class("image-sample-counter");
        // DOM_EL.imageSampleCounter[APP_STATE.selectedClassNumber].parent(DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber]);

        // DOM_EL.imageSampleList[APP_STATE.selectedClassNumber] = createElement("ol");
        // DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].class("image-sample-list");
        // DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].parent(DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber]);

        // DOM_EL.imageSampleContainer[APP_STATE.selectedClassNumber].show();

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
    // switch on classRemoveAlert
    }

function setup(){

    DOM_EL.menuContainer = createDiv();
    DOM_EL.menuContainer.id("menu-container");

    DOM_EL.menuCollectButton = createButton("GATHER");
    DOM_EL.menuCollectButton.id("menu-collect-button");
    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuCollectButton.parent(DOM_EL.menuContainer);
    DOM_EL.menuCollectButton.mousePressed(changeGatherEvent);

    DOM_EL.menuTrainButton = createButton("TRAIN");
    DOM_EL.menuTrainButton.id("menu-train-button");
    DOM_EL.menuTrainButton.parent(DOM_EL.menuContainer);
    DOM_EL.menuTrainButton.mousePressed(changeTrainEvent);

    DOM_EL.menuEmbedButton = createButton("EMBED");
    DOM_EL.menuEmbedButton.id("menu-embed-button");
    DOM_EL.menuEmbedButton.parent(DOM_EL.menuContainer);
    DOM_EL.menuEmbedButton.mousePressed(changeEmbedEvent);

    
    DOM_EL.collectContainer = createDiv();
    DOM_EL.collectContainer.id("collect-container");

    DOM_EL.classContainer = createDiv();
    DOM_EL.classContainer.id("class-container");
    DOM_EL.classContainer.parent(DOM_EL.collectContainer);

    DOM_EL.classSelect = createSelect();
    DOM_EL.classSelect.id("class-select");
    DOM_EL.classSelect.parent(DOM_EL.classContainer);
    DOM_EL.classSelect.option('opt1');
    DOM_EL.classSelect.option('opt2');
    DOM_EL.classSelect.option('opt3');
    DOM_EL.classSelect.selected('opt2');
    APP_STATE.selectedClass = "opt2";
    DOM_EL.classSelect.changed(selectEvent);

    DOM_EL.classInput = createInput("");
    DOM_EL.classInput.id("class-input");
    DOM_EL.classInput.parent(DOM_EL.classContainer);
    DOM_EL.classInput.input(classInputEvent);
    DOM_EL.classInput.hide();

    DOM_EL.classSubmit = createButton("save");
    DOM_EL.classSubmit.id("class-submit-button");
    DOM_EL.classSubmit.mousePressed(classSubmitEvent);
    DOM_EL.classSubmit.parent(DOM_EL.classContainer);
    DOM_EL.classSubmit.hide();

    DOM_EL.classEdit = createButton("edit");
    DOM_EL.classEdit.id("class-edit-button");
    DOM_EL.classEdit.mousePressed(classEditEvent);
    DOM_EL.classEdit.parent(DOM_EL.classContainer);

    DOM_EL.classAdd = createButton("+");
    DOM_EL.classAdd.id("class-add-button");
    DOM_EL.classAdd.mousePressed(classAddEvent);
    DOM_EL.classAdd.parent(DOM_EL.classContainer);

    DOM_EL.classRemove = createButton("x");
    DOM_EL.classRemove.id("class-remove-button");
    DOM_EL.classRemove.mousePressed(classRemoveEvent);
    DOM_EL.classRemove.parent(DOM_EL.classContainer);

    DOM_EL.canvasContainer = createDiv();
    DOM_EL.canvasContainer.id("canvas-container");
    DOM_EL.canvasContainer.parent(DOM_EL.collectContainer);

    DOM_EL.canvas = createCanvas(window.innerHeight*5/10, window.innerHeight*5/10);
    DOM_EL.canvas.id("p5Canvas");
    DOM_EL.canvas.parent(DOM_EL.canvasContainer);

    DOM_EL.imageSampleCounter = createDiv("Press or hold on record to add sample images");
    DOM_EL.imageSampleCounter.id("image-sample-counter");
    DOM_EL.imageSampleCounter.parent(DOM_EL.collectContainer);

    DOM_EL.imageSampleContainer = createDiv();
    DOM_EL.imageSampleContainer.id("image-sample-container");
    DOM_EL.imageSampleContainer.parent(DOM_EL.collectContainer);

    // DOM_EL.imageSampleCounter.parent(DOM_EL.imageSampleContainer);
    let x = document.getElementById("class-select").length;
    for(let i = 0; i < x; i++){

        // DOM_EL.imageSampleContainer[i] = createDiv();
        // DOM_EL.imageSampleContainer[i].class("image-sample-container");
        // DOM_EL.imageSampleContainer[i].parent(DOM_EL.collectContainer);
    
        // DOM_EL.imageSampleCounter[i] = createDiv("number of images");
        // DOM_EL.imageSampleCounter[i].class("image-sample-counter");
        // DOM_EL.imageSampleCounter[i].parent(DOM_EL.imageSampleContainer[i]);

        // DOM_EL.imageSampleList[i] = createElement("ol");
        // DOM_EL.imageSampleList[i].class("image-sample-list");
        // DOM_EL.imageSampleList[i].parent(DOM_EL.imageSampleContainer[i]);

        DOM_EL.imageSampleList[i] = createElement("ol");
        DOM_EL.imageSampleList[i].class("image-sample-list");
        DOM_EL.imageSampleList[i].parent(DOM_EL.imageSampleContainer);

        console.log(DOM_EL.classSelect.elt.options[i].text);

        if(DOM_EL.classSelect.elt.options[i].text != APP_STATE.selectedClass){
            // DOM_EL.imageSampleContainer[i].hide();
            DOM_EL.imageSampleList[i].hide();
        }
        else{
            APP_STATE.selectedClassNumber = i;
        }
    }

    DOM_EL.collectButtonContainer = createDiv();
    DOM_EL.collectButtonContainer.id("collect-button-container");
    DOM_EL.collectButtonContainer.parent(DOM_EL.collectContainer);

    DOM_EL.settingButton = createButton("settings");
    DOM_EL.settingButton.id("setting-button");
    DOM_EL.settingButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.recordButton = createButton("record");
    DOM_EL.recordButton.id("record-button");
    DOM_EL.recordButton.parent(DOM_EL.collectButtonContainer);
    DOM_EL.recordButton.mousePressed(recordButtonEvent);

    DOM_EL.uploadButton = createButton("upload");
    DOM_EL.uploadButton.id("upload-button");
    DOM_EL.uploadButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.video = createCapture(videoConstraints);
    DOM_EL.video.hide();

    imageMode(CENTER);
}

function draw(){
    clear();
    image(DOM_EL.video,width/2,height/2);
}

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
}
