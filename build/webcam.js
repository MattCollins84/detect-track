"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const opts = {
    source: 'rtsp://admin:Cloudview2018@10.0.1.130/Streaming/Channels/101/'
};
const items = new cv_analytics_lib_1.VideoClassifyItemCollection(cv_analytics_lib_1.Item, opts);
const stream = items.getStream();
var res;
var frameBuffer = [];
stream.on('data', data => {
    res = data;
    console.log(data.detections.misc);
});
stream.start();
grabFrames(opts.source, 5, (frame) => {
    frameBuffer.push(frame);
    if (frameBuffer.length <= 15)
        return;
    let theFrame = frameBuffer.shift();
    if (res && res.detections && res.detections.misc) {
        res.detections.misc.forEach(detection => {
            theFrame.drawRectangle(detection, new cv_analytics_lib_1.cv.Vec3(0, 0, 255), 2);
        });
    }
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', theFrame);
});
//# sourceMappingURL=webcam.js.map