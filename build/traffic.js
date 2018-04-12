"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'traffic.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
const blue = new cv_analytics_lib_1.cv.Vec3(255, 0, 0);
const lineThickness = 2;
/**
 * Item collection (BG Subtraction)
 * direction counter
 * Per frame...
 */
var counter = { left: 0, right: 0 };
const items = new cv_analytics_lib_1.BGItemCollection(cv_analytics_lib_1.Item);
grabFrames(`./${movie}`, 40, (frame) => {
    const filter = (rect) => {
        return rect.area >= 4000;
    };
    // detect the items on screen
    const rects = items.detect(frame, { filter, lowerThreshold: 220 });
    // track items, purge the inactive ones
    items.add(rects);
    items.purgeInactive();
    // draw the centre line
    frame.drawLine(new cv_analytics_lib_1.cv.Point2(frame.cols / 2, 0), new cv_analytics_lib_1.cv.Point2(frame.cols / 2, frame.rows), blue, 2);
    // do whatever we want...
    // in this case annotate and count
    items.getItems().forEach(item => {
        const colour = item.direction.x === 'left' ? green : red;
        frame.drawRectangle(item.mostRecentPosition.openCVRect(), colour, lineThickness);
        frame.putText(`${item.id.toString()} ${item.direction.x || ''}`, new cv_analytics_lib_1.cv.Point2(item.mostRecentPosition.x + 10, item.mostRecentPosition.y + 25), cv_analytics_lib_1.cv.FONT_ITALIC, 0.8, colour, 2);
    });
    counter = items.getItems().reduce((counter, item) => {
        if (!item.counted) {
            if (item.startingPosition.x < frame.cols / 2 && item.mostRecentPosition.x > frame.cols / 2 && item.direction.x === 'right') {
                item.counted = true;
                counter[item.direction.x]++;
            }
            if (item.startingPosition.x > frame.cols / 2 && item.mostRecentPosition.x < frame.cols / 2 && item.direction.x === 'left') {
                item.counted = true;
                counter[item.direction.x]++;
            }
        }
        return counter;
    }, counter);
    frame.putText(`${("000" + counter.left).slice(-4)}`, new cv_analytics_lib_1.cv.Point2((frame.cols / 2) - 102, 30), cv_analytics_lib_1.cv.FONT_ITALIC, 1.2, green, 2);
    frame.putText(`${("000" + counter.right).slice(-4)}`, new cv_analytics_lib_1.cv.Point2((frame.cols / 2) + 5, 30), cv_analytics_lib_1.cv.FONT_ITALIC, 1.2, red, 2);
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', frame);
});
//# sourceMappingURL=traffic.js.map