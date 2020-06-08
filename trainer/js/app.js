var DOM_EL = {
    
    video: null,
    loginContainer: null,
        loginDescriptor: null,
        loginButton: null,
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
        captureOverlay: null,
        cameraFlip: null,
        cameraChange: null,
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

    labelContainer: null,
        //run through number of labels add 
        labels: [],
        labelText: [],
        labelBarContainer: [],
        labelBar: [],

    saveButton: null,

    ////////////////////TRAIN MODE///////////////////////
    trainContainer: null,

    classSampleContainer: null,
        classSampleList: [],
        classSampleListLabel: [],
        classSampleListImage: [],
        classSampleListOverlay: [],
    
    trainButton: null,

    trainStatusContainer: null,
        trainStatusModel: null,
        trainStatusImage: null,
        trainStatusLoss: null,
        trainStatusCompleteButton: null,

    ////////////////////EMBED MODE///////////////////////
    embedContainer: null,
}

var UTIL = {
    recordIntervalFunction: null,
    zipModel: null,
    zipImage: null,
    proceedFlag: false,
    worker: null
}

var APP_STATE = {
    username: null,
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
    recording: null,
    cameraMirror: false,
    numTrainingClasses: 0,
    numTrainingImages: 0,
    numTrainingImagesProcessed: 0,
    loss: 0,
    modelTrained: false
}

let featureExtractor;
let classifier;

if(window.Worker){
    UTIL.worker = new Worker('/trainer/js/worker.js');
    UTIL.worker.postMessage({url: "https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"});
}

window.addEventListener('DOMContentLoaded', () => {
    APP_STATE.mobileDevice = isMobile();
  });

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    APP_STATE.username = profile.getEmail();
    DOM_EL.menuContainer.style("display", "inline-flex");
    DOM_EL.collectContainer.show();
    DOM_EL.loginContainer.hide();
    DOM_EL.loginButton.hide();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/trainer', true);
    xhr.onload = function () {
    };
    xhr.send("login:" + profile.getEmail());
    switchCamera();
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


function changeGatherEvent(){
    APP_STATE.mode = 0;
    DOM_EL.collectContainer.show();
    DOM_EL.trainContainer.hide();
    DOM_EL.embedContainer.hide();

    DOM_EL.classContainer.removeClass("fade");

    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");

    DOM_EL.canvasContainer.style("display", "flex");
    DOM_EL.imageSampleCounter.show();
    DOM_EL.imageSampleContainer.style("display", "inline-flex");
    DOM_EL.collectButtonContainer.style("display", "inline-flex");
    DOM_EL.labelContainer.hide();
    DOM_EL.saveButton.hide();
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
    
}

function changeTestEvent(){
    // APP_STATE.mode = 2;
    // DOM_EL.collectContainer.hide();
    // DOM_EL.trainContainer.hide();
    // DOM_EL.embedContainer.show();

    // DOM_EL.menuTrainButton.removeClass("selected");
    // DOM_EL.menuCollectButton.removeClass("selected");
    // DOM_EL.menuEmbedButton.class("selected");
    APP_STATE.mode = 0;

    // DOM_EL.menuContainer.hide();
    DOM_EL.classContainer.addClass("fade");

    DOM_EL.collectContainer.show();
    DOM_EL.trainContainer.hide();
    DOM_EL.embedContainer.hide();

    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuTrainButton.removeClass("selected");
    DOM_EL.menuEmbedButton.removeClass("selected");

    DOM_EL.imageSampleCounter.hide();
    DOM_EL.collectButtonContainer.hide();
    DOM_EL.imageSampleContainer.hide();

    DOM_EL.labelContainer.show();
    DOM_EL.saveButton.show();
}

function zipImages(){

    for (let i = 0; i< DOM_EL.classSampleList.length; i++){
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {
            console.log("CLASS : " + DOM_EL.classSampleListLabel[i].elt.textContent);
            let res = DOM_EL.classSampleListLabel[i].elt.textContent.replace(/ /g, "_");
            console.log(res);
            let f = UTIL.zipImage.folder(res);

            for(let j = 0; j<DOM_EL.imageSampleList[i].elt.childElementCount; j++){
                APP_STATE.trainingImage = false;
                // setTimeout(async function(){await featureExtractor.addImage(DOM_EL.imageSampleList[i].elt.children[j].children[0], DOM_EL.classSampleListLabel[i].elt.textContent, imageAdded);},(APP_STATE.numTrainingImagesProcessed*300));
                f.file("image_" + j.toString()+".png",DOM_EL.imageSampleList[i].elt.children[j].children[0].src.split(",")[1],{base64: true});
            }
        }
    }
    // UTIL.zipImage.file(`${modelName}.weights.bin`, data.weightData);
    // UTIL.zipImage.file(`${modelName}.json`,JSON.stringify(featureExtractor.weightsManifest));
    UTIL.zipImage.generateAsync({type:"blob"})
    .then(function (blob) {
        uploadBlobGoogle(blob,"assets.zip", 'application/zip');
        // downloadBlob(blob,"assets.zip");
        // uploadBlobXML(blob, `images.zip`, 'application/zip');
        // console.log("model uploaded!!");
    })
}

function classInputEvent(){
    APP_STATE.classInputString = DOM_EL.classInput.value();
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
    resetCounterHtml();

}

function recordButtonEvent(){
    
    let l = createDiv();
    l.class("sample-list");
    l.parent(DOM_EL.imageSampleList[APP_STATE.selectedClassNumber]);

    let c = document.getElementById('canvas');

    dataUrl = c.toDataURL(0.7);
    
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
            resetCounterHtml();
        },300);
    });

    let inner = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childNodes[0].childNodes[0].src;
    DOM_EL.classSampleListImage[APP_STATE.selectedClassNumber].elt.src = inner;


    resetCounterHtml();

}


function classAddEvent(){
    APP_STATE.addClass = true;

    DOM_EL.classSelect.hide();
    DOM_EL.classInput.show();
    DOM_EL.classInput.value("");

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();
    window.setTimeout(function () { 
        document.getElementById("class-input").focus();
        DOM_EL.canvasContainer.hide();
        DOM_EL.imageSampleCounter.html("type in name of new class");
        DOM_EL.collectButtonContainer.hide();
        DOM_EL.imageSampleContainer.hide();
    },10);
}
function classEditEvent(){
    APP_STATE.editClass = true;

    DOM_EL.classSelect.hide();

    DOM_EL.classInput.show();
    DOM_EL.classInput.value(APP_STATE.selectedClass);

    DOM_EL.classAdd.hide();
    DOM_EL.classEdit.hide();
    DOM_EL.classRemove.hide();

    DOM_EL.classSubmit.show();
    
    window.setTimeout(function () { 
        document.getElementById("class-input").focus();
        DOM_EL.canvasContainer.hide();
        DOM_EL.imageSampleCounter.html("edit name of class");
        DOM_EL.collectButtonContainer.hide();
        DOM_EL.imageSampleContainer.hide();
    },10);
}

function classRemoveEvent(){
// switch on classRemoveAlert
}

function resetCounterHtml(){
    let n = DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].elt.childElementCount;
    if(n == 1){
        DOM_EL.imageSampleCounter.html(n.toString() + " Sample Image");
    }
    else if(n > 1){
        DOM_EL.imageSampleCounter.html(n.toString() + " Sample Images");
    }
    else{
        DOM_EL.imageSampleCounter.html("Press or hold on record to add sample images");
    } 
}

function classSubmitEvent(){

    resetCounterHtml();

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
        DOM_EL.imageSampleList[APP_STATE.selectedClassNumber].class("image-sample-list");
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
        DOM_EL.classSampleListLabel[APP_STATE.selectedClassNumber].class("class-sample-list-label");
        DOM_EL.classSampleListLabel[APP_STATE.selectedClassNumber].parent( DOM_EL.classSampleList[APP_STATE.selectedClassNumber] );

        DOM_EL.classSampleListOverlay[APP_STATE.selectedClassNumber] = createDiv("✔️");
        DOM_EL.classSampleListOverlay[APP_STATE.selectedClassNumber].class("class-sample-list-overlay");
        DOM_EL.classSampleListOverlay[APP_STATE.selectedClassNumber].parent( DOM_EL.classSampleList[APP_STATE.selectedClassNumber] );
        DOM_EL.classSampleListOverlay[APP_STATE.selectedClassNumber].hide();

        let holdSelect = new Hammer(DOM_EL.classSampleList[APP_STATE.selectedClassNumber].elt);
        let chosen = APP_STATE.selectedClassNumber;
        holdSelect.on('press tap', function(ev) {
        
            if(ev.type == 'press'){
                if(DOM_EL.imageSampleList[chosen].elt.childElementCount > 0){
                    DOM_EL.classSampleListImage[chosen].addClass("class-selected");
                    DOM_EL.classSampleListOverlay[chosen].style("display", "flex");
                }
            }
            else if (ev.type == 'tap'){
                DOM_EL.classSampleListImage[chosen].removeClass("class-selected");
                DOM_EL.classSampleListOverlay[chosen].hide();
            }
        });

    }

    DOM_EL.classSubmit.hide();
    DOM_EL.classInput.hide();
    DOM_EL.classSelect.show();

    DOM_EL.classAdd.show();
    DOM_EL.classEdit.show();
    DOM_EL.classRemove.show();

    DOM_EL.canvasContainer.style("display", "flex");
    DOM_EL.imageSampleContainer.style("display", "inline-flex");
    DOM_EL.collectButtonContainer.style("display", "inline-flex");
    }

async function trainButtonEvent(){
     featureExtractor = ml5.featureExtractor('MobileNet',{numLabels: DOM_EL.classSampleList.length}, modelLoaded);
     DOM_EL.trainStatusContainer.show();
}

async function modelLoaded() {
    console.log('MobileNet Model Loaded!');
    await DOM_EL.trainStatusModel.html("✔️MobileNet model loaded");
    classifier = featureExtractor.classification();
    setTimeout(addImages,100);
  }

async function addImages(){
    APP_STATE.numTrainingClasses = 0;
    
    //getting number of classes and images
    for (let i = 0; i< DOM_EL.classSampleList.length; i++){
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {
            APP_STATE.numTrainingClasses++;
            for(let j = 0; j<DOM_EL.imageSampleList[i].elt.childElementCount; j++){
                APP_STATE.numTrainingImages++;
            }
        }
    }
    console.log( APP_STATE.numTrainingClasses + " classes to be trained, ");
    console.log( APP_STATE.numTrainingImages + " images to be trained");
    DOM_EL.labels = [];

    for (let i = 0; i< DOM_EL.classSampleList.length; i++){
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {
            console.log("CLASS : " + DOM_EL.classSampleListLabel[i].elt.textContent);


            DOM_EL.labels.push(createDiv());
            DOM_EL.labels[DOM_EL.labels.length - 1].addClass("label");
            DOM_EL.labels[DOM_EL.labels.length - 1].parent(DOM_EL.labelContainer);
    
            DOM_EL.labelText.push(createDiv(DOM_EL.classSampleListLabel[i].elt.textContent));
            DOM_EL.labelText[DOM_EL.labels.length - 1].addClass("label-text");
            DOM_EL.labelText[DOM_EL.labels.length - 1].parent(DOM_EL.labels[i]);
    
            DOM_EL.labelBarContainer.push(createDiv());
            DOM_EL.labelBarContainer[DOM_EL.labels.length - 1].addClass("label-bar-container");
            DOM_EL.labelBarContainer[DOM_EL.labels.length - 1].parent(DOM_EL.labels[i])
    
            DOM_EL.labelBar.push(createDiv());
            DOM_EL.labelBar[DOM_EL.labels.length - 1].addClass("label-progress");
            DOM_EL.labelBar[DOM_EL.labels.length - 1].parent( DOM_EL.labelBarContainer[i] );
            DOM_EL.labelBar[DOM_EL.labels.length - 1].style("background-color","#" + Math.floor(Math.random()*16777215).toString(16));

            for(let j = 0; j<DOM_EL.imageSampleList[i].elt.childElementCount; j++){
                APP_STATE.trainingImage = false;
                setTimeout(async function(){await featureExtractor.addImage(DOM_EL.imageSampleList[i].elt.children[j].children[0], DOM_EL.classSampleListLabel[i].elt.textContent, imageAdded);},(APP_STATE.numTrainingImagesProcessed*300));
            }
        }
    }
    
  }

async function imageAdded(){
    APP_STATE.numTrainingImagesProcessed++;
    await DOM_EL.trainStatusImage.html("⚙️ " + (APP_STATE.numTrainingImagesProcessed).toString() + "/" + (APP_STATE.numTrainingImages).toString() + " training images added");   
    console.log(DOM_EL.trainStatusImage.elt.innerHTML);
    //if all images added
    if(APP_STATE.numTrainingImagesProcessed == APP_STATE.numTrainingImages){
        console.log("✔️ All training images loaded");  
        DOM_EL.trainStatusImage.html("✔️ All training images loaded");   
         //start training
        setTimeout(function(){
            featureExtractor.train(function(lossValue) {
            if (lossValue) {
              APP_STATE.loss = lossValue;
              DOM_EL.trainStatusLoss.html("⚙️Training progress (loss):" + APP_STATE.loss);
              console.log(APP_STATE.loss);
            } else {
              console.log('Done Training! Final Loss: ' +  APP_STATE.loss);
              DOM_EL.trainStatusLoss.html('✔️Done Training! Final Loss: ' +  APP_STATE.loss);
              DOM_EL.trainStatusCompleteButton.show();
              APP_STATE.modelTrained = true;

              classifier.classify( DOM_EL.canvas.elt, gotResults);
              uploadModel(modelUploaded,"myModel"); 
            }
          });
        },100);
    }
}

async function uploadModel(callback, name) {
    if (!featureExtractor.jointModel) {
      console.log('No model found.');
    }
    featureExtractor.jointModel.save(tf.io.withSaveHandler(async (data) => {
      let modelName = 'model';
      if(name) modelName = name;
      featureExtractor.weightsManifest = {
        modelTopology: data.modelTopology,
        weightsManifest: [{
          paths: [`./${modelName}.weights.bin`],
          weights: data.weightSpecs,
        }],
        ml5Specs: {
          mapStringToIndex: featureExtractor.mapStringToIndex,
        },
      };

    // await featureExtractor.jointModel.save('https://cotf.cf/admin/trainer');
  

    UTIL.zipModel.file(`${modelName}.weights.bin`, data.weightData);
    UTIL.zipModel.file(`${modelName}.json`,JSON.stringify(featureExtractor.weightsManifest));
    UTIL.zipModel.generateAsync({type:"blob"})
    .then(function (blob) {
        // downloadBlob(blob);
        zipImages();
        uploadBlobXML(blob, `${modelName}.zip`, 'application/zip');
    });
    
      if (callback) {
        callback();
      }
    }));
  }

function modelUploaded(){
    // console.log("model uploaded!!");
}

function downloadBlob(blob,modelName){
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = modelName;
    link.click(); 
}

const uploadBlobXML = async (data, name,t) => {

    var fileOfBlob = new File([data], name);
    form = new FormData(),
    form.append("upload", fileOfBlob, name);
    form.append("profile", APP_STATE.username);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/trainer', true);
    xhr.onload = function () {
    };
    xhr.send(form);
  };

const uploadBlobGoogle = async (data, name,t) => {

    const formData = new FormData()
    formData.append('myFile', data)

    fetch('https://gds-esd.com/wtf/signedUrl', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: name })
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log('signedUrl: ', data);
          fetch(data.url, {
            method: 'PUT',
            headers: {
              'Content-Type': t
            },
            body: formData
          })
          .then(response => console.log(response))
          .then(data => {
            console.log(data)
          })
          .catch(error => {
            console.error(error)
          })
        })
    
};

 function setup(){
    UTIL.zipModel = new JSZip();
    UTIL.zipImage = new JSZip();

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginButton = select("#google-login");
    // DOM_EL.loginButton.attribute("data-width", (window.innerWidth * 0.8).toString());

    DOM_EL.menuContainer = select("#menu-container");
    DOM_EL.menuContainer.hide();

    DOM_EL.menuCollectButton = select("#menu-collect-button");
    DOM_EL.menuCollectButton.class("selected");
    DOM_EL.menuCollectButton.mousePressed(changeGatherEvent);

    DOM_EL.menuTrainButton = select("#menu-train-button");
    DOM_EL.menuTrainButton.mousePressed(changeTrainEvent);

    DOM_EL.menuEmbedButton = select("#menu-embed-button");
    DOM_EL.menuEmbedButton.mousePressed(changeEmbedEvent);

    DOM_EL.collectContainer = select("#collect-container");
    DOM_EL.collectContainer.hide();

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
   
    DOM_EL.canvas = createCanvas(112,112);
    DOM_EL.canvas.id("canvas");
    DOM_EL.canvas.parent(DOM_EL.canvasContainer);
    
    DOM_EL.capture = createCapture({
        video: {
            facingMode: "user"
        }});
    DOM_EL.capture.parent(DOM_EL.canvasContainer);
    DOM_EL.capture.id("video");

    DOM_EL.captureOverlay = createDiv();
    DOM_EL.captureOverlay.parent(DOM_EL.canvasContainer);
    DOM_EL.captureOverlay.id("video-overlay");

    DOM_EL.cameraChange = createImg("img/change.png");
    DOM_EL.cameraChange.parent(DOM_EL.captureOverlay);
    DOM_EL.cameraChange.id("canvas-camera-change");
    DOM_EL.cameraChange.mousePressed(switchCamera);

    DOM_EL.cameraFlip = createImg("img/flip.png");
    DOM_EL.cameraFlip.parent(DOM_EL.captureOverlay);
    DOM_EL.cameraFlip.id("canvas-camera-flip");
    DOM_EL.cameraFlip.mousePressed(function(){
        APP_STATE.cameraFlip = !APP_STATE.cameraFlip;
        DOM_EL.capture.toggleClass("flip");
    });


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
        UTIL.recordIntervalFunction = setInterval(recordButtonEvent,100);
    }
    else if (ev.type == 'tap'){recordButtonEvent();}
    });

    document.body.onmouseup = function() {
        clearInterval(UTIL.recordIntervalFunction);
    }

    document.body.ontouchend = function() {
        clearInterval(UTIL.recordIntervalFunction);
    }

    DOM_EL.labelContainer = select("#label-container");
    DOM_EL.labelContainer.hide();

    DOM_EL.saveButton = select("#save-button");
    DOM_EL.saveButton.hide();
    DOM_EL.saveButton.mousePressed(modelUploaded,"myModel");

    DOM_EL.trainContainer = select("#train-container");
    DOM_EL.trainContainer.hide();
    DOM_EL.classSampleContainer = select("#class-sample-container");
    
    DOM_EL.trainButton = select("#training-button");
    DOM_EL.trainButton.mousePressed(trainButtonEvent);


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
        DOM_EL.classSampleListLabel[i].class("class-sample-list-label");
        DOM_EL.classSampleListLabel[i].parent( DOM_EL.classSampleList[i] );

        DOM_EL.classSampleListOverlay[i] = createDiv("✔️");
        DOM_EL.classSampleListOverlay[i].class("class-sample-list-overlay");
        DOM_EL.classSampleListOverlay[i].parent( DOM_EL.classSampleList[i] );
        DOM_EL.classSampleListOverlay[i].hide();
        
        let holdSelect = new Hammer(DOM_EL.classSampleList[i].elt);
        holdSelect.on('press tap', function(ev) {
        
        if(ev.type == 'press'){
            if(DOM_EL.imageSampleList[i].elt.childElementCount > 0){
                DOM_EL.classSampleListImage[i].addClass("class-selected"); 
                DOM_EL.classSampleListOverlay[i].style("display", "flex");
            }
        }
        else if (ev.type == 'tap'){
            DOM_EL.classSampleListImage[i].removeClass("class-selected");
            DOM_EL.classSampleListOverlay[i].hide();
        }
        });
    }

    DOM_EL.trainStatusContainer = select("#train-status-container");
    DOM_EL.trainStatusContainer.hide();
    DOM_EL.trainStatusModel = select("#train-status-model");
    DOM_EL.trainStatusImage = select("#train-status-image");
    DOM_EL.trainStatusLoss = select("#train-status-loss");
    DOM_EL.trainStatusCompleteButton = select("#train-status-complete-button");
    DOM_EL.trainStatusCompleteButton.hide();
    DOM_EL.trainStatusCompleteButton.mousePressed(changeTestEvent);

    DOM_EL.embedContainer = select("#embed-container");
    DOM_EL.embedContainer.hide();
    imageMode(CENTER);
}

function gotResults(err, result) {

    if(result)
        {
            for(let i = 0; i<APP_STATE.numTrainingClasses; i++){ //loop through all classes
                for(let j = 0; j<APP_STATE.numTrainingClasses; j++){
                    if(DOM_EL.labelText[i].html() == result[j].label){
                        let length = (result[j].confidence * 100).toString() + "%";
                        DOM_EL.labelBar[i].elt.style.width = length;
                    }
                }
            }
        }
    classifier.classify( DOM_EL.canvas.elt, gotResults);
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

function windowResized(){
    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;
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
  DOM_EL.capture.id("video");
  DOM_EL.capture.parent(DOM_EL.canvasContainer);
  DOM_EL.cameraChange.style("z-index","6");
  DOM_EL.cameraFlip.style("z-index","6");
}


function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }


