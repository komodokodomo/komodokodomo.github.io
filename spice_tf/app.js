let modelURL;
let canvas,video;

const constraints = {
  video: { facingMode: { exact: "environment" } },
  audio: false
};

const videoWidth = 1280;
const videoHeight = 720;

// ---------------------------------------------------------------------------------------------------- //

document.addEventListener('DOMContentLoaded', (event) => {
  loadModel();
  console.log("hello");
});

function videoLoaded(){
  console.log("video stream loaded");
  return video;
}


async function loadModel() {
  // const modelURL = 'https://worklurk.cf/spice_tf/web_model/model.json';
  this.model = await tf.loadGraphModel("https://worklurk.cf/spice_tf/web_model/model.json");
  const result = await this.model.executeAsync(tf.zeros([1, 300, 300, 3]));
  await Promise.all(result.map(t => t.data()));
  result.map(t => t.dispose());
  var test = document.getElementById("canvas");
  this.predictImages(test, this.model);
}

async function predictImages(video, model) {
  const maxNumBoxes = 30;
  const batched = tf.tidy(() => {
    let img = this.canvas.nativeElement;
    if (!(img instanceof tf.Tensor)) {
      img = tf.browser.fromPixels(img);
      img = tf.cast(img, 'float32');
    }
    return img.expandDims(0);
  });
  const height = batched.shape[1];
  const width = batched.shape[2];
  const result = await this.model.executeAsync(batched);
  const scores = result[0].dataSync();
  const boxes = result[1].dataSync();

  batched.dispose();
  tf.dispose(result);

  const [maxScores, classes] = this.calculateMaxiumScore(scores, result[0].shape[1], result[0].shape[2]);
  const tensorIndex = tf.tidy(() => {
    const boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[3]]);
    return tf.image.nonMaxSuppression(boxes2, maxScores, maxNumBoxes, 0.5, 0.5);
  });
  const index = tensorIndex.dataSync();
  tensorIndex.dispose();
  const output = this.generateOutputObject(width, height, boxes, maxScores, index, classes);
  if (output.length > 0) {
    this.renderPredictions(output);
  } else {
    this.renderCameraVideo();
  }
  requestAnimationFrame(() => {
    this.predictImages(video, model);
  });

}


function setup(){
  w = window.innerWidth;
  h = window.innerHeight;

  canvas = createCanvas(w, h);
  canvas.id("canvas");

  video = createCapture(constraints,videoLoaded);
  video.size(videoWidth, videoHeight);
  video.hide();
  imageMode(CENTER);
}

function draw(){
  
  if(w>h){
    if((w/h)>(video.width/video.height))
    {
      image(video, w/2, h/2, w, w*video.height/video.width);
    }
    else{
      image(video, w/2, h/2, h*video.width/video.height, h);
    }
    }
    else{
    if((videoHeight/videoWidth)<(w/h)){
    image(video, w/2, h/2, w, (w/videoHeight)*videoWidth);
    }
    else{
    image(video, w/2, h/2, (h/videoWidth)*videoHeight, h);
    }
    }
}

function windowResized(){
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
}