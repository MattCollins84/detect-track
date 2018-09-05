import { cv, Utils } from 'cv-analytics-lib';
const { grabFrames } = Utils;
const bgSubtractor = new cv.BackgroundSubtractorMOG2();

let firstFrame: cv.Mat = null;
let accum = null;
grabFrames(0, 40, (frame) => {

  frame = frame.resizeToMax(640);

  // first frame
  if (firstFrame === null) {
    firstFrame = frame.copy();
    const grey: cv.Mat = frame.cvtColor(cv.COLOR_BGR2GRAY)
    const height = grey.rows;
    const width = grey.cols;
    const accumData = Array.from(new Array(height), _ => Array(width).fill(0));
    accum = new cv.Mat(accumData, cv.CV_8U);
  }

  // every after frame
  else {
    const grey: cv.Mat = frame.cvtColor(cv.COLOR_BGR2GRAY);
    const fgMask: cv.Mat = bgSubtractor.apply(grey);
    const threshold = 0;
    const maxValue = 255;
    const th1: cv.Mat = fgMask.threshold(threshold, maxValue, cv.THRESH_BINARY)
    accum = accum.add(th1);
    // const colourImage = accum.ap
    // console.log(accum);
    cv.imshow('debug', accum);
  }

  // put into window
  cv.imshow('Tracking', firstFrame);
  
});