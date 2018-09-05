"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const DwellItem_1 = require("./DwellItem");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'tom.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
const orange = new cv_analytics_lib_1.cv.Vec3(100, 180, 255);
const lineThickness = 4;
const sceneData = require('../tom.json');
console.log(sceneData.length);
/**
 * Item collection (BG Subtraction)
 */
const dwellZone = new cv_analytics_lib_1.RegionOfInterest([
    new cv_analytics_lib_1.Point(1430, 0),
    new cv_analytics_lib_1.Point(1430, 1080),
    new cv_analytics_lib_1.Point(1920, 1080),
    new cv_analytics_lib_1.Point(1920, 0)
], { matchingType: 'any' });
const items = new cv_analytics_lib_1.GenericItemCollection(DwellItem_1.DwellItem, { dwellROI: dwellZone });
grabFrames(`./${movie}`, 5, (frame) => {
    const frameData = sceneData.length && sceneData.shift().detections
        .filter(d => d.name == 'person')
        .map(d => new cv_analytics_lib_1.Detection(d.x, d.y, d.w, d.h, { name: d.name, confidence: d.confidence }));
    // track items, purge the inactive ones
    items.add(frameData || []);
    items.purgeInactive();
    frame.drawRectangle(new cv_analytics_lib_1.cv.Rect(0, 940, 1960, 80), new cv_analytics_lib_1.cv.Vec3(0, 0, 0), -1);
    if (items.length === 0) {
        frame.putText('No People Detected', new cv_analytics_lib_1.cv.Point2(30, 1000), cv_analytics_lib_1.cv.FONT_HERSHEY_PLAIN, 4, green, cv_analytics_lib_1.cv.LINE_4, 1);
    }
    items.getItems().forEach((item) => {
        const tom = item.mostRecentPosition;
        let colour = green;
        if (tom.centre.x >= 960 && tom.centre.x <= 1430) {
            colour = orange;
        }
        else if (tom.centre.x >= 1430) {
            colour = red;
        }
        console.log(item.dwellTime);
        frame.drawRectangle(tom, colour, lineThickness);
        let text = 'Person Detected Off Site';
        if (colour === orange) {
            text = 'Person Detected On Site';
        }
        if (colour === red) {
            text = `Person Detected inside secure perimeter: ${item.dwellTime}`;
        }
        frame.putText(text, new cv_analytics_lib_1.cv.Point2(30, 1000), cv_analytics_lib_1.cv.FONT_HERSHEY_PLAIN, 4, colour, cv_analytics_lib_1.cv.LINE_4, 1);
    });
    const resized = frame.resizeToMax(640);
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', resized);
});
//# sourceMappingURL=proximity.js.map