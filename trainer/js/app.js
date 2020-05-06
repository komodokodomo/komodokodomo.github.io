// ADD CLASS should result in new div being formed in train tab too
// Mousehold on any class in train tab would result in train button becoming active.


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

    classSampleContainer: null,
        classSampleList: [],
        classSampleListLabel: [],
        classSampleListImage: [],
        // classSampleListSelect: null,
    
    trainButton: null,

    ////////////////////EMBED MODE///////////////////////
    embedContainer: null,
}

var videoConstraints = {
    video: true,
    audio: false
  };

var UTIL = {
recordIntervalFunction: null
}

var APP_STATE = {
    mobileDevice: null,
    mode : 0,           
    class: 0,
    width: 0,
    height: 0,
    editClass: false,
    addClass: false,
    numClasses: 0,
    classInputString: "",
    selectedClass: "",
    selectedClassNumber: null,
    switchFlag: false,
    recording: null
}

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const classifier = featureExtractor.classification();

// When the model is loaded
function modelLoaded() {
  console.log('MobileNet Model Loaded!');
}

window.addEventListener('DOMContentLoaded', () => {
    APP_STATE.mobileDevice = isMobile();
    console.log(APP_STATE.mobileDevice);
  });


function changeGatherEvent(){
    APP_STATE.mode = 0;
    DOM_EL.collectContainer.show();
    DOM_EL.trainContainer.hide();
    DOM_EL.embedContainer.hide();

    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeTrainEvent(){
    APP_STATE.mode = 1;
    DOM_EL.collectContainer.hide();
    DOM_EL.trainContainer.show();
    DOM_EL.embedContainer.hide();

    DOM_EL.menuTrainButton.class("selected");
    DOM_EL.menuCollectButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");
}

function changeEmbedEvent(){
    APP_STATE.mode = 2;
    DOM_EL.collectContainer.hide();
    DOM_EL.trainContainer.hide();
    DOM_EL.embedContainer.show();

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

    let inner = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childNodes[0].childNodes[0].src;
    DOM_EL.classSampleListImage[APP_STATE.selectedClassNumber].elt.src = inner;


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

    if(APP_STATE.editClass == true  && APP_STATE.classInputString.length > 0){
        APP_STATE.editClass = false;
        DOM_EL.classSelect.option(APP_STATE.selectedClass ,APP_STATE.classInputString);
        APP_STATE.selectedClass = APP_STATE.classInputString;
        DOM_EL.classSampleListLabel[APP_STATE.selectedClassNumber].html(APP_STATE.selectedClass);
        DOM_EL.classInput.value("");
    }

    else if(APP_STATE.addClass == true && APP_STATE.classInputString.length > 0){

        APP_STATE.addClass = false;
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

        DOM_EL.classSampleList[APP_STATE.selectedClassNumber] = createElement("li");
        DOM_EL.classSampleList[APP_STATE.selectedClassNumber].class("sample-list-image");
        DOM_EL.classSampleList[APP_STATE.selectedClassNumber].style("padding-right" , "1rem");
        DOM_EL.classSampleList[APP_STATE.selectedClassNumber].style("padding-bottom" , "2rem");

        DOM_EL.classSampleList[APP_STATE.selectedClassNumber].parent(DOM_EL.classSampleContainer);
    
        DOM_EL.classSampleListImage[APP_STATE.selectedClassNumber] = createImg("img/imageless.png");
        DOM_EL.classSampleListImage[APP_STATE.selectedClassNumber].class("sample-list-image");
        DOM_EL.classSampleListImage[APP_STATE.selectedClassNumber].parent(DOM_EL.classSampleList[APP_STATE.selectedClassNumber]);
    
        DOM_EL.classSampleListLabel[APP_STATE.selectedClassNumber] = createDiv(DOM_EL.classSelect.elt.options[APP_STATE.selectedClassNumber].text);
        DOM_EL.classSampleListLabel[APP_STATE.selectedClassNumber].parent( DOM_EL.classSampleList[APP_STATE.selectedClassNumber] );

        let holdSelect = new Hammer(DOM_EL.classSampleList[APP_STATE.selectedClassNumber].elt);
        holdSelect.on('press tap', function(ev) {
        
        if(ev.type == 'press'){
            DOM_EL.classSampleList[APP_STATE.selectedClassNumber].class("class-selected");
        }
        else if (ev.type == 'tap'){
            DOM_EL.classSampleList[APP_STATE.selectedClassNumber].removeClass("class-selected");
        }
        });

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
    DOM_EL.classSelect.selected('example class 1');
    APP_STATE.selectedClass = "example class 1";
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
    DOM_EL.canvas.parent(DOM_EL.canvasContainer);
    
    DOM_EL.capture = createCapture({
        video: {
            facingMode: "user"
        }});
    DOM_EL.capture.parent(DOM_EL.canvasContainer);
    DOM_EL.capture.hide();

    DOM_EL.cameraFlip = createDiv("↶");
    DOM_EL.cameraFlip.parent(DOM_EL.canvasContainer);
    DOM_EL.cameraFlip.position(DOM_EL.canvas.position().x + 10, DOM_EL.canvas.position().y + 5);
    DOM_EL.cameraFlip.id("canvas-camera-flip");
    DOM_EL.cameraFlip.mousePressed(switchCamera);


    DOM_EL.imageSampleCounter = select("#image-sample-counter");
    DOM_EL.imageSampleContainer = select("#image-sample-container");

    APP_STATE.numClasses = document.getElementById("class-select").length;
    for(let i = 0; i < APP_STATE.numClasses; i++){

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
    DOM_EL.uploadButton = select("#upload-button");

    var recordTime = new Hammer(DOM_EL.recordButton.elt);
    recordTime.on('press pressup tap', function(ev) {
    
    if(ev.type == 'press'){
        APP_STATE.recording = true;
        UTIL.recordIntervalFunction = setInterval(recordButtonEvent,300);
    }
    // else if (ev.type == 'pressup'){clearInterval(UTIL.recordIntervalFunction);}
    else if (ev.type == 'tap'){recordButtonEvent();}
    });

    document.body.onmouseup = function() {
        console.log("MOUSE UP");
        clearInterval(UTIL.recordIntervalFunction);
    }

    DOM_EL.trainContainer = select("#train-container");
    DOM_EL.trainContainer.hide();
    DOM_EL.classSampleContainer = select("#class-sample-container");
    DOM_EL.trainButton = select("#training-button");


    for(let i = 0; i < APP_STATE.numClasses; i++){

        DOM_EL.classSampleList[i] = createElement("li");
        DOM_EL.classSampleList[i].class("sample-list-image");
        DOM_EL.classSampleList[i].style("padding-right" , "1rem");
        DOM_EL.classSampleList[i].style("padding-bottom" , "2rem");
        DOM_EL.classSampleList[i].parent(DOM_EL.classSampleContainer);

        DOM_EL.classSampleListImage[i] = createImg("img/imageless.png");
        DOM_EL.classSampleListImage[i].class("sample-list-image");
        DOM_EL.classSampleListImage[i].parent(DOM_EL.classSampleList[i]);

        DOM_EL.classSampleListLabel[i] = createDiv(DOM_EL.classSelect.elt.options[i].text);
        DOM_EL.classSampleListLabel[i].parent( DOM_EL.classSampleList[i] );
        
        let holdSelect = new Hammer(DOM_EL.classSampleList[i].elt);
        holdSelect.on('press tap', function(ev) {
        
        if(ev.type == 'press'){
            DOM_EL.classSampleList[i].class("class-selected");
        }
        else if (ev.type == 'tap'){
            DOM_EL.classSampleList[i].removeClass("class-selected");
        }
        });
    }

    DOM_EL.embedContainer = select("#embed-container");
    DOM_EL.embedContainer.hide();
    imageMode(CENTER);
}

function draw(){
    if(DOM_EL.capture.width > DOM_EL.capture.height){
        image(DOM_EL.capture, width/2, height/2, DOM_EL.capture.width * height/DOM_EL.capture.height, height);
    }
    else{
        image(DOM_EL.capture, width/2, height/2, width, DOM_EL.capture.height * width/DOM_EL.capture.width);
    }
}

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    let cLength = constrain(APP_STATE.width * 0.85, 0 , APP_STATE.height * 0.6 * 0.85);
    DOM_EL.canvas.size(cLength,cLength);

    DOM_EL.cameraFlip.position(DOM_EL.canvas.position().x + 10, DOM_EL.canvas.position().y + 5);

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
  DOM_EL.capture.hide();
}


function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
