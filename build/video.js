"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const movie = '/home/analytics/tom.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
const orange = new cv_analytics_lib_1.cv.Vec3(100, 180, 255);
const lineThickness = 4;
const frames = [];
/**
 * Item collection (VideoClassify)
 */
const items = new cv_analytics_lib_1.VideoClassifyItemCollection(cv_analytics_lib_1.Item, {
    source: movie
});
const stream = items.getStream();
stream.on('data', data => {
    data && data.detections && data.detections.misc && frames.push(data.detections.misc);
    console.log(frames.length);
    if (frames.length >= 900) {
        stream.stop();
    }
});
stream.start();
//# sourceMappingURL=video.js.map