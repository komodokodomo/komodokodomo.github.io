this.window = this;
importScripts('https://unpkg.com/@tensorflow/tfjs');
tf.setBackend('cpu');

var model;
var dictionary;
var MODEL_URL;
if (window.location.href === "https://gds-esd.com/wtf/scgs/web-worker.js") {
  MODEL_URL = "https://gds-esd.com/wtf/scgs/tfjs_model/model.json";
} else {
  MODEL_URL = "/tfjs_model/model.json";
}

const setup = async function() {
  if (('indexedDB' in window)) {
    try {
      model = await tf.loadGraphModel('indexeddb://web-model');
      dictionary = await loadDictionary(MODEL_URL);
  
      const zeros = tf.zeros([1, 224, 224, 3]);
      // warm-up the model
      model.predict(zeros);
    } catch(err) {
      console.log(`Couldn't find local cached model. It's okay, attempting to download it now.`);
  
      model = await tf.loadGraphModel(MODEL_URL);
      dictionary = await loadDictionary(MODEL_URL);
  
      const zeros = tf.zeros([1, 224, 224, 3]);
      // warm-up the model
      model.predict(zeros);
      try {
        await model.save('indexeddb://web-model');
      } catch(err) {
        console.log(`Model downloaded, but can't save it to cache.`);
      }
    }
  } else {
    console.log(`IndexedDB not available. Will not attempt to save model to cache.`);
    model = await tf.loadGraphModel(MODEL_URL);
    dictionary = await loadDictionary(MODEL_URL);
  
    const zeros = tf.zeros([1, 224, 224, 3]);
    // warm-up the model
    model.predict(zeros);
  }
}

const loadDictionary = async function(modelUrl) {
  const lastIndexOfSlash = modelUrl.lastIndexOf('/');
  const prefixUrl =
      lastIndexOfSlash >= 0 ? modelUrl.slice(0, lastIndexOfSlash + 1) : '';
  const dictUrl = `${prefixUrl}dict.txt`;
  const response = await tf.util.fetch(dictUrl);
  const text = await response.text();
  return text.trim().split('\n');
}

const centerCropAndResize = function(img) {
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

const predict = async function(imageData) {
  const scores = tf.tidy(() => {
    const imgAsTensor = tf.browser.fromPixels(imageData);
    const centerCroppedImg = centerCropAndResize(imgAsTensor);
    const processedImg = centerCroppedImg.div(127.5).sub(1);
    return model.predict(processedImg);
  })
  if (scores) {
    const probabilities = await scores.data();
    scores.dispose();

    const result = Array.from(probabilities)
                      .map((prob, i) => ({label: dictionary[i], prob}));
    var prediction = result.reduce(function(prev, current) {
      return (prev.prob > current.prob) ? prev : current;
    })

    postMessage([prediction.label, parseFloat(prediction.prob.toFixed(2))]);
  } else {
    console.log('Scores: ', scores);
  }
}

setup();

onmessage = function(e) {
  if (model) {
    predict(e.data);
  }
}
