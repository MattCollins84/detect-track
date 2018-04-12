"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'Tracking.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const lineThickness = 2;
const items = new cv_analytics_lib_1.ClassifyItemCollection(cv_analytics_lib_1.Item);
let frameNum = 0;
grabFrames(`./${movie}`, 35, (frame) => {
    if (frameNum % 30 === 0) {
        items.detect(frame, { groups: ["people"] }, (err, rects) => {
            if (err)
                throw new Error(err);
            // detect items, purge the inactive ones
            items.add(rects.people, frame);
            items.purgeInactive();
        });
    }
    items.track(frame);
    items.getItems().forEach(item => {
        frame.drawRectangle(item.mostRecentPosition.openCVRect(), red, lineThickness);
        frame.putText(`${item.id.toString()}`, new cv_analytics_lib_1.cv.Point2(item.mostRecentPosition.x + 10, item.mostRecentPosition.y + 25), cv_analytics_lib_1.cv.FONT_ITALIC, 0.8, red, 2);
    });
    frameNum++;
    cv_analytics_lib_1.cv.imshow('Tracking', frame);
});
//# sourceMappingURL=tracking.js.map