this.window = this;
importScripts("https://unpkg.com/@tensorflow/tfjs");
// onmessage = function(e) {
//     console.log('Message received from main script');
//     var workerResult = 'Result: ' + (e);
//     console.log('Posting message back to main script');
//     postMessage(workerResult);
//   }

  self.addEventListener('message', function(e) {
    console.log('Message received from main script');
    // self.postMessage(e.data);
    var data = e.data;
    
    if (data.url) {
      console.log(data.url);
    }

  }, false);

