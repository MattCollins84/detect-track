"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'garden.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const lineThickness = 2;
/**
 * Item collection (BG Subtraction)
 */
const items = new cv_analytics_lib_1.BGItemCollection(cv_analytics_lib_1.Item);
grabFrames(`./${movie}`, 120, (frame) => {
    const filter = (rect) => {
        return rect.area >= 2000;
    };
    // detect the items on screen
    const rects = items.detect(frame, { filter, lowerThreshold: 220 });
    // track items, purge the inactive ones
    items.add(rects);
    items.purgeInactive();
    // define the restricted area;
    const restricted = [
        new cv_analytics_lib_1.Point(150, 0),
        new cv_analytics_lib_1.Point(50, 250),
        new cv_analytics_lib_1.Point(50, 575),
        new cv_analytics_lib_1.Point(150, 575)
    ];
    const restrictedPoly = new cv_analytics_lib_1.Polygon(restricted);
    const restrictedRect = restrictedPoly.getBoundingRect();
    frame.drawPolylines([restrictedPoly.toOpenCVPoints()], true, red, 2);
    // do whatever we want...
    // in this case annotate and count
    items.getItems().forEach(item => {
        let distance = item.mostRecentPosition.toTBLR().left - restrictedRect.toTBLR().right;
        distance = distance < 0 ? 0 : distance;
        const clearDistance = 255;
        const interval = Math.round(clearDistance / 255);
        const r = 255 - distance * interval;
        let g = 255 - r;
        g = g < 160 ? 160 : g;
        g = distance == 0 ? 0 : g;
        const b = 0;
        frame.drawRectangle(item.mostRecentPosition, new cv_analytics_lib_1.cv.Vec3(b, g, r), lineThickness);
    });
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', frame);
});
//# sourceMappingURL=garden.js.map