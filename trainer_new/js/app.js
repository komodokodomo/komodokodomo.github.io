class cContainer {
    constructor(uuid, title, numImages = 0, thumbnail = "img/imageless.png") {
        this.numImages = numImages;
        this.container = createDiv();
            this.titleContainer = createDiv();
                this.thumbnail = createImg(thumbnail);
                this.inputBox = createInput();
                this.title = createDiv(title);
                this.edit = createDiv("🖊️");
            this.detailsContainer = createDiv();
                this.detailsImagesContainer = createDiv();
                    this.detailsImages = createDiv(numImages + " images");
                    this.record = createDiv("+ add");
                this.detailsQuestionContainer = createDiv();
                    this.detailsQuestion = createDiv("❌ No Content");
                    this.addContent = createDiv("+ add");
            this.remove = createDiv("🗑️");
            this.uuid = uuid;
            this.images = {};
    }
    init() {
        this.container.addClass("class-container");
            this.titleContainer.addClass("class-title-container");
            this.titleContainer.parent(this.container);

            this.detailsContainer.addClass("class-detail-container");
                this.detailsImagesContainer.addClass("class-detail-images-container");
                this.detailsImagesContainer.parent(this.detailsContainer);
                    this.detailsImages.addClass("class-detail-images");
                    this.detailsImages.parent(this.detailsImagesContainer);
                    this.record.addClass("class-record");
                    this.record.parent(this.detailsImagesContainer);
                    this.record.mousePressed(this.triggerCollectContainer.bind(this));
                this.detailsQuestionContainer.addClass("class-detail-question-container")
                this.detailsQuestionContainer.parent(this.detailsContainer);
                    this.detailsQuestion.addClass("class-detail-question");
                    this.detailsQuestion.parent(this.detailsQuestionContainer);
                    this.addContent.addClass("class-add-content");
                    this.addContent.parent(this.detailsQuestionContainer);
                    this.addContent.mousePressed(this.triggerAddContentContainer.bind(this));
        
        this.thumbnail.addClass("class-thumbnail");
        this.remove.addClass("class-remove");
        this.thumbnail.parent(this.titleContainer);
        this.title.addClass("pill-title");
        this.edit.addClass("pill-title-edit");
        this.title.parent(this.titleContainer);

        this.inputBox.hide();
        this.inputBox.addClass("title-input");
        this.inputBox.elt.addEventListener("blur", this.titleEdited.bind(this));
        this.inputBox.input(this.classInputEvent.bind(this));
        this.inputBox.parent(this.titleContainer);

        this.edit.parent(this.titleContainer);       
        this.edit.mousePressed(this.editTitle.bind(this));

        this.detailsContainer.parent(this.container);
        // this.record.parent(this.container);
        this.remove.parent(this.container);
        this.remove.mousePressed(this.triggerRemoveClassAlert.bind(this));

        if(this.numImages > 9){
            this.detailsImages.html("✅(" + this.numImages.toString() + "/10)Images");
    
        }
        else{
            this.detailsImages.html("❌(" + this.numImages.toString() + "/10)Images");
        }

        if(APP_STATE.classJson[this.uuid].hasOwnProperty("content")){  
            if(APP_STATE.classJson[this.uuid].content.ops.length > 1 || APP_STATE.classJson[this.uuid].content.ops[0].insert.length > 1){
                this.detailsQuestion.html("✅ Content Added");
            }
        }
    }

    changeTitle(title){
        this.title.html(title);
    }
    classInputEvent(){
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
        let t = this.title.html();

        this.title.show();
        this.inputBox.hide(); 
    
        let u = "?account=" + APP_STATE.username;
        let p = "&project=" + APP_STATE.project;
        let c = "&rename=" + this.uuid;
        let name = "&name=" + this.title.html();
        console.log(name);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/edit_class' + u + p + c + name, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
                var data = this.response;
                APP_STATE.classJson[this.uuid].name = t;
                console.log("server received request to edit object class");
            }
            else if(this.status == 404) {
                console.log("server failed received request to edit class");
            }
          };
        xhr.send("rename object");
        //send command to rename folder in server
    }
    triggerRemoveClassAlert(){
        console.log("function to remove object " + this.uuid + ", " + this.title.html() );
        let u = "?account=" + APP_STATE.username;
        let p = "&project=" + APP_STATE.project;
        let c = "&delete=" + this.uuid;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/edit_class' + u + p + c, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
                var data = this.response;
                console.log("server received request to remove object class");
            }
            else if(this.status == 404) {
                console.log("server failed received request to remove object class");
            }
          };
        xhr.send("delete object class");
        DOM_EL.classContainer[this.uuid].container.remove();
        delete DOM_EL.classContainer[this.uuid];
        delete DOM_EL.imageSampleList[this.uuid];
        DOM_EL.projectContainer[APP_STATE.project].classes = arrayRemove(DOM_EL.projectContainer[APP_STATE.project].classes, this.uuid);// result = [1, 2, 3, 4, 5, 7, 8, 9, 0]

        if(DOM_EL.projectContainer[APP_STATE.project].canTrain()){
            DOM_EL.trainButtonContainer.removeClass("inactive");
        }
        else{
            DOM_EL.trainButtonContainer.addClass("inactive");
        }
        toggleAddClassButton(300);
    }
    triggerCollectContainer(){
        APP_STATE.class = this.uuid;
        DOM_EL.collectClassTitle.html(this.title.html());
        // DOM_EL.opacityContainer.show();
        // DOM_EL.popupContainer.show();
        DOM_EL.opacityContainer.style("display","flex");
        DOM_EL.popupContainer.style("display","flex");
        DOM_EL.collectContainer.show();
        DOM_EL.canvasContainer.parent(DOM_EL.collectContainer);
        DOM_EL.collectImageCounter.parent(DOM_EL.collectContainer);
        DOM_EL.collectImageInstructions.parent(DOM_EL.collectContainer);
        DOM_EL.imageSampleContainer.parent(DOM_EL.collectContainer);
        DOM_EL.collectButtonContainer.parent(DOM_EL.collectContainer);

        DOM_EL.imageSampleList[this.uuid].style("display","inline-flex");

        let n = DOM_EL.imageSampleList[APP_STATE.class].elt.childElementCount;
        DOM_EL.collectImageCounter.html(n.toString() + "/10 Images");
    }
    triggerAddContentContainer(){
        APP_STATE.class = this.uuid;
        DOM_EL.addContentTitle.html(this.title.html());
        DOM_EL.opacityContainer.style("display","flex");
        DOM_EL.popupContainer.style("display","flex");
        DOM_EL.collectContainer.hide();
        DOM_EL.alertStatusContainer.hide();
        DOM_EL.addContentContainer.show();
        UTIL.quill.setContents(APP_STATE.classJson[APP_STATE.class].content);
    }
  }

  class pContainer {
    constructor(uuid,title, details, pin) {
        this.container = createDiv();
            this.titleContainer = createDiv();
                this.inputBox = createInput();
                this.title = createDiv(title);
                this.edit = createDiv("🖊️");
            // this.detailsContainer = createDiv();
            // this.details = createDiv(details);
            this.detailsContainer = createDiv();
                this.detailsEditContainer = createDiv();
                    this.detailsEdit = createDiv(details);
                    this.detailsEditButton = createDiv("edit");
                this.detailsPreviewContainer = createDiv();
                    this.detailsPreview = createDiv("PIN: " + pin);
                    this.detailsPreviewButton = createDiv("preview");

            this.remove = createDiv("🗑️");
            this.uuid = uuid;
            this.propagate = true;
            this.manifestLoaded = false;
            this.classes = [];
            this.numLabels = 0;
            this.modelTrained = false;
    }
    init() {
        this.container.addClass("project-container");
        this.titleContainer.addClass("project-title-container");
        this.title.addClass("pill-title");
        this.edit.addClass("pill-title-edit");
        
        // this.detailsContainer.addClass("project-detail-container");
        // this.details.addClass("project-detail");
        // this.details.parent(this.detailsContainer);

        this.detailsContainer.addClass("project-detail-container");

        this.detailsEditContainer.parent(this.detailsContainer);
        this.detailsEditContainer.addClass("details-edit-container");
        this.detailsEdit.parent(this.detailsEditContainer);
        this.detailsEdit.addClass("details-edit");
        this.detailsEditButton.parent(this.detailsEditContainer);
        this.detailsEditButton.addClass("details-edit-button");

        this.detailsPreviewContainer.parent(this.detailsContainer);
        this.detailsPreviewContainer.addClass("details-preview-container");
        this.detailsPreview.parent(this.detailsPreviewContainer);
        this.detailsPreview.addClass("details-preview");
        this.detailsPreviewButton.parent(this.detailsPreviewContainer);
        this.detailsPreviewButton.addClass("details-preview-button");

        this.titleContainer.parent(this.container);
        this.detailsEditButton.mousePressed(this.enterProject.bind(this));
        this.title.parent(this.titleContainer);
        this.inputBox.addClass("title-input");
        this.inputBox.parent(this.titleContainer);
        this.edit.parent(this.titleContainer);
        this.detailsContainer.parent(this.container);
        this.remove.parent(this.container);
        // this.remove.style("margin","auto");
        this.remove.addClass("class-remove");
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
        // console.log("function to edit title of: " + this.title.html());
        this.propagate = false;
        this.title.hide();
        this.inputBox.value(this.title.html()); 
        this.inputBox.show(); 
        setTimeout(function(){this.inputBox.elt.focus();}.bind(this),0);
        return false;
    }

    titleEdited(){
        let d = new Date();
        let s = d.toLocaleDateString();
        let l = d.toLocaleTimeString();
        // let l = d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, "");

        this.title.show();
        this.inputBox.hide(); 
        this.detailsEdit.html("last edit: " + s + " " + l);
    
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
        if(this.propagate){
            let x = selectAll(".class-container");
            for (let i = 0; i < x.length; i++) {
                x[i].hide();
              }
            console.log("entering " + APP_STATE.username + "'s project:" + this.uuid);
            DOM_EL.menuTitle.html(this.title.html());
            // console.log("function to hide projectsContainer, show classes container, load " + this.title.html() +" assets");
            DOM_EL.projectsContainer.hide();
            DOM_EL.addProjectContainer.hide();

            DOM_EL.classesContainer.style("display", "flex");
            DOM_EL.addClassContainer.style("display", "flex");
            DOM_EL.projectButtonContainer.style("display", "flex");
            DOM_EL.menuHome.show();
            APP_STATE.project = this.uuid;

            // DOM_EL.opacityContainer.show();
            // DOM_EL.popupContainer.show();
            DOM_EL.opacityContainer.style("display","flex");
            DOM_EL.popupContainer.style("display","flex");
            DOM_EL.collectContainer.hide();
            DOM_EL.alertStatusContainer.show();
            DOM_EL.alertStatusTitle.html("Loading Quiz Assets");

            loadProjectManifest();
        }
        else{
            this.propagate = true;
        }
    }
    canTrain(){
        let index = 0;
        if(this.classes.length > 1){
            console.log("at least 2 classes detected")
            for(let x = 0; x < this.classes.length; x++){  
                console.log("class " + x + " has " + DOM_EL.imageSampleList[this.classes[x]].elt.childElementCount + " images");
                if(DOM_EL.imageSampleList[this.classes[x]].elt.childElementCount > 9){index++;}
            }
            DOM_EL.projectContainer[APP_STATE.project].numLabels = index;
            if(index > 1){
                console.log("at least 2 classes with at least 10 image each detected");
                return true;
            }
            else{
                console.log("at least 2 classes but insufficient images");
                return false;
            }
        }
        else{
            return false;
        }
      };
  }

var DOM_EL = {
    
    ////////////////////GOOGLE LOGIN///////////////////////
    loginContainer: null,
        loginButton: null,
    ////////////////////MENU///////////////////////
    menuContainer: null,
        menuHamburger: null,
        menuHamburgerPopup: null,
        menuTitle: null,
        menuProjectTitle: null,
        menuHome: null,
        // menuProfileImageContainer: null,
            // menuProfileImage: null,
    
    menuHamburgerPopupLogout: null,
    menuHamburgerPopupAbout: null,
    menuHamburgerPopupFeedback: null,

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
            // saveButtonContainer: null,
            //     saveButtonHelp: null,
            trainButtonContainer: null,
                trainButtonHelp: null,
            previewButtonContainer: null,
                previewButtonHelp: null,
    
    ////////////////////POPUP MODE///////////////////////
    opacityContainer: null,
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
                // collectClassEdit: null,
                // collectClassRemove: null,
            collectCloseContainer: null,
            collectImageContainer: null,
                collectImageCounter: null,
                collectImageInstructions: null,
                imageSampleListContainer: null,
                imageSampleList: {},
                    // imageSampleContainer: null,
                    //     imageSample: null,
                    //     imageSampleRemove: null,
        collectButton: null,

        addContentContainer: null,
            addContentTitle: null,
            addContentCloseContainer: null,
            quillContainer: null,
            addContentOpacityContainer: null,
            quizBuilderContainer: null,
                quizBuilderTitleInput: null,
                quizBuilderOptions: [],
                quizBuilderOptions: [],
                quizDoneContainer: null,
                quizCancelContainer: null,

        previewContainer: null,
            previewTitleContainer: null,
                previewTitle: null,
                previewProject: null,
            previewCloseContainer: null,
        personaContainer: null,
        personaAvatar: null,
        personaTextContainer: null,
        personaText: null,
        personaButton: null,
        previewEvidenceContainer: null,
        previewEvidenceBox: null,
        previewEvidenceHeader: null,
        previewEvidenceSubheader: null,
        previewEvidenceListContainer: null,
        previewEvidenceList: null,
        previewEvidenceListItemContainer: [],
        previewEvidenceListItem: [],
            previewEvidenceListItemImage: [],
        previewEvidenceListItemTitle: [],
        previewContentContainer: null,
            previewContentTitle: null,
            previewContentClose: null,
            previewContent: null,


    canvasContainer: null,
        capture: null,
        captureOverlay: null,
        cameraFlip: null,
        cameraChange: null,
        canvas: null,


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
    quill: null,
    quillQuizButton: null
}

var MISC = {
    thinking: ".",
    findingText: "I need a better angle",
    redirectText: "Nope, we should look elsewhere",
}

var APP_STATE = {
    username: null,
    project: null,
    class: null,
    mobileDevice: null,
    width: 0,
    height: 0,
    numClasses: 0,
    classInputString: "",
    switchFlag: false,
    recording: null,
    cameraMirror: false,

    numTrainingClasses: 0,      // 4
    numTrainingImagesSum: 0,    // 38
    numTrainingImagesProcessed: 0, //should eventually reach 38
    numTrainingImagesArray: [], // [20,10,5,3]

    trainingClasses: [],    // [0,1,2,4]
    currentArrayIndex: 0,       // could be 0,1,2,3
    currentImageNumberIndex: 0,   //currentImageNumberIndex[trainingClassNumber[i]]
    loss: 0,
    modelTrained: false,

    classJson: null,
    quillChanged: false,
    quillRange: null,

    numClasses: 0,
    numClassesObtained: false,
    evidencesFound: [],
    evidenceDetected: null,
    evidenceFound: false,
    evidenceCounter: 0
}

let featureExtractor;
let classifier;
let projectFiles = [];

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
    APP_STATE.username = profile.getEmail();
   
    DOM_EL.loginContainer.hide();
    DOM_EL.loginButton.hide();
    // DOM_EL.menuProfileImage = createImg(profile.getImageUrl());
    // DOM_EL.menuProfileImage.id("menu-profileC-image")
    // DOM_EL.menuProfileImage.parent(DOM_EL.menuProfileImageContainer);

    DOM_EL.menuContainer.style("display", "inline-flex");
    DOM_EL.projectsContainer.style("display", "flex");
    DOM_EL.addProjectContainer.style("display", "flex");

    DOM_EL.menuTitle.html("Choose quiz to edit or preview");

    loadProjectList();
}

function loadProjectList(){
    let u = "?account=" + APP_STATE.username;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/LIST_PROJECT' + u, true);

    xhr.onload = function(e) {
        let index = 0;
        if (this.status == 200) {
          var data = JSON.parse(this.response);
          console.log(data);
          Object.keys(data).forEach(function(key) {
            console.log('Key : ' + key + ', Value : ' + data[key]);
            let d = new Date(data[key].detail);
            let s = d.toLocaleDateString();
            let l = d.toLocaleTimeString();
            DOM_EL.projectContainer[key] = new pContainer(key, data[key].name, "last edit: " + s + " " + l , data[key].pin);
            DOM_EL.projectContainer[key].init();
            DOM_EL.projectContainer[key].container.parent(DOM_EL.projectsContainer);

            if(data[key].modelTrained == true){
                DOM_EL.projectContainer[key].modelTrained = true;
            }

            if(index == 0){
                DOM_EL.projectContainer[key].container.addClass("first");
                }
            index++;

          });
        
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

function loadProjectModel(){
    let jsonFile;
    let weightsFile;
    let u = "?account=" + APP_STATE.username;
    let p = "&project=" + APP_STATE.project;
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
                APP_STATE.modelTrained = true;
                projectFiles.push(jsonFile);
                projectFiles.push(weightsFile);
                featureExtractor = null; //reset featureExtractor
                featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded); 
                hideAlertStatus();
            }
          };

          xhr2.send("get weights");
        }
        else if(this.status == 404) {
          console.log("no zipped model detected, new project maybe?");
          hideAlertStatus();
        }
      };
    xhr.send("load project model");
}


function hideAlertStatus(){
    DOM_EL.opacityContainer.hide();
    DOM_EL.popupContainer.hide();
    DOM_EL.alertStatusContainer.hide();
}

function loadProjectManifest(){

    if(DOM_EL.projectContainer[APP_STATE.project].manifestLoaded){
        console.log("manifest loaded before, loading relevant class containers");
        console.log(DOM_EL.projectContainer[APP_STATE.project].classes);

        toggleAddClassButton(0);
        for(let x = 0; x < DOM_EL.projectContainer[APP_STATE.project].classes.length; x++){
            DOM_EL.classContainer[DOM_EL.projectContainer[APP_STATE.project].classes[x]].container.style("display","flex");
            if(x == 0){
                DOM_EL.classContainer[DOM_EL.projectContainer[APP_STATE.project].classes[x]].container.addClass("first");
            }
            else{
                DOM_EL.classContainer[DOM_EL.projectContainer[APP_STATE.project].classes[x]].container.removeClass("first");
            }
        }
        if(DOM_EL.projectContainer[APP_STATE.project].canTrain()){
            DOM_EL.trainButtonContainer.removeClass("inactive");
        }
        else{
            DOM_EL.trainButtonContainer.addClass("inactive");
        }
        if(DOM_EL.projectContainer[APP_STATE.project].modelTrained){
            setTimeout(function(){DOM_EL.previewButtonContainer.removeClass("inactive")},10);
            loadProjectModel();
        }
        else{
            hideAlertStatus();
        }
    }
    else{
        let u = "?account=" + APP_STATE.username;
        let p = "&project=" + APP_STATE.project;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/admin/LIST_CLASS' + u + p, true);
    
        xhr.onload = function(e) {
            if (this.status == 200) {
                DOM_EL.projectContainer[APP_STATE.project].manifestLoaded = true;
                var data = JSON.parse(this.response);
                APP_STATE.classJson = data;
                console.log(data);
                if(Object.keys(APP_STATE.classJson).length === 0 && APP_STATE.classJson.constructor === Object) {
                    DOM_EL.addClassContainer.addClass("help");
                    setTimeout(() => {DOM_EL.addClassContainer.html("+ Add a new content space");},0);
                }
                else{
                    DOM_EL.addClassContainer.removeClass("help");
                    setTimeout(() => {DOM_EL.addClassContainer.html("+");},0);
                }
                let index = 0;
                let trainableIndex = 0;
                Object.keys(data).forEach(function(key) {
                  DOM_EL.projectContainer[APP_STATE.project].classes.push(key);
                  console.log('Key : ' + key + ', Value : ' + data[key]);
                  if(data[key].thumbnail == null){
                    DOM_EL.classContainer[key] = new cContainer(key, data[key].name, data[key].images.length); //constructor(uuid, title, numImages = 0, thumbnail = "img/imageless.png")
                  }
                  else{
                    DOM_EL.classContainer[key] = new cContainer(key, data[key].name, data[key].images.length, data[key].thumbnail); //constructor(uuid, title, numImages = 0, thumbnail = "img/imageless.png")
                  }
                  if(data[key].images.length > 9){trainableIndex++;}
                  for(let y = 0; y < data[key].images.length; y++){
                    let xhrImage = new XMLHttpRequest();
                    let k = "&class="+ key;
                    let n = "&name=" + data[key].images[y];
                    xhrImage.open('GET', '/admin/get_image' + u + p + k + n , true);
    
                    xhrImage.onload = function(e) {
                      if (this.status == 200) {
                        let res = this.response;
                        console.log("fetching image " + y + " from class: " + data[key].name);
    
                        let l = createDiv();
                        l.class("sample-list");
                        l.parent(DOM_EL.imageSampleList[key]);
                    
                        DOM_EL.collectImageInstructions.hide();
                    
                        let i = createImg(res);
                        i.class("sample-list-image");
                        i.parent(l);
                        i.attribute("name",data[key].name);
                        DOM_EL.classContainer[key].images[data[key].name] = res;
                    
                        let r = createDiv("🗑️");
                        r.class("sample-list-remove");
                        r.attribute("name",data[key].name);
                    
                        r.parent(l);
                    
                        r.mousePressed(function(){
                            l.class("removed"); 
                            delete DOM_EL.classContainer[key].images[r.attribute("name")];
                            removeImage(APP_STATE.username, APP_STATE.project, APP_STATE.class, r.attribute("name"));
                            setTimeout(function(){
                                l.remove();
                                resetCounterHtml();
                                if(DOM_EL.imageSampleList[APP_STATE.class].elt.childNodes.length === 0){
                                    DOM_EL.collectImageInstructions.show();
                                    DOM_EL.classContainer[APP_STATE.class].thumbnail.elt.src = "img/imageless.png"
                                    console.log("send request to update classList.json thumbnail details");
                                }
                            },300);
                        });
                        if(y === 0){
                            DOM_EL.classContainer[key].thumbnail.elt.src = res;
                        }
                      }
                      else if(this.status == 404) {
                        hideAlertStatus();
                        console.log("no images detected, new project maybe?");
                      }
                  };
                    xhrImage.send("get class images");
                  }
    
    
                  DOM_EL.classContainer[key].init();
                  DOM_EL.classContainer[key].container.parent(DOM_EL.classesContainer);
    
                  if(index == 0){
                    DOM_EL.classContainer[key].container.addClass("first");
                  }
                  index++;
    
                  DOM_EL.imageSampleList[key] = createElement("ol");
                  DOM_EL.imageSampleList[key].class("image-sample-list");
                  DOM_EL.imageSampleList[key].parent(DOM_EL.imageSampleContainer);
                  DOM_EL.imageSampleList[key].hide();
                });
                
                DOM_EL.projectContainer[APP_STATE.project].numLabels = trainableIndex;
                if(trainableIndex > 1){DOM_EL.trainButtonContainer.removeClass("inactive");}
                else{DOM_EL.trainButtonContainer.addClass("inactive");}
                loadProjectModel();
            }
            else if(this.status == 404) {
              console.log("no classList.json detected, new project maybe?");
              hideAlertStatus();
            }
          };
        xhr.send("load project images");
    }

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

function logoutEvent(){
    signOut();
    location.reload();
}

function menuEvent(){
    DOM_EL.classesContainer.hide();
    DOM_EL.addClassContainer.hide();
    DOM_EL.projectButtonContainer.hide();
    DOM_EL.menuTitle.html("Choose quiz to edit or preview");
    DOM_EL.menuHome.hide();
    DOM_EL.projectsContainer.style("display","flex");
    DOM_EL.addProjectContainer.style("display","flex");
    APP_STATE.modelTrained = false;
    DOM_EL.previewButtonContainer.addClass("inactive");
    APP_STATE.numClassesObtained = false;
    // DOM_EL.menuHamburgerPopup.toggleClass("hidden");
}



function collectImageEvent(){
    let n = Date.now();

    let l = createDiv();
    l.class("sample-list");
    l.parent(DOM_EL.imageSampleList[APP_STATE.class]);

    DOM_EL.collectImageInstructions.hide();

    let c = document.getElementById('canvas');
    dataUrl = c.toDataURL(0.5);
    let i = createImg(dataUrl);
    i.class("sample-list-image");
    i.parent(l);
    // i.attribute("name",n);
    i.attribute("name",DOM_EL.classContainer[APP_STATE.class].title.html());
    DOM_EL.classContainer[APP_STATE.class].images[n] = dataUrl;

    let r = createDiv("🗑️");
    r.class("sample-list-remove");
    // r.attribute("name",n);
    r.attribute("name",DOM_EL.classContainer[APP_STATE.class].title.html());

    r.parent(l);

    r.mousePressed(function(){
        l.class("removed"); 
        delete DOM_EL.classContainer[APP_STATE.class].images[r.attribute("name")];
        removeImage(APP_STATE.username, APP_STATE.project, APP_STATE.class, r.attribute("name"));
        setTimeout(function(){
            l.remove();
            resetCounterHtml();
            if(DOM_EL.imageSampleList[APP_STATE.class].elt.childNodes.length === 0){
                DOM_EL.collectImageInstructions.show();
                DOM_EL.classContainer[APP_STATE.class].thumbnail.elt.src = "img/imageless.png"
                console.log("send request to update classList.json thumbnail details");
            }
        },300);
    });

    APP_STATE.classJson[APP_STATE.class].images.push(n);

    uploadImage(APP_STATE.username, APP_STATE.project, APP_STATE.class, n, dataUrl);

    if(DOM_EL.classContainer[APP_STATE.class].thumbnail.elt.src.includes("img/imageless.png")){
        DOM_EL.classContainer[APP_STATE.class].thumbnail.elt.src = dataUrl;
        console.log("send request to update classList.json thumbnail details");
    }


    resetCounterHtml();

}

function toggleAddClassButton(x){
    if(DOM_EL.projectContainer[APP_STATE.project].classes.length == 0){
        DOM_EL.addClassContainer.addClass("help");
        setTimeout(() => {DOM_EL.addClassContainer.html("+ Add a new content space");},x);
    }
    else{
        DOM_EL.addClassContainer.removeClass("help");
        setTimeout(() => {DOM_EL.addClassContainer.html("+");},x);
    }
}

function resetCounterHtml(){
    let n = DOM_EL.imageSampleList[APP_STATE.class].elt.childElementCount;
    DOM_EL.collectImageCounter.html(n.toString() + "/10 Images");

    if(n > 9){
        DOM_EL.classContainer[APP_STATE.class].detailsImages.html("✅(" + n.toString() + "/10)Images");

    }
    else{
        DOM_EL.classContainer[APP_STATE.class].detailsImages.html("❌(" + n.toString() + "/10)Images");
    }
}


function addProjectEvent(){
    let n = Date.now();
    let d = new Date();
    let s = d.toLocaleDateString();
    let l = d.toLocaleTimeString();
    console.log("time to add a project");
    DOM_EL.projectContainer[n] = new pContainer(n, "new quiz " + DOM_EL.projectsContainer.elt.childElementCount, "last modified: " + s + " " + l, "????");
    DOM_EL.projectContainer[n].init();
    DOM_EL.projectContainer[n].container.parent(DOM_EL.projectsContainer);
    DOM_EL.projectContainer[n].container.elt.scrollIntoView({behavior: 'smooth'});

    let u = "?account=" + APP_STATE.username;
    let c = "&create=" + n;
    let name = "&name=new quiz "+ DOM_EL.projectsContainer.elt.childElementCount;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/edit_project' + u + c + name, true);
    xhr.onload = function(e) {
        if (this.status == 200) {
          var data = this.response;
        //   console.log(data);
          DOM_EL.projectContainer[n].detailsPreview.html("PIN: " + data);
            console.log("successfully added project");
        }
        else if(this.status == 404) {
            console.log("failed to add project to server");
        }
      };
    xhr.send("add project");

}


function addClassEvent(){
    let n = Date.now();
    let d = new Date();
    let s = d.toLocaleDateString();
    let l = d.toLocaleTimeString();
    console.log("time to add a object to project: ");
    
    DOM_EL.classContainer[n] = new cContainer(n, "new quiz scene " + DOM_EL.classesContainer.elt.childElementCount);  //constructor(uuid, title, details, thumbnail)
    APP_STATE.classJson[n] = {
        "name":"new quiz scene " + DOM_EL.classesContainer.elt.childElementCount,
        "num":DOM_EL.classesContainer.elt.childElementCount, 
        "thumbnail": null, 
        "images":[]
    }
    DOM_EL.classContainer[n].init();
    DOM_EL.classContainer[n].container.parent(DOM_EL.classesContainer);

    DOM_EL.imageSampleList[n] = createElement("ol");
    DOM_EL.imageSampleList[n].class("image-sample-list");
    DOM_EL.imageSampleList[n].parent(DOM_EL.imageSampleContainer);
    DOM_EL.imageSampleList[n].hide();

    DOM_EL.classContainer[n].container.elt.scrollIntoView({behavior: 'smooth'});

    let u = "?account=" + APP_STATE.username;
    let p = "&project=" + APP_STATE.project;
    let c = "&create=" + n;
    let name = "&name=new quiz scene " + DOM_EL.classesContainer.elt.childElementCount;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/edit_class' + u + p + c + name, true);
    xhr.onload = function(e) {
        if (this.status == 200) {
            console.log("successfully added object class");
            DOM_EL.projectContainer[APP_STATE.project].classes.push(n.toString());
            toggleAddClassButton(0);
        }
        else if(this.status == 404) {
            console.log("failed to add class to server");
        }
      };
    xhr.send("add project");
}

function trainButtonEvent(){
    if(DOM_EL.trainButtonContainer.class().includes("inactive")){
        console.log("conditions not ripe for training yet");
    }
    else{
        featureExtractor = null; //reset featureExtractor
        APP_STATE.modelTrained = false;
        featureExtractor = ml5.featureExtractor('MobileNet',{numLabels: DOM_EL.projectContainer[APP_STATE.project].numLabels}, modelLoaded); 
    }
}

function previewButtonEvent(){
    if(DOM_EL.previewButtonContainer.class().includes("inactive")){
        console.log("no model trained yet");
    }
    else{
        console.log("Open up preview container for user to see accuracy and look at how content is rendered");
        APP_STATE.modelTrained = true;
        setTimeout(function(){classifier.classify( DOM_EL.canvas.elt, gotResults);},100);
        DOM_EL.previewContainer.show();
        DOM_EL.popupContainer.style("display","flex");
        DOM_EL.opacityContainer.style("display","flex");
        DOM_EL.canvasContainer.parent(DOM_EL.previewContainer);
        DOM_EL.personaContainer.style("display","flex");
        DOM_EL.personaTextContainer.show();
        DOM_EL.previewEvidenceContainer.parent(DOM_EL.previewContainer);
        DOM_EL.previewContentContainer.parent(DOM_EL.previewContainer);

    }

}

function modelLoaded() {
    console.log('MobileNet Model Loaded!');
    if(APP_STATE.modelTrained){
        console.log("trying to load custom classifier");
        classifier = featureExtractor.classification();
        Array.from(projectFiles).forEach((file) => {
            if (file.name.includes('.json')) {
                console.log("found a json file")
            } else if (file.name.includes('.bin')) {
                console.log("found a bin file")
            }
          });
        // classifier.load([projectFiles["model.json"]._data.compressedContent,projectFiles["model.weights.bin"]._data.compressedContent], function(){
            classifier.load(projectFiles);
            console.log("custom classifier loaded");
            DOM_EL.previewButtonContainer.removeClass("inactive");
            // setTimeout(function(){classifier.classify( DOM_EL.canvas.elt, gotResults);},1000);
    }
    else{
        classifier = featureExtractor.classification();
        setTimeout(addImages,100);
    }
  }


async function addImages(){
    APP_STATE.numTrainingClasses = 0;
    APP_STATE.numTrainingImagesSum = 0;
    APP_STATE.numTrainingImagesProcessed = 0;
    APP_STATE.currentArrayIndex = 0;
    APP_STATE.trainingClasses = [];
    
    //getting number of classes and images
    for (let i = 0; i< DOM_EL.projectContainer[APP_STATE.project].classes.length; i++){
        let c = DOM_EL.projectContainer[APP_STATE.project].classes[i];
        if(DOM_EL.imageSampleList[c].elt.childElementCount > 9) { 
            APP_STATE.numTrainingClasses++;
            APP_STATE.trainingClasses.push(DOM_EL.projectContainer[APP_STATE.project].classes[i]); 
            for(let j = 0; j < DOM_EL.imageSampleList[c].elt.childElementCount; j++){
                APP_STATE.numTrainingImagesSum++;
            }
        }
    }

    console.log(APP_STATE.numTrainingClasses);
    console.log(APP_STATE.numTrainingImagesSum);
    console.log(APP_STATE.trainingClasses);
    
    ml5.tf.setBackend("cpu");
    featureExtractor.addImage(
    DOM_EL.imageSampleList[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0], 
    // DOM_EL.imageSampleList[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0].getAttribute("name"), 
    DOM_EL.classContainer[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].title.html(),
    imageAdded);
  }

 
async function imageAdded(){
    APP_STATE.numTrainingImagesProcessed++;
    console.log("⚙️ Base model fed " + (APP_STATE.numTrainingImagesProcessed).toString() + "/" + (APP_STATE.numTrainingImagesSum).toString() + " training images");   

    if(APP_STATE.numTrainingImagesProcessed == APP_STATE.numTrainingImagesSum){ //    if all images added
        console.log("✔️ All training images fed");  
        // DOM_EL.trainStatusImage.html("✔️ All training images fed, time to train!");   
         //start training
        ml5.tf.setBackend("webgl");
        setTimeout(function(){
            featureExtractor.train(function(lossValue) {
            if (lossValue) {
              APP_STATE.loss = lossValue;
            //   DOM_EL.trainStatusLoss.html("⚙️Training progress (loss):" + APP_STATE.loss);
              console.log(APP_STATE.loss);
            } else {
              console.log('Done Training! Final Loss: ' +  APP_STATE.loss);
            //   DOM_EL.trainStatusLoss.html('✔️Done Training! Final Loss: ' +  APP_STATE.loss);
            //   DOM_EL.trainStatusCompleteButton.show();
              APP_STATE.modelTrained = true;
            //   ml5.tf.setBackend("webgl");
              classifier.classify( DOM_EL.canvas.elt, gotResults);
              DOM_EL.previewButtonContainer.removeClass("inactive");
              uploadModel(modelUploaded,"model"); 
            }
          });
        },100);
    }
    else{
        APP_STATE.currentImageNumberIndex++;
        if(APP_STATE.currentImageNumberIndex == DOM_EL.imageSampleList[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].elt.childElementCount){
            APP_STATE.currentArrayIndex++;
            APP_STATE.currentImageNumberIndex = 0;
        }    
        console.log(ml5.tf.memory());
        setTimeout(function(){
            featureExtractor.addImage(
            DOM_EL.imageSampleList[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0], 
            // DOM_EL.imageSampleList[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].elt.children[APP_STATE.currentImageNumberIndex].children[0].getAttribute("name"), 
            DOM_EL.classContainer[APP_STATE.trainingClasses[APP_STATE.currentArrayIndex]].title.html(),
            imageAdded)
        },50);
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

    UTIL.zipModel.file(`${modelName}.json`,JSON.stringify(featureExtractor.weightsManifest));
    UTIL.zipModel.file(`${modelName}.weights.bin`, data.weightData);
    UTIL.zipModel.generateAsync({type:"blob"})
    .then(function (blob) {
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


const uploadBlobXML = async (data, name,t) => {

    let u = "?account=" + APP_STATE.username;
    let c = "&project=" + APP_STATE.project;

    var fileOfBlob = new File([data], name);
    form = new FormData(),
    form.append("upload", fileOfBlob, name);
    form.append("type", t);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/upload_model' + u + c, true);
    xhr.onload = function () {
        console.log("model uploaded!!");
        APP_STATE.numClassesObtained = false;
    };
    xhr.send(form);
  };

  const uploadImage = async (account, project, Class, name, data) => {

    let u = "?account=" + account;
    let p = "&project=" + project;
    let c = "&class=" + Class;
    let n = "&name=" + name;

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('loadstart', handleEvent, false);
    xhr.addEventListener('progress', handleEvent, false);
    xhr.addEventListener('error', handleEvent, false);
    xhr.open('POST',"/admin/UPLOAD_IMAGE" + u + p + c + n ,true);

    xhr.send(data);
  };

  const removeImage = async (account, project, Class, name) => {

    let u = "?account=" + account;
    let p = "&project=" + project;
    let c = "&class=" + Class;
    let n = "&name=" + name;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/DELETE_IMAGE' + u + p + c + n, true);
    xhr.onload = function(e) {
        if (this.status == 200) {
            console.log("image removal success");
        }
        else if(this.status == 404) {
            console.log("image removal failed");
        }
      };
    xhr.send("remove image");
  };

function handleEvent(e) {
    log.textContent = log.textContent + `${e.type}: ${e.loaded} bytes transferred\n`;
}


function menuHamburgerEvent(){
    console.log("open hamburger menu");
    DOM_EL.menuHamburgerPopup.toggleClass("hidden");
}

 function setup(){

    setInterval(function(){
        MISC.thinking += ".";
        if(MISC.thinking == "...."){
          MISC.thinking = ".";
        }
      },1000);

    UTIL.zipModel = new JSZip();
    UTIL.zipImage = new JSZip();
    UTIL.unzipImage = new JSZip();

    UTIL.quill = new Quill('#quill-container', {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image']
          ]
        },
        placeholder: 'Start adding content!',
        theme: 'snow'  // or 'bubble'
      });

    UTIL.quill.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
          console.log("An API call triggered this change.");
        } else if (source == 'user') {
          console.log("A user action triggered this change.");
          UTIL.quillChanged = true;
        }
      });

    UTIL.quillQuizButton = new QuillToolbarButton({
        icon: '<img src = "img/question.png" style="width: 18px; height: 18px; ">'
    })
    UTIL.quillQuizButton.onClick = function(quill) {
        console.log(quill.getContents());
        DOM_EL.quizBuilderContainer.style("display","flex");
        DOM_EL.addContentOpacityContainer.show();
        APP_STATE.quillRange = UTIL.quill.getSelection();
        console.log(APP_STATE.quillRange);
    }
    UTIL.quillQuizButton.attach(UTIL.quill) // Add the custom button to the quill editor

    APP_STATE.width = window.innerWidth;
    APP_STATE.height = window.innerHeight;

    DOM_EL.loginContainer = select("#login-container");
    DOM_EL.loginButton = select("#google-login");

    DOM_EL.menuContainer = select("#menu-container");
        DOM_EL.menuHamburger = select("#menu-hamburger");
        DOM_EL.menuHamburger.mousePressed(menuHamburgerEvent);
        DOM_EL.menuTitle = select("#menu-title");
        DOM_EL.menuProjectTitle = select("#menu-project-title");
        DOM_EL.menuHome = select("#menu-home");
        DOM_EL.menuHome.hide();
        DOM_EL.menuHome.mousePressed(menuEvent);
        // DOM_EL.menuProfileImageContainer = select("#menu-profile-image-container");
    DOM_EL.menuHamburgerPopup = select("#menu-hamburger-popup");
        DOM_EL.menuHamburgerPopupLogout = select("#menu-hamburger-popup-list-logout");
        DOM_EL.menuHamburgerPopupLogout.mousePressed(logoutEvent);
        DOM_EL.menuHamburgerPopupAbout = select("#menu-hamburger-popup-list-about");
        // DOM_EL.menuHamburgerPopupAbout.mousePressed(menuEvent);
        DOM_EL.menuHamburgerPopupFeedback = select("#menu-hamburger-popup-list-feedback");

    DOM_EL.projectsContainer = select("#projects-container");
        DOM_EL.addProjectContainer = select("#add-project-container");
        DOM_EL.addProjectContainer.mousePressed(addProjectEvent);
        DOM_EL.addProjectContainer.hide();
    DOM_EL.classesContainer = select("#classes-container");
        DOM_EL.addClassContainer = select("#add-class-container");
        DOM_EL.addClassContainer.mousePressed(addClassEvent);
        DOM_EL.addClassContainer.hide();
    DOM_EL.projectButtonContainer = select("#project-button-container");
        DOM_EL.trainButtonContainer = select("#train-project-container");
        DOM_EL.trainButtonContainer.mousePressed(trainButtonEvent);
        DOM_EL.previewButtonContainer = select("#preview-project-container");
        DOM_EL.previewButtonContainer.mousePressed(previewButtonEvent);
    DOM_EL.opacityContainer = select("#opacity-container");
    DOM_EL.popupContainer = select("#popup-container");
        DOM_EL.alertStatusContainer = select("#alert-status-container");
            DOM_EL.alertStatusTitle = select("#alert-status-title");
            DOM_EL.alertStatusContent = select("#alert-status-content");
        DOM_EL.alertOkContainer = select("#alert-ok-container");
            DOM_EL.alertOkTitle = select("#alert-ok-title");
            DOM_EL.alertOkContent = select("#alert-ok-content");
            DOM_EL.alertOkButton = select("#alert-ok-button");
        DOM_EL.alertOptionContainer = select("#alert-option-container");
            DOM_EL.alertOptionTitle = select("#alert-option-container");
            DOM_EL.alertOptionContent = select("#alert-option-content");
            DOM_EL.alertOptionYesButton = select("#alert-option-yes-button");
            DOM_EL.alertOptionNoButton = select("#alert-option-no-button");
        DOM_EL.collectContainer = select("#collect-container");
            DOM_EL.collectClassContainer = select("#collect-class-container");
                DOM_EL.collectClassTitle = select("#collect-class-title");
                // DOM_EL.collectClassEdit = select("#collect-class-edit");
                // DOM_EL.collectClassRemove = select("#collect-class-remove");
            DOM_EL.collectCloseContainer = select("#collect-close-container");
            DOM_EL.collectCloseContainer.mousePressed(collectCloseEvent);
            DOM_EL.collectImageContainer = select("#collect-image-container");
                DOM_EL.collectImageCounter = select("#collect-image-counter");
                DOM_EL.collectImageInstructions = select("#collect-image-instructions");
                // imageSampleListContainer: null,
                // imageSampleList: [],
                    // imageSampleContainer: null,
                    //     imageSample: null,
                    //     imageSampleRemove: null,
                // collectImageContainer: null,
        DOM_EL.collectButtonContainer = select("#collect-button-container");
            DOM_EL.collectButton = select("#collect-button");
            DOM_EL.collectButton.mousePressed(collectImageEvent);

        DOM_EL.addContentContainer = select("#add-content-container");
            DOM_EL.addContentTitle = select("#add-content-class-title");
            DOM_EL.addContentCloseContainer = select("#add-content-close-container");
            DOM_EL.addContentCloseContainer.mousePressed(addContentCloseEvent);
            DOM_EL.quillContainer = select("#quill-container");
            DOM_EL.addContentOpacityContainer = select("#add-content-opacity-container");
            DOM_EL.quizBuilderContainer = select("#quiz-builder-container");
                DOM_EL.quizDoneContainer = select("#quiz-done-container");
                DOM_EL.quizDoneContainer.mousePressed(quizDoneEvent);
                DOM_EL.quizCancelContainer = select("#quiz-cancel-container");
                DOM_EL.quizCancelContainer.mousePressed(quizCancelEvent);

        DOM_EL.previewContainer = select("#preview-container");
            DOM_EL.previewTitleContainer = select("#preview-title-container");
                DOM_EL.previewTitle = select("#preview-title");
                DOM_EL.previewProject = select("#preview-project");
            DOM_EL.previewCloseContainer = select("#preview-close-container");
            DOM_EL.previewCloseContainer.mousePressed(previewCloseEvent);
            DOM_EL.personaContainer = select("#persona-container");
            DOM_EL.personaContainer.hide();
        DOM_EL.personaAvatar = select("#persona-avatar");
        DOM_EL.personaTextContainer = select("#persona-text-container");
            DOM_EL.personaText = select("#persona-text");
            DOM_EL.personaButton = select("#persona-button");
            DOM_EL.personaButton.mousePressed(captureEvidenceEvent);
        DOM_EL.personaTextContainer.hide();
        DOM_EL.previewEvidenceContainer = select("#preview-evidence-container");
        DOM_EL.previewEvidenceBox = select("#preview-evidence-box");
        DOM_EL.previewEvidenceHeader = select("#preview-evidence-header");
        DOM_EL.previewEvidenceSubheader = select("#preview-evidence-subheader");
        DOM_EL.previewEvidenceListContainer = select("#preview-evidence-list-container");
        DOM_EL.previewEvidenceList = select("#preview-evidence-list");
        DOM_EL.previewContentContainer = select("#preview-content-container");
        DOM_EL.previewContentContainer.addClass("hidden");
            DOM_EL.previewContentTitle = select("#preview-content-title");
            DOM_EL.previewContentClose = select("#preview-content-close");
            DOM_EL.previewContentClose.mousePressed(previewContentCloseEvent);
            DOM_EL.previewContent = select("#preview-content");

    DOM_EL.menuContainer.hide();
    DOM_EL.projectsContainer.hide();
    DOM_EL.classesContainer.hide();
    DOM_EL.projectButtonContainer.hide();
    DOM_EL.opacityContainer.hide();
    DOM_EL.popupContainer.hide();
    DOM_EL.alertStatusContainer.hide();
    DOM_EL.alertOkContainer.hide();
    DOM_EL.alertOptionContainer.hide();
    DOM_EL.addContentContainer.hide();
    DOM_EL.previewContainer.hide();


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

    DOM_EL.imageSampleContainer = select("#image-sample-container");

    // document.body.onmouseup = function() {
    //     clearInterval(UTIL.recordIntervalFunction);
    // }

    // document.body.ontouchend = function() {
    //     clearInterval(UTIL.recordIntervalFunction);
    // }


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

function quizDoneEvent(){
    DOM_EL.quizBuilderContainer.hide();
    DOM_EL.addContentOpacityContainer.hide();
    console.log("add in custom quiz html to quillContainer");
    // let title = createDiv(DOM_EL.quizBuilderTitleInput)
    // let range = UTIL.quill.getSelection();
    // if (range) {
    if ( APP_STATE.quillRange.length == 0) {
        console.log('User cursor is at index',  APP_STATE.quillRange.index);
        UTIL.quill.clipboard.dangerouslyPasteHTML( APP_STATE.quillRange.index,DOM_EL.projectContainer[1602489937404].container.elt.innerHTML);
    } else {
        // var text = UTIL.quill.getText( APP_STATE.quillRange.index,  APP_STATE.quillRange.length);
        UTIL.quill.deleteText( APP_STATE.quillRange.index,  APP_STATE.quillRange.length);
        UTIL.quill.clipboard.dangerouslyPasteHTML( APP_STATE.quillRange.index,DOM_EL.projectContainer[1602489937404].container.elt.innerHTML);
    }
    // } else {
    // console.log('User cursor is not in editor');
    // }
    // { insert: DOM_EL.quizBuilderTitleInput, attributes: { bold: true } },
    // { insert: DOM_EL.quizBuilderTitleInput, attributes: { bold: true ,answer: quizOptionAnswer.value } },
    // { insert: DOM_EL.quizBuilderTitleInput, attributes: { bold: true ,answer: quizOptionAnswer.value } },
    // { insert: DOM_EL.quizBuilderTitleInput, attributes: { bold: true ,answer: quizOptionAnswer.value } },
    // { insert: DOM_EL.quizBuilderTitleInput, attributes: { bold: true ,answer: quizOptionAnswer.value } },
   
}

function quizCancelEvent(){
    DOM_EL.quizBuilderContainer.hide();
    DOM_EL.addContentOpacityContainer.hide();
    console.log("clear all content within quizBuilderContainer");
}

function captureEvidenceEvent(){
    if(DOM_EL.personaButton.class() !== "inactive"){
  
      DOM_EL.captureOverlay.addClass("snap");
    //   SOUNDS.shutter.play();
      setTimeout(function(){
        DOM_EL.captureOverlay.removeClass("snap");
      },50);
  
      if(APP_STATE.evidencesFound.includes(APP_STATE.evidenceDetected)){
        console.log("replacing image");
        for(let i = 0; i<DOM_EL.previewEvidenceListItemTitle.length; i++){
          if(DOM_EL.previewEvidenceListItemTitle[i].html().replace( / /g , "_" ) == APP_STATE.evidenceDetected){
            let dataUrl = DOM_EL.canvas.elt.toDataURL(0.5);
            DOM_EL.previewEvidenceListItem[i].elt.children[0].src = dataUrl;
          }
        }
      }
      else{
        let dataUrl = DOM_EL.canvas.elt.toDataURL(0.5);
        let i = createImg(dataUrl);
        i.class("evidence-list-item-image");
        i.parent(DOM_EL.previewEvidenceListItem[APP_STATE.evidenceCounter]);
    
        //   let x = APP_STATE.displayName[APP_STATE.evidenceDetected];
        //   let s = x.replace( /_/g , " " );
        DOM_EL.previewEvidenceListItemTitle[APP_STATE.evidenceCounter].html(APP_STATE.evidenceDetected);

        DOM_EL.previewEvidenceListItemTitle[APP_STATE.evidenceCounter].elt.scrollIntoView({behavior: 'smooth'});
        DOM_EL.previewEvidenceListItem[APP_STATE.evidenceCounter].removeClass("noimage");
        DOM_EL.previewEvidenceSubheader.html("Click on the captured evidence to see what can be done with it!");
        
        APP_STATE.evidencesFound[APP_STATE.evidenceCounter] = APP_STATE.evidenceDetected;
        APP_STATE.evidenceCounter++;
  
        DOM_EL.previewEvidenceHeader.html(APP_STATE.evidenceCounter.toString()+ "/" + APP_STATE.numClasses + " Evidence Collected");
  
        
        // DOM_EL.contentHeader.html("Evidence " +  DOM_EL.evidenceListItemContainer[APP_STATE.evidenceCounter-1].attribute("index"));
        // DOM_EL.contentClass.html(DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter-1].html());
        
        // let t = DOM_EL.evidenceListItemTitle[APP_STATE.evidenceCounter-1].html().replace( / /g , "_" );
        // changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), getKeyByValue(APP_STATE.displayName, t));
  
        // let d = document.getElementById("content-image");
        // d.src = DOM_EL.evidenceListItem[APP_STATE.evidenceCounter-1].elt.childNodes[0].src;
        // DOM_EL.contentContainer.style("display","flex");
        // setTimeout(function(){
        //   DOM_EL.contentContainer.removeClass("fade");
        // },0);
      }
    }
  }
function collectCloseEvent(){
    DOM_EL.opacityContainer.hide();
    DOM_EL.popupContainer.hide();
    DOM_EL.collectContainer.hide();
    DOM_EL.imageSampleList[APP_STATE.class].hide();
    APP_STATE.class = null;
    if(DOM_EL.projectContainer[APP_STATE.project].canTrain()){
        DOM_EL.trainButtonContainer.removeClass("inactive");
    }
    else{
        DOM_EL.trainButtonContainer.addClass("inactive");
    }
}

function previewCloseEvent(){
    DOM_EL.opacityContainer.hide();
    DOM_EL.popupContainer.hide();
    DOM_EL.previewContainer.hide();
    DOM_EL.personaContainer.hide();
    DOM_EL.personaTextContainer.hide();
    APP_STATE.modelTrained = false;
}

function previewContentCloseEvent(){
    DOM_EL.previewContentContainer.addClass("hidden");
}

function addContentCloseEvent(){
    DOM_EL.opacityContainer.hide();
    DOM_EL.popupContainer.hide();
    DOM_EL.addContentContainer.hide();
    // if(APP_STATE.classJson[APP_STATE.class].content){
    //     if(APP_STATE.classJson[APP_STATE.class].content.ops.length>0){
    //         DOM_EL.classContainer[APP_STATE.class].detailsQuestion.html("✅ Content Added");
    //     }
    //     else{
    //         DOM_EL.classContainer[APP_STATE.class].detailsQuestion.html("❌ No Content");
    //     }
    // }
    if(APP_STATE.classJson[APP_STATE.class].hasOwnProperty("content")){  
        if(APP_STATE.classJson[APP_STATE.class].content.ops.length > 1 || APP_STATE.classJson[APP_STATE.class].content.ops[0].insert.length > 1){
            DOM_EL.classContainer[APP_STATE.class].detailsQuestion.html("✅ Content Added");
        }
        else{
            DOM_EL.classContainer[APP_STATE.class].detailsQuestion.html("❌ No Content");
        }
    }
    if(!UTIL.quillChanged){
        console.log("no change, dont do anything");
    }
    else{
        UTIL.quillChanged = false;
        APP_STATE.classJson[APP_STATE.class].content = UTIL.quill.getContents();  

        let u = "?account=" + APP_STATE.username;
        let p = "&project=" + APP_STATE.project;
        let c = "&class=" + APP_STATE.class;
    
        form = new FormData(),
        form.append("upload", JSON.stringify(APP_STATE.classJson));
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/update_classlist' + u + p + c, true);
        xhr.onload = function () {
            console.log("classJson uploaded!!");
        };
        xhr.send(JSON.stringify(APP_STATE.classJson));
    }
}

function populateEvidenceList(x){
    console.log(x);
    console.log("number of classes: "+ x.length);
    APP_STATE.numClasses = x.length;
    for(let j = 0; j < DOM_EL.previewEvidenceListItemContainer.length; j++){
        DOM_EL.previewEvidenceListItemContainer[j].remove();
        DOM_EL.previewEvidenceListItem[j].remove();
        DOM_EL.previewEvidenceListItemTitle[j].remove();
    }

    for(let i = 0; i < APP_STATE.numClasses; i++){
      DOM_EL.previewEvidenceListItemContainer[i] = createDiv();
      DOM_EL.previewEvidenceListItemContainer[i].attribute("index", (i+1).toString());
      DOM_EL.previewEvidenceListItemContainer[i].class("evidence-list-item-container");
      DOM_EL.previewEvidenceListItemContainer[i].parent( DOM_EL.previewEvidenceList);
      DOM_EL.previewEvidenceListItemContainer[i].mousePressed(function(){
        if(DOM_EL.previewEvidenceListItemContainer[i].class == "noimage"){
          console.log("nothing captured yet");
        }
        else{
            console.log("show relevant content");
            let y;
            Object.keys(APP_STATE.classJson).forEach(function(key) {
                if(APP_STATE.classJson[key].name == DOM_EL.previewEvidenceListItemTitle[i].html()){
                    y = key;
                }
            });
            UTIL.quill.setContents(APP_STATE.classJson[y].content);
            console.log(UTIL.quill.root.innerHTML);
            DOM_EL.previewContent.html(UTIL.quill.root.innerHTML);
            DOM_EL.previewContentTitle.html(DOM_EL.previewEvidenceListItemTitle[i].html());
            DOM_EL.previewContentContainer.removeClass("hidden");

            // UTIL.quill.setContents(APP_STATE.classJson[APP_STATE.class].content);
        //   DOM_EL.contentHeader.html("Evidence " +  DOM_EL.previewEvidenceListItemContainer[i].attribute("index"));
        //   DOM_EL.contentClass.html(DOM_EL.previewEvidenceListItemContainer[i].html());
        //   changeContent(overflow(APP_STATE.lensCounter, APP_STATE.numLens), DOM_EL.evidenceListItemTitle[i].html());
        //   let d = document.getElementById("content-image");
        //   d.src = DOM_EL.evidenceListItem[i].elt.childNodes[0].src;
        //   DOM_EL.contentContainer.style("display","flex");
        //   setTimeout(function(){
        //     DOM_EL.contentContainer.removeClass("fade");
        //   },0);
        }
      });

      DOM_EL.previewEvidenceListItem[i] = createElement("li");
      DOM_EL.previewEvidenceListItem[i].addClass("evidence-list-item");
      DOM_EL.previewEvidenceListItem[i].addClass("noimage");
      DOM_EL.previewEvidenceListItem[i].parent( DOM_EL.previewEvidenceListItemContainer[i]);

      DOM_EL.previewEvidenceListItemTitle[i] = createP("???");
      DOM_EL.previewEvidenceListItemTitle[i].class("evidence-list-item-title");
      DOM_EL.previewEvidenceListItemTitle[i].parent(DOM_EL.previewEvidenceListItemContainer[i]);
    }

    DOM_EL.previewEvidenceHeader.html("0/" + APP_STATE.numClasses + " Evidence Collected");
}

function gotResults(err, result) {
    if(!APP_STATE.modelTrained){
        return;
    }

    if(result)
        {
            if(APP_STATE.numClassesObtained == false){
                APP_STATE.numClassesObtained = true;
                populateEvidenceList(result);
                APP_STATE.evidenceCounter = 0;
                APP_STATE.evidencesFound = [];
              }
            // console.log(result[0].label + ", " + result[0].confidence);
            if(result[0].label !== "Irrelevant"){
                if(result[0].confidence > 0.9 && result[0].confidence < 0.95 && APP_STATE.evidenceFound == false){
                let s = "Hmmm" + MISC.thinking + "is it a " + result[0].label +" ?";
                DOM_EL.personaText.html( MISC.thinking+ "is it a " + result[0].label +"?");
                DOM_EL.personaButton.addClass("inactive");
                }
                else if(result[0].confidence > 0.9 && result[0].confidence < 0.95 && APP_STATE.evidenceFound){
                }
                else if(result[0].confidence > 0.95 && APP_STATE.evidenceFound == false){
                APP_STATE.evidenceFound = true;
                DOM_EL.personaText.html("I see a " + result[0].label +".");
                APP_STATE.evidenceDetected = result[0].label;
                DOM_EL.personaButton.removeClass("inactive");
                }
                else if(result[0].confidence > 0.95 && APP_STATE.evidenceFound){
                }
                else if(result[0].confidence < 0.9){
                if(APP_STATE.evidenceFound){
                    APP_STATE.evidenceFound = false;
                }
                DOM_EL.personaText.html(MISC.findingText + MISC.thinking);
                DOM_EL.personaButton.addClass("inactive");
                }
            }
            else if(result[0].label == "Irrelevant"){
                if(APP_STATE.evidenceFound){
                APP_STATE.evidenceFound = false;
                }
                DOM_EL.personaText.html(MISC.findingText + MISC.thinking);
                DOM_EL.personaButton.addClass("inactive");
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

    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  
    if(vh > vw){
      document.documentElement.style.setProperty('--vmin', `${vw*2}px`);
    //   DOM_EL.orientationContainer.style("display", "none");
    }
    else{
      document.documentElement.style.setProperty('--vmin', `${vh*2}px`);
    //   DOM_EL.orientationContainer.style("display", "flex");
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


  function arrayRemove(arr, value) {
       return arr.filter(function(ele){ 
           return ele != value; 
    });
}

const imageHandler = () => {
    const input = document.createElement('input');
  
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
  
      formData.append('image', file);
  
      // Save current cursor state
      const range = this.quill.getSelection(true);
  
      // Insert temporary loading placeholder image
      this.quill.insertEmbed(range.index, 'image', `${ window.location.origin }/images/loaders/placeholder.gif`); 
  
      // Move cursor to right side of image (easier to continue typing)
      this.quill.setSelection(range.index + 1);
  
      const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
      
      // Remove placeholder image
      this.quill.deleteText(range.index, 1);
  
      // Insert uploaded image
      this.quill.insertEmbed(range.index, 'image', res.body.image); 
    }
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }