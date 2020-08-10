class cContainer {
    constructor(title, details, thumbnail) {
        this.numImages = details || 0;
        this.container = createDiv();
            this.titleContainer = createDiv();
                this.thumbnail = createImg(thumbnail,title);
                this.input = createInput();
                this.title = createDiv(title);
                this.edit = createDiv("🖊️");
            this.details = createDiv(this.numImages + " images");
            this.record = createDiv("📷");
            this.remove = createDiv("🗑️");
    }
    init() {
        this.titleContainer.parent(this.container);
        this.thumbnail.parent(this.titleContainer);
        this.title.parent(this.titleContainer);

        this.input.hide();
        this.input.elt.addEventListener("blur", this.titleEdited.bind(this));
        this.input.parent(this.titleContainer);

        this.edit.parent(this.titleContainer);       
        this.edit.mousePressed(this.editTitle.bind(this));

        this.details.parent(this.container);
        this.record.parent(this.container);
        this.record.mousePressed(this.triggerCollectContainer.bind(this));
        this.remove.parent(this.container);
        this.remove.mousePressed(this.triggerRemoveClassAlert.bind(this));
    }

    changeTitle(title){
        this.title.html(title);
    }

    editTitle(){
        console.log("function to edit title of " + this.title.html());
        this.title.hide();
        this.input.value(this.title.html()); 
        this.input.show(); 
        setTimeout(function(){this.input.elt.focus();}.bind(this),0);
    }
    titleEdited(){
        this.title.show();
        this.input.hide(); 
        //send command to rename folder in server
        
        let n = Date.now();
        let d = new Date();
        let s = d.toLocaleDateString();
        let l = d.toLocaleTimeString();
        console.log("time to edit a project");

        let u = "?account=" + APP_STATE.username;
        let c = "&edit=" + this.uuid;
        let name = "&name=" + this.title.html();
    
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/edit_project' + u + c + name, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
            var data = this.response;
            }
            else if(this.status == 404) {
            console.log("no files detected, new account maybe?");
            }
        };
        xhr.send("add project");
    }
    triggerRemoveClassAlert(){
        console.log("function to remove title of " + this.title.html());
    }
    triggerCollectContainer(){
        console.log("function open popup to take image samples");
    }
  }

  class pContainer {
    constructor(uuid,title, details) {
        this.container = createDiv();
            this.titleContainer = createDiv();
                this.inputBox = createInput();
                this.title = createDiv(title);
                this.edit = createDiv("🖊️");
            this.details = createDiv(details);
            this.remove = createDiv("🗑️");
            this.uuid = uuid;
    }
    init() {
        this.container.addClass("project-container");
        this.titleContainer.addClass("project-title-container");
        this.details.addClass("project-detail");
        this.titleContainer.parent(this.container);
        this.titleContainer.mousePressed(this.enterProject.bind(this));
        this.title.parent(this.titleContainer);
        this.inputBox.parent(this.titleContainer);
        this.edit.parent(this.titleContainer);
        this.details.parent(this.container);
        this.remove.parent(this.container);
        this.inputBox.hide();
        this.inputBox.elt.addEventListener("blur",this.titleEdited.bind(this));
        this.inputBox.input(this.projectInputEvent.bind(this));
        this.edit.mousePressed(this.editTitle.bind(this));
        this.remove.mousePressed(this.triggerRemoveClassAlert.bind(this));
    }
    changeTitle(title){
        this.title.html(title);
    }
    projectInputEvent(){
        console.log(this.inputBox.elt.value);
        this.title.html(this.inputBox.elt.value);
    }
    editTitle(){
        console.log("function to edit title of " + this.title.html());
        this.title.hide();
        this.inputBox.value(this.title.html()); 
        this.inputBox.show(); 
        setTimeout(function(){this.inputBox.elt.focus();}.bind(this),0);
    }
    titleEdited(){
        let d = new Date();
        let s = d.toLocaleDateString();
        let l = d.toLocaleTimeString();

        this.title.show();
        this.inputBox.hide(); 
        this.details.html("last modified: " + s + " " + l);
    
        let u = "?account=" + APP_STATE.username;
        let c = "&rename=" + this.uuid;
        let name = "&name=" + this.title.html();
        console.log(name);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/edit_project' + u + c + name, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
              var data = this.response;
            }
            else if(this.status == 404) {
              console.log("no files detected, new account maybe?");
            }
          };
        xhr.send("rename project");
        //send command to rename folder in server
    }
    triggerRemoveClassAlert(){
        console.log("function to remove title of project " + this.uuid + ", " + this.title.html() );
        let u = "?account=" + APP_STATE.username;
        let c = "&delete=" + this.uuid;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/edit_project' + u + c, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
              var data = this.response;
            }
            else if(this.status == 404) {
              console.log("no files detected, new account maybe?");
            }
          };
        xhr.send("delete project");
        DOM_EL.projectContainer[this.uuid].container.remove();
        delete DOM_EL.projectContainer[this.uuid];
    }
    enterProject(){
        console.log("function to hide projectContainer, show classes container, load " + this.title.html() +" assets");
    }
  }

var DOM_EL = {
    
    ////////////////////GOOGLE LOGIN///////////////////////
    loginContainer: null,
        loginButton: null,
    ////////////////////MENU///////////////////////
    menuContainer: null,
        menuHamburger: null,
        menuTitle: null,
        menuProjectTitle: null,
        menuProfileImageContainer: null,
            menuProfileImage: null,

    ////////////////////PROJECT SELECTION MODE///////////////////////

    projectsContainer: null,
        projectContainer: [],   //new pContainer
        //DOM_EL.projectContainer 
        //     <div id="project-title"></div>
        //     <div id="project-title-edit"></div>
        //     <div id="project-detail"></div>
        //     <div id="project-remove"></div>
        addProjectContainer: null,
        //     <div id="add-project-title">New Project</div>

    ////////////////////CLASSES SELECTION MODE///////////////////////
    classesContainer: null,
        classContainer: [],
        addClassContainer: null,
        projectButtonContainer: null,
            saveButtonContainer: null,
                saveButtonHelp: null,
            trainButtonContainer: null,
                trainButtonHelp: null,
            predictButtonContainer: null,
                predictButtonHelp: null,
    
    ////////////////////POPUP MODE///////////////////////
    popupContainer: null,
        alertStatusContainer: null,
            alertStatusTitle: null,
            alertStatusContent: null,
        alertOkContainer: null,
            alertOkTitle: null,
            alertOkContent: null,
            alertOkButton: null,
        alertOptionContainer: null,
            alertOptionTitle: null,
            alertOptionContent: null,
            alertOptionYesButton: null,
            alertOptionNoButton: null,
        collectContainer: null,
            collectClassContainer: null,
                collectClassTitle: null,
                collectClassEdit: null,
                collectClassRemove: null,
            collectCloseContainer: null,
            collectImageContainer: null,
                imageSampleListContainer: null,
                imageSampleList: [],
                    // imageSampleContainer: null,
                    //     imageSample: null,
                    //     imageSampleRemove: null,
                collectImageContainer: null,
        collectButton: null,

        previewContainer: null,
            previewTitleContainer: null,
                previewTitle: null,
                previewProject: null,
            previewCloseContainer: null,
        labelContainer: null,
            labels: [],
            labelText: [],
            labelBarContainer: [],
            labelBar: [],


    canvasContainer: null,
        capture: null,
        captureOverlay: null,
        cameraFlip: null,
        cameraChange: null,
        canvas: null,

        imageSampleList: [],



    saveButton: null,

    ////////////////////TRAIN MODE///////////////////////
    trainContainer: null,

    classSampleContainer: null,
        classSampleList: [],
        classSampleListLabel: [],
        classSampleListImage: [],
        classSampleListOverlay: [],
    
}

var UTIL = {
    recordIntervalFunction: null,
    zipModel: null,
    zipImage: null,
    unzipImage: null,
}

var APP_STATE = {
    username: null,
    project: null,
    mobileDevice: null,
    width: 0,
    height: 0,
    numClasses: 0,
    classInputString: "",
    selectedClass: "",
    selectedClassNumber: null,
    switchFlag: false,
    recording: null,
    cameraMirror: false,

    numTrainingClasses: 0,      // 4
    numTrainingImagesSum: 0,    // 38
    numTrainingImagesProcessed: 0, //should eventually reach 38
    numTrainingImagesArray: [], // [20,10,5,3]

    trainingClassNumber: [],    // [0,1,2,4]
    currentArrayIndex: 0,       // could be 0,1,2,3
    currentImageNumberIndex: 0,   //currentImageNumberIndex[trainingClassNumber[i]]
    loss: 0,
    modelTrained: false
}

let featureExtractor;
let classifier;
let projectFiles;

if(window.Worker){
    console.log("web worker supported. Not active for now though.")
}

window.addEventListener('DOMContentLoaded', () => {
    APP_STATE.mobileDevice = isMobile();
});

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); 
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    APP_STATE.username = profile.getEmail();
   
    DOM_EL.loginContainer.hide();
    DOM_EL.loginButton.hide();
    DOM_EL.menuProfileImage = createImg(profile.getImageUrl());
    DOM_EL.menuProfileImage.id("menu-profile-image")
    DOM_EL.menuProfileImage.parent(DOM_EL.menuProfileImageContainer);

    loadProjectList();
}

function loadProjectList(){
    let u = "?account=" + APP_STATE.username;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/projectlist' + u, true);
    // xhr.responseType = "json";

    xhr.onload = function(e) {
        if (this.status == 200) {
          var data = this.response;
          console.log(data);
          DOM_EL.menuContainer.style("display","inline-flex");
          DOM_EL.projectsContainer.style("display","flex");
        }
        else if(this.status == 404) {
          console.log("no files detected, new account maybe?");
          DOM_EL.menuContainer.style("display","inline-flex");
          DOM_EL.projectsContainer.style("display","flex");
        }
      };
    xhr.send("load project list");
}

function loadProject(){
    let u = "?account=" + APP_STATE.username;
    let p = "&project=" + APP_STATE.project;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/model' + u + p, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function(e) {
        if (this.status == 200) {
          var data = this.response;

          UTIL.unzipImage.loadAsync(data,{createFolders: true})
            .then(function (zip) {
                console.log(zip.files);
                projectFiles = zip.files;
                for (const property in projectFiles) {
                    if(!projectFiles[property].dir){
                        console.log(`${property}: ${bufferToBase64(projectFiles[property]._data.compressedContent)}`);
                    }
                  }
            });
        }
        else if(this.status == 404) {
          console.log("no files detected, new account maybe?");
        }
      };
    xhr.send("load project assets");
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


function zipImages(){

    for (let i = 0; i< DOM_EL.classSampleList.length; i++){
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {
            console.log("CLASS : " + DOM_EL.classSampleListLabel[i].elt.textContent);
            let res = DOM_EL.classSampleListLabel[i].elt.textContent.replace(/ /g, "_");
            console.log(res);
            let f = UTIL.zipImage.folder(res);

            for(let j = 0; j<DOM_EL.imageSampleList[i].elt.childElementCount; j++){
                f.file("image_" + j.toString()+".png",DOM_EL.imageSampleList[i].elt.children[j].children[0].src.split(",")[1],{base64: true});
            }
        }
    }
    // UTIL.zipImage.file(`${modelName}.weights.bin`, data.weightData);
    // UTIL.zipImage.file(`${modelName}.json`,JSON.stringify(featureExtractor.weightsManifest));
    UTIL.zipImage.generateAsync({type:"blob"})
    .then(function (blob) {
        // uploadBlobGoogle(blob,"assets.zip", 'application/zip');
        // downloadBlob(blob,"assets.zip");
        uploadBlobXML(blob, `images.zip`, 'images');
    })
}


function recordButtonEvent(){
    
    let l = createDiv();
    l.class("sample-list");
    l.parent(DOM_EL.imageSampleList[APP_STATE.selectedClassNumber]);

    let c = document.getElementById('canvas');
    dataUrl = c.toDataURL(0.5);
    let i = createImg(dataUrl);
    i.class("sample-list-image");
    i.parent(l);

    let r = createDiv("🗑️");
    r.class("sample-list-remove");

    r.hide();
    r.parent(l);

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


function addProjectEvent(){
    let n = Date.now();
    let d = new Date();
    let s = d.toLocaleDateString();
    let l = d.toLocaleTimeString();
    console.log("time to add a project");
    DOM_EL.projectContainer[n] = new pContainer(n, "new project", "last modified: " + s + " " + l);
    DOM_EL.projectContainer[n].init();
    DOM_EL.projectContainer[n].container.parent(DOM_EL.projectsContainer);

    let u = "?account=" + APP_STATE.username;
    let c = "&create=" + n;
    let name = "&name=new project";
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/edit_project' + u + c + name, true);
    xhr.onload = function(e) {
        if (this.status == 200) {
          var data = this.response;
        }
        else if(this.status == 404) {
          console.log("no files detected, new account maybe?");
        }
      };
    xhr.send("add project");

}


function addClassEvent(){

}

function trainButtonEvent(){
    featureExtractor = null; //reset featureExtractor
    featureExtractor = ml5.featureExtractor('MobileNet',{numLabels: DOM_EL.classSampleList.length}, modelLoaded); 
}

function modelLoaded() {
    console.log('MobileNet Model Loaded!');
    DOM_EL.trainStatusModel.html("✔️Base model loaded");
    classifier = featureExtractor.classification();
    APP_STATE.modelTrained = false;
    setTimeout(addImages,100);
  }


async function addImages(){
    APP_STATE.numTrainingClasses = 0;
    APP_STATE.numTrainingImagesSum = 0;
    APP_STATE.numTrainingImagesProcessed = 0;
    
    //getting number of classes and images
    for (let i = 0; i< DOM_EL.classSampleList.length; i++){
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {
            APP_STATE.numTrainingClasses++;
            for(let j = 0; j<DOM_EL.imageSampleList[i].elt.childElementCount; j++){
                APP_STATE.numTrainingImagesSum++;
            }
        }
    }

    console.log(APP_STATE.trainingClassNumber);
    console.log(APP_STATE.numTrainingImagesArray);
    
    ml5.tf.setBackend("cpu");
    featureExtractor.addImage(DOM_EL.imageSampleList[APP_STATE.trainingClassNumber[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0], DOM_EL.classSampleListLabel[APP_STATE.trainingClassNumber[APP_STATE.currentArrayIndex]].elt.textContent, imageAdded);


    
  }

function createLabels(){
    console.log( APP_STATE.numTrainingClasses + " classes to be trained, ");
    console.log( APP_STATE.numTrainingImagesSum + " images to be trained");
    
    DOM_EL.labels = [];

    for (let i = 0; i< DOM_EL.classSampleList.length; i++){ //creating preview confidence bar
        if(DOM_EL.classSampleListImage[i].class().includes("class-selected")) {

            APP_STATE.trainingClassNumber.push(i);
            APP_STATE.numTrainingImagesArray.push(DOM_EL.imageSampleList[i].elt.childElementCount);

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

        }
    }
}
 
async function imageAdded(){
    APP_STATE.numTrainingImagesProcessed++;
    DOM_EL.trainStatusImage.html("⚙️ Base model fed " + (APP_STATE.numTrainingImagesProcessed).toString() + "/" + (APP_STATE.numTrainingImagesSum).toString() + " training images");   

    if(APP_STATE.numTrainingImagesProcessed == APP_STATE.numTrainingImagesSum){ //    if all images added
        console.log("✔️ All training images fed");  
        DOM_EL.trainStatusImage.html("✔️ All training images fed, time to train!");   
         //start training
        ml5.tf.setBackend("webgl");
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
            //   ml5.tf.setBackend("webgl");
              classifier.classify( DOM_EL.canvas.elt, gotResults);
              uploadModel(modelUploaded,"myModel_"+ Date.now().toString()); 
            }
          });
        },100);
    }
    else{
        APP_STATE.currentImageNumberIndex ++;
        if(APP_STATE.currentImageNumberIndex == APP_STATE.numTrainingImagesArray[APP_STATE.currentArrayIndex]){
            APP_STATE.currentArrayIndex ++;
            APP_STATE.currentImageNumberIndex = 0;
        }    
        console.log(ml5.tf.memory());
        setTimeout(function(){featureExtractor.addImage(DOM_EL.imageSampleList[APP_STATE.trainingClassNumber[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0], DOM_EL.classSampleListLabel[APP_STATE.trainingClassNumber[APP_STATE.currentArrayIndex]].elt.textContent, imageAdded);},50)
    }
}

async function uploadModel(callback, name) {
    if (!featureExtractor.jointModel) {
      console.log('No model found.');
    }
    featureExtractor.jointModel.save(ml5.tf.io.withSaveHandler(async (data) => {
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

    UTIL.zipModel.file(`${modelName}.weights.bin`, data.weightData);
    UTIL.zipModel.file(`${modelName}.json`,JSON.stringify(featureExtractor.weightsManifest));
    UTIL.zipModel.generateAsync({type:"blob"})
    .then(function (blob) {
        // downloadBlob(blob);
        zipImages();
        uploadBlobXML(blob, `${modelName}.zip`, 'model');
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
    form.append("type", t);
    form.append("profile", APP_STATE.username);
    form.append("project", APP_STATE.project);
    
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
    UTIL.unzipImage = new JSZip();

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginButton = select("#google-login");

    DOM_EL.menuContainer = select("#menu-container");
        DOM_EL.menuHamburger = select("#menu-hamburger");
        DOM_EL.menuTitle = select("#menu-title");
        DOM_EL.menuProjectTitle = select("#menu-project-title");
        DOM_EL.menuProfileImageContainer = select("#menu-profile-image-container");

    DOM_EL.projectsContainer = select("#projects-container");
        DOM_EL.addProjectContainer = select("#add-project-container");
        DOM_EL.addProjectContainer.mousePressed(addProjectEvent);
    DOM_EL.classesContainer = select("#classes-container");
    DOM_EL.popupContainer = select("#popup-container");

    DOM_EL.menuContainer.hide();
    DOM_EL.projectsContainer.hide();
    DOM_EL.classesContainer.hide();
    DOM_EL.popupContainer.hide();




    DOM_EL.canvasContainer = select("#canvas-container");
   
    DOM_EL.canvas = createCanvas(224/pixelDensity(),224/pixelDensity());
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
    if(APP_STATE.mobileDevice == false){DOM_EL.captureOverlay.style("transform", "translate(-50%, -50%)");}

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

    // var recordTime = new Hammer(DOM_EL.recordButton.elt);
    // recordTime.on('press pressup tap', function(ev) {
    
    // if(ev.type == 'press'){
    //     APP_STATE.recording = true;
    //     UTIL.recordIntervalFunction = setInterval(recordButtonEvent,100);
    // }
    // else if (ev.type == 'tap'){recordButtonEvent();}
    // });

    document.body.onmouseup = function() {
        clearInterval(UTIL.recordIntervalFunction);
    }

    document.body.ontouchend = function() {
        clearInterval(UTIL.recordIntervalFunction);
    }



    // DOM_EL.trainStatusContainer = select("#train-status-container");
    // DOM_EL.trainStatusContainer.hide();
    // DOM_EL.trainStatusModel = select("#train-status-model");
    // DOM_EL.trainStatusImage = select("#train-status-image");
    // DOM_EL.trainStatusLoss = select("#train-status-loss");
    // DOM_EL.trainStatusCompleteButton = select("#train-status-complete-button");
    // DOM_EL.trainStatusCompleteButton.hide();
    // DOM_EL.trainStatusCompleteButton.mousePressed(changeTestEvent);


    imageMode(CENTER);
}

function gotResults(err, result) {
    if(!APP_STATE.modelTrained){
        return;
    }
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


