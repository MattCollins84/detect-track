"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv_analytics_lib_1 = require("cv-analytics-lib");
const fs = require("fs");
const path = require("path");
const utils_1 = require("../dnn/utils");
const classNames = require("../dnn/dnnCocoClassNames");
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
// const blue = new cv.Vec3(255, 0, 0);
const white = new cv_analytics_lib_1.cv.Vec3(255, 255, 255);
if (!cv_analytics_lib_1.cv.xmodules.dnn) {
    throw new Error('exiting: opencv4nodejs compiled without dnn module');
}
// replace with path where you unzipped inception model
const ssdcocoModelPath = './dnn/SSD_300x300';
const prototxt = path.resolve(ssdcocoModelPath, 'deploy.prototxt');
const modelFile = path.resolve(ssdcocoModelPath, 'VGG_coco_SSD_300x300_iter_400000.caffemodel');
if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
    console.log('could not find ssdcoco model');
    console.log('download the model from: https://drive.google.com/file/d/0BzKzrI_SkD1_dUY1Ml9GRTFpUWc/view');
    throw new Error('exiting: could not find ssdcoco model');
}
// initialize ssdcoco model from prototxt and modelFile
const net = cv_analytics_lib_1.cv.readNetFromCaffe(prototxt, modelFile);
function classifyImg(img) {
    // ssdcoco model works with 300 x 300 images
    const imgResized = img.resizeToMax(300).padToSquare(white);
    // network accepts blobs as input
    const inputBlob = cv_analytics_lib_1.cv.blobFromImage(imgResized);
    net.setInput(inputBlob);
    // forward pass input through entire network, will return
    // classification result as 1x1xNxM Mat
    let outputBlob = net.forward();
    // extract NxM Mat
    outputBlob = outputBlob.flattenFloat(outputBlob.sizes[2], outputBlob.sizes[3]);
    return utils_1.extractResults(outputBlob, img)
        .map(r => Object.assign({}, r, { className: classNames[r.classLabel] }));
}
const camera = new cv_analytics_lib_1.BaseCamera({ source: 'WC0', maxFrameSize: 300 });
camera.on('frame', (frame) => {
    const predictions = classifyImg(frame).filter(prediction => prediction.confidence >= 0.4);
    predictions.forEach(prediction => {
        frame.putText(prediction.className, new cv_analytics_lib_1.cv.Point2(prediction.rect.x + 10, prediction.rect.y + 40), cv_analytics_lib_1.cv.FONT_HERSHEY_COMPLEX, 2, green, cv_analytics_lib_1.cv.LINE_4, 1);
        frame.drawRectangle(prediction.rect, red, 2);
    });
    cv_analytics_lib_1.cv.imshow('frame', frame);
});
//# sourceMappingURL=caffe.js.map