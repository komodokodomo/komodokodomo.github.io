var DOM_EL = {
    
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

var UTIL = {

}

var APP_STATE = {
    mode : 0,            // either COLLECT or TRAIN or EMBED
    class: 0
}

function changeGatherEvent(){
    APP_STATE.mode = 0;
    collectContainer.show();

    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeTrainEvent(){
    APP_STATE.mode = 1;
    collectContainer.hide();
    DOM_EL.menuTrainButton.class("selected");
    DOM_EL.menuCollectButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeEmbedEvent(){
    APP_STATE.mode = 2;
    collectContainer.hide();
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuCollectButton.removeClass("selected");
    DOM_EL.menuEmbedButton.class("selected");
}

function classInputEvent(){
    console.log('you are typing: ', this.value());
}

function selectEvent(){
    let item = DOM_EL.classSelect.value();
}

function preload(){

}

function classAddEvent(){
    DOM_EL.classInput.show();
    // switch on classInput
    // set focus to classInput
}
function classEditEvent(){
    DOM_EL.classInput.show();
    // switch on classInput
    // change classInput value to current className
    // set focus to classInput
}
function classRemoveEvent(){
// switch on classRemoveAlert
}

function setup(){

    DOM_EL.menuContainer = createDiv();
    DOM_EL.menuContainer.id("menu-container");
    DOM_EL.menuContainer.position( 0, 0 );
    DOM_EL.menuContainer.size( window.innerWidth, window.innerHeight / 10 );

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
    DOM_EL.collectContainer.position( 0, window.innerHeight / 10 );
    DOM_EL.collectContainer.size( window.innerWidth, window.innerHeight * 9 / 10 );

    DOM_EL.classContainer = createDiv();
    DOM_EL.classContainer.parent(DOM_EL.collectContainer);

    DOM_EL.classSelect = createSelect();
    DOM_EL.classSelect.parent(DOM_EL.classContainer);
    // DOM_EL.classSelect.option("");
    DOM_EL.classSelect.changed(selectEvent);

    DOM_EL.classInput = createInput();
    DOM_EL.classInput.input(classInputEvent);

    DOM_EL.classEdit = createButton("edit");
    DOM_EL.classEdit.mousePressed(classEditEvent);
    DOM_EL.classEdit.parent(DOM_EL.classContainer);

    DOM_EL.classAdd = createButton("+");
    DOM_EL.classAdd.mousePressed(classAddEvent);
    DOM_EL.classAdd.parent(DOM_EL.classContainer);

    DOM_EL.classRemove = createButton("x");
    DOM_EL.classRemove.mousePressed(classRemoveEvent);
    DOM_EL.classRemove.parent(DOM_EL.classContainer);

    DOM_EL.canvas = createCanvas();
    DOM_EL.canvas.parent(DOM_EL.collectContainer);

    DOM_EL.imageSampleContainer = createDiv();
    DOM_EL.imageSampleContainer.parent(DOM_EL.collectContainer);

    DOM_EL.imageSampleCounter = createDiv();
    DOM_EL.imageSampleCounter.parent(DOM_EL.imageSampleContainer);

    DOM_EL.imageSampleList = createElement("ol");
    DOM_EL.imageSampleList.parent(DOM_EL.imageSampleContainer);

    DOM_EL.collectButtonContainer = createDiv();
    DOM_EL.collectButtonContainer.parent(DOM_EL.collectContainer);

    DOM_EL.recordButton = createButton();
    DOM_EL.recordButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.settingButton = createButton();
    DOM_EL.settingButton.parent(DOM_EL.collectButtonContainer);

    DOM_EL.uploadButton = createButton();
    DOM_EL.uploadButton.parent(DOM_EL.collectButtonContainer);
}

function draw(){
   
}

function windowResized(){
}

