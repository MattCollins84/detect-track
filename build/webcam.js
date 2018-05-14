"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const opts = {
    source: 'rtsp://admin:Cloudview2018@10.0.1.130/Streaming/Channels/101/',
    delay: 15
};
const items = new cv_analytics_lib_1.VideoClassifyItemCollection(cv_analytics_lib_1.Item, opts);
const stream = items.getStream();
var res;
var frameBuffer = [];
stream.on('data', data => {
    res = data;
});
grabFrames(opts.source, 40, (frame) => {
    frameBuffer.push(frame);
    if (frameBuffer.length <= 15)
        return;
    let theFrame = frameBuffer.shift();
    if (res && res.detections && res.detections.misc) {
        res.detections.misc.forEach(detection => {
            detection = new cv_analytics_lib_1.Detection(detection);
            theFrame = detection.drawOutline(theFrame);
        });
    }
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', theFrame);
});
//# sourceMappingURL=webcam.js.map