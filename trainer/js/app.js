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

    imageSampleContainer: null,
        imageSampleCounter: null,
        imageSampleList: null,
        //captured image will be listed here
        //captured image will have child element to allow removal

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
    selectedClass: ""
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
    APP_STATE.classInputString = this.value();
    console.log(APP_STATE.classInputString);
}

function selectEvent(){
    APP_STATE.selectedClass = DOM_EL.classSelect.value();
}

function preload(){

}

function classAddEvent(){
    APP_STATE.addClass = true;

    DOM_EL.classSelect.hide();
    DOM_EL.classInput.show();

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();

    // switch on classInput
    // set focus to classInput
}
function classEditEvent(){
    APP_STATE.editClass = true;
    DOM_EL.classInput.value = APP_STATE.selectedClass;

    DOM_EL.classSelect.hide();
    DOM_EL.classInput.show();

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();
    // switch on classInput
    // change classInput value to current className
    // set focus to classInput
}
function classRemoveEvent(){
// switch on classRemoveAlert
}

function classSubmitEvent(){
    DOM_EL.classSubmit.hide();
    DOM_EL.classInput.hide();
    DOM_EL.classSelect.show();

    DOM_EL.classAdd.show();
    DOM_EL.classEdit.show();
    DOM_EL.classRemove.show();

    if(APP_STATE.editClass = true){
        APP_STATE.editClass = false;
        DOM_EL.classSelect.option(APP_STATE.classInputString);
    }

    if(APP_STATE.addClass = true){
        DOM_EL.classInput.value = "";
        APP_STATE.addClass = false;
        let x = document.getElementById("class-select");
        let option = document.createElement("option");
        option.text = APP_STATE.classInputString;
        // x.add(option);
    }
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
    DOM_EL.classSelect.changed(selectEvent);

    DOM_EL.classInput = createInput();
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

    DOM_EL.canvas = createCanvas();
    DOM_EL.canvas.parent(DOM_EL.canvasContainer);

    DOM_EL.imageSampleContainer = createDiv();
    DOM_EL.imageSampleContainer.id("image-sample-container");
    DOM_EL.imageSampleContainer.parent(DOM_EL.collectContainer);

    DOM_EL.imageSampleCounter = createDiv("number of images");
    DOM_EL.imageSampleCounter.id("image-sample-counter");
    DOM_EL.imageSampleCounter.parent(DOM_EL.imageSampleContainer);

    DOM_EL.imageSampleList = createElement("ol");
    DOM_EL.imageSampleList.id("image-sample-list");
    DOM_EL.imageSampleList.parent(DOM_EL.imageSampleContainer);

    DOM_EL.collectButtonContainer = createDiv();
    DOM_EL.collectButtonContainer.id("collect-button-container");
    DOM_EL.collectButtonContainer.parent(DOM_EL.collectContainer);

    DOM_EL.settingButton = createButton("settings");
    DOM_EL.settingButton.id("setting-button");
    DOM_EL.settingButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.recordButton = createButton("record");
    DOM_EL.recordButton.id("record-button");
    DOM_EL.recordButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.uploadButton = createButton("upload");
    DOM_EL.uploadButton.id("upload-button");
    DOM_EL.uploadButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.video = createCapture(videoConstraints);
    DOM_EL.video.size(1280, 720);
    DOM_EL.video.hide();
}

function draw(){

   
}

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
}

