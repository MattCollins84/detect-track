"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
const { grabFrames } = cv_analytics_lib_1.Utils;
const movie = 'hi-vis-small.mp4';
/**
 * Constants
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
const blue = new cv_analytics_lib_1.cv.Vec3(255, 0, 0);
const lineThickness = 2;
/**
 * Item collection (Colour Detection)
 */
const items = new cv_analytics_lib_1.ColourItemCollection(cv_analytics_lib_1.Item);
grabFrames(`./${movie}`, 20, (frame) => {
    // detect the items on screen
    const opts = {
        colours: [
            {
                name: "orange",
                space: "BGR",
                upper: new cv_analytics_lib_1.cv.Vec3(255, 255, 255),
                lower: new cv_analytics_lib_1.cv.Vec3(50, 80, 230)
            }
        ],
        filter: (rect) => {
            return true;
        }
    };
    const rects = items.detect(frame, opts);
    // track items, purge the inactive ones
    items.add(rects);
    items.purgeInactive();
    console.log(items.getItems().length);
    let colour;
    items.getItems().forEach(item => {
        switch (item.type) {
            case "red":
                colour = green;
                break;
            case "green":
                colour = blue;
                break;
            default:
            case "blue":
                colour = red;
                break;
        }
        frame.drawRectangle(item.mostRecentPosition, colour, lineThickness);
        // frame.putText(`${item.id.toString()}`, new cv.Point2(item.mostRecentPosition.x - 10, item.mostRecentPosition.y - 10), cv.FONT_ITALIC, 0.8, colour, 2);
    });
    // frame.putText(
    //   items.getItems().length.toString(),
    //   new cv.Point2(10, 40),
    //   cv.FONT_ITALIC,
    //   1.5,
    //   red,
    //   2
    // );
    // put into window
    cv_analytics_lib_1.cv.imshow('Tracking', frame);
});
//# sourceMappingURL=hi-vis.js.map