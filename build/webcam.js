"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const items = new cv_analytics_lib_1.BGItemCollection(cv_analytics_lib_1.Item);
grabFrames('rtsp://admin:Cloudview2018!@10.0.1.130/Streaming/Channels/101/', 5, (frame) => {
    const filter = (rect) => {
        return rect.area >= 4000;
    };
    // detect the items on screen
    items.detect(frame, { filter, lowerThreshold: 200, upperThreshold: 255 });
});
//# sourceMappingURL=webcam.js.map