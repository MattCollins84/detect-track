"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const bgSubtractor = new cv_analytics_lib_1.cv.BackgroundSubtractorMOG2();
let firstFrame = null;
let accum = null;
grabFrames(0, 40, (frame) => {
    frame = frame.resizeToMax(640);
    // first frame
    if (firstFrame === null) {
        firstFrame = frame.copy();
        const grey = frame.cvtColor(cv_analytics_lib_1.cv.COLOR_BGR2GRAY);
        const height = grey.rows;
        const width = grey.cols;
        const accumData = Array.from(new Array(height), _ => Array(width).fill(0));
        accum = new cv_analytics_lib_1.cv.Mat(accumData, cv_analytics_lib_1.cv.CV_8U);
    }
    // every after frame
    else {
        const grey = frame.cvtColor(cv_analytics_lib_1.cv.COLOR_BGR2GRAY);
        const fgMask = bgSubtractor.apply(grey);
        const threshold = 0;
        const maxValue = 255;
        const th1 = fgMask.threshold(threshold, maxValue, cv_analytics_lib_1.cv.THRESH_BINARY);
        accum = accum.add(th1);
        // const colourImage = accum.ap
        // console.log(accum);
        cv_analytics_lib_1.cv.imshow('debug', accum);
    }
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', firstFrame);
});
//# sourceMappingURL=heatmap.js.map