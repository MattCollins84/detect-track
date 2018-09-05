import { cv, BaseCamera } from 'cv-analytics-lib'
import * as fs from 'fs'
import * as path from 'path'
import { extractResults } from '../dnn/utils'
import * as classNames from '../dnn/dnnCocoClassNames';

const red = new cv.Vec3(0, 0, 255);
const green = new cv.Vec3(0, 255, 0);
// const blue = new cv.Vec3(255, 0, 0);
const white = new cv.Vec3(255, 255, 255);

if (!cv.xmodules.dnn) {
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
const net = cv.readNetFromCaffe(prototxt, modelFile);

function classifyImg(img: cv.Mat) {
  // ssdcoco model works with 300 x 300 images
  const imgResized = img.resizeToMax(300).padToSquare(white);

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(imgResized);
  net.setInput(inputBlob);

  // forward pass input through entire network, will return
  // classification result as 1x1xNxM Mat
  let outputBlob = net.forward();
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(outputBlob.sizes[2], outputBlob.sizes[3]);

  return extractResults(outputBlob, img)
    .map(r => Object.assign({}, r, { className: classNames[r.classLabel] }));
}

const camera = new BaseCamera({ source: 'WC0', maxFrameSize: 300 })
camera.on('frame', (frame: cv.Mat) => {

  const predictions = classifyImg(frame).filter(prediction => prediction.confidence >= 0.4)

  predictions.forEach(prediction => {
    frame.putText(
      prediction.className,
      new cv.Point2(prediction.rect.x + 10, prediction.rect.y + 40),
      cv.FONT_HERSHEY_COMPLEX,
      2,
      green,
      cv.LINE_4,
      1
    )
    frame.drawRectangle(prediction.rect, red, 2)
  })

  cv.imshow('frame', frame)

})