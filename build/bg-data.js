"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const fs = require("fs");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'proximity-3.mp4';
const sceneData = [];
/**
 * Item collection (BG Subtraction)
 */
const items = new cv_analytics_lib_1.BGItemCollection(cv_analytics_lib_1.Item);
grabFrames(`./${movie}`, 5, (frame) => {
    const filter = (rect) => {
        return rect.area >= 1000;
    };
    // detect the items on screen
    const rects = items.detect(frame, { filter, lowerThreshold: 220 });
    const data = {
        detections: rects.map((rect) => {
            return {
                x: rect.x,
                y: rect.y,
                height: rect.height,
                width: rect.width
            };
        })
    };
    sceneData.push(data);
    if (sceneData.length === 1674) {
        fs.writeFileSync('./data.json', JSON.stringify(sceneData, null, 2));
        process.exit(0);
    }
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', frame);
});
//# sourceMappingURL=bg-data.js.map