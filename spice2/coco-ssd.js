/**
    * @license
    * Copyright 2020 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs-converter'), require('@tensorflow/tfjs-core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs-converter', '@tensorflow/tfjs-core'], factory) :
    (factory((global.cocoSsd = {}),global.tf,global.tf));
}(this, (function (exports,tfconv,tf) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    var CLASSES = {
        1: {
            name: '/m/01g317',
            id: 1,
            displayName: 'belimbi',
        },
        2: {
            name: '/m/0199g',
            id: 2,
            displayName: 'blue pea',
        },
        3: {
            name: '/m/0k4j',
            id: 3,
            displayName: 'curry',
        },
        4: {
            name: '/m/04_sv',
            id: 4,
            displayName: 'pandan',
        },
    };

    var version = '2.0.1';

    var BASE_PATH = 'https://storage.googleapis.com/tfjs-models/savedmodel/';
    function load(config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var base, modelUrl, objectDetection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (tf == null) {
                            throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please " +
                                "also include @tensorflow/tfjs on the page before using this model.");
                        }
                        base = config.base || 'lite_mobilenet_v2';
                        modelUrl = config.modelUrl;
                        if (['mobilenet_v1', 'mobilenet_v2', 'lite_mobilenet_v2'].indexOf(base) ===
                            -1) {
                            throw new Error("ObjectDetection constructed with invalid base model " +
                                (base + ". Valid names are 'mobilenet_v1',") +
                                " 'mobilenet_v2' and 'lite_mobilenet_v2'.");
                        }
                        objectDetection = new ObjectDetection(base, modelUrl);
                        return [4, objectDetection.load()];
                    case 1:
                        _a.sent();
                        return [2, objectDetection];
                }
            });
        });
    }
    var ObjectDetection = (function () {
        function ObjectDetection(base, modelUrl) {
            this.modelPath =
                modelUrl || "" + BASE_PATH + this.getPrefix(base) + "/model.json";
        }
        ObjectDetection.prototype.getPrefix = function (base) {
            return base === 'lite_mobilenet_v2' ? "ssd" + base : "ssd_" + base;
        };
        ObjectDetection.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4, tfconv.loadGraphModel(this.modelPath)];
                        case 1:
                            _a.model = _b.sent();
                            return [4, this.model.executeAsync(tf.zeros([1, 300, 300, 3]))];
                        case 2:
                            result = _b.sent();
                            return [4, Promise.all(result.map(function (t) { return t.data(); }))];
                        case 3:
                            _b.sent();
                            result.map(function (t) { return t.dispose(); });
                            return [2];
                    }
                });
            });
        };
        ObjectDetection.prototype.infer = function (img, maxNumBoxes) {
            return __awaiter(this, void 0, void 0, function () {
                var batched, height, width, result, scores, boxes, _a, maxScores, classes, prevBackend, indexTensor, indexes;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            batched = tf.tidy(function () {
                                if (!(img instanceof tf.Tensor)) {
                                    img = tf.browser.fromPixels(img);
                                }
                                return img.expandDims(0);
                            });
                            height = batched.shape[1];
                            width = batched.shape[2];
                            return [4, this.model.executeAsync(batched)];
                        case 1:
                            result = _b.sent();
                            // console.log(result); 
                            //detection_boxes,detection_scores,detection_classes
                            //1,100 /// // 1,100,4  /// 1,100 /// 
                            scores = result[0].dataSync();
                            // console.log("scores: " + scores);
                            boxes = result[1].dataSync();
                            // console.log("boxes: " + boxes);
                            batched.dispose();
                            tf.dispose(result);
                            _a = __read(this.calculateMaxScores(scores, result[0].shape[1], result[2].shape[0]), 2), maxScores = _a[0], classes = _a[1];
                            console.log(classes);
                            prevBackend = tf.getBackend();
                            tf.setBackend('cpu');
                            indexTensor = tf.tidy(function () {
                                var boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[2]]);
                                return tf.image.nonMaxSuppression(boxes2, maxScores, maxNumBoxes, 0.5, 0.5);
                            });
                            indexes = indexTensor.dataSync();
                            indexTensor.dispose();
                            tf.setBackend(prevBackend);
                            return [2, this.buildDetectedObjects(width, height, boxes, maxScores, indexes, classes)];
                    }
                });
            });
        };
        ObjectDetection.prototype.buildDetectedObjects = function (width, height, boxes, scores, indexes, classes) {
            var count = indexes.length;
            var objects = [];
            for (var i = 0; i < count; i++) {
                var bbox = [];
                for (var j = 0; j < 4; j++) {
                    bbox[j] = boxes[indexes[i] * 4 + j];
                }
                var minY = bbox[0] * height;
                var minX = bbox[1] * width;
                var maxY = bbox[2] * height;
                var maxX = bbox[3] * width;
                bbox[0] = minX;
                bbox[1] = minY;
                bbox[2] = maxX - minX;
                bbox[3] = maxY - minY;
                objects.push({
                    bbox: bbox,
                    class: CLASSES[classes[indexes[i]] + 1].displayName,
                    score: scores[indexes[i]]
                });
            }
            return objects;
        };
        ObjectDetection.prototype.calculateMaxScores = function (scores, numBoxes, numClasses) {
            var maxes = [];
            var classes = [];
            for (var i = 0; i < numBoxes; i++) {
                var max = Number.MIN_VALUE;
                var index = -1;
                for (var j = 0; j < numClasses; j++) {
                    if (scores[i * numClasses + j] > max) {
                        max = scores[i * numClasses + j];
                        index = j;
                    }
                }
                maxes[i] = max;
                classes[i] = index;
            }
            return [maxes, classes];
        };
        ObjectDetection.prototype.detect = function (img, maxNumBoxes) {
            if (maxNumBoxes === void 0) { maxNumBoxes = 20; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.infer(img, maxNumBoxes)];
                });
            });
        };
        ObjectDetection.prototype.dispose = function () {
            if (this.model) {
                this.model.dispose();
            }
        };
        return ObjectDetection;
    }());

    exports.load = load;
    exports.ObjectDetection = ObjectDetection;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
