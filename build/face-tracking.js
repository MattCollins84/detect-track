"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const source_map_support_1 = require("source-map-support");
source_map_support_1.install();
const DwellItem_1 = require("./DwellItem");
const cv_analytics_lib_1 = require("cv-analytics-lib");
/**
 * Colours etc...
 */
const red = new cv_analytics_lib_1.cv.Vec3(0, 0, 255);
const green = new cv_analytics_lib_1.cv.Vec3(0, 255, 0);
const blue = new cv_analytics_lib_1.cv.Vec3(255, 0, 0);
const lineThickness = 2;
/**
 * Dwell zone
 */
const dwellArea = new cv_analytics_lib_1.Rect(30, 30, 200, 300);
const dwellROI = new cv_analytics_lib_1.RegionOfInterest(dwellArea.toPolygon().points, { matchingType: 'any' });
/**
 * classifier, item collection and camera (using local cam)
 * VideoWriter
 */
const classifier = new cv_analytics_lib_1.cv.CascadeClassifier(cv_analytics_lib_1.cv.HAAR_FRONTALFACE_ALT);
const items = new cv_analytics_lib_1.GenericItemCollection(DwellItem_1.DwellItem, { tracking: true, dwellROI: dwellROI });
const camera = new cv_analytics_lib_1.BaseCamera({
    source: 'WC0',
    calculateFrameInterval: false,
    maxFrameSize: 640
});
const recorder = new cv_analytics_lib_1.VideoRecorder('./video.mp4', cv_analytics_lib_1.VideoRecorder.getFourCC('XVID'));
/**
 * Event DB
 */
const event = new cv_analytics_lib_1.StreamingAnalyticsEvent({
    host: '10.0.1.94',
    user: 'analytics',
    dbname: 'analytics'
});
/**
 * Misc
 */
let frameCount = 0;
const borderWidth = 10;
const fps = Math.floor(camera.getConfig().fps);
/**
 * Tag function
 */
const countFaces = (items) => {
    return {
        inZone: items.getItems().some((item) => !!item.dwellTime),
        faceCount: items.length
    };
};
camera.on('frame', (frame) => {
    // filter function
    const trackingFilter = (rect) => {
        if (rect.x <= borderWidth)
            return false;
        if (rect.x + rect.width >= frame.cols - borderWidth)
            return false;
        if (rect.y <= borderWidth)
            return false;
        if (rect.y + rect.height >= frame.rows - borderWidth)
            return false;
        return true;
    };
    // draw filter borders
    const borders = [
        new cv_analytics_lib_1.cv.Rect(0, 0, frame.cols, borderWidth),
        new cv_analytics_lib_1.cv.Rect(0, frame.rows - borderWidth, frame.cols, borderWidth),
        new cv_analytics_lib_1.cv.Rect(0, borderWidth, borderWidth, frame.rows - (borderWidth * 2)),
        new cv_analytics_lib_1.cv.Rect(frame.cols - borderWidth, borderWidth, borderWidth, frame.rows - (borderWidth * 2)),
    ];
    const overlay = frame.copy();
    borders.forEach(border => {
        overlay.drawRectangle(border, red, -1);
    });
    const blended = overlay.addWeighted(0.5, frame, 0.5, 0);
    const framed = blended.copy();
    // per frame detection/tracking
    frameCount++;
    let faces = [];
    let mode = 'track';
    if (true || frameCount === 1 || frameCount % fps === 0) {
        faces = classifier.detectMultiScale(frame.bgrToGray())
            .objects.map(face => new cv_analytics_lib_1.Detection(face.x, face.y, face.width, face.height, { name: 'Face', confidence: 100 }))
            .filter(rect => trackingFilter(rect));
        if (faces.length) {
            mode = 'detect';
            items.add(faces, frame);
        }
        else {
            items.track(frame, trackingFilter);
        }
    }
    else {
        mode = 'track';
        items.track(frame, trackingFilter);
    }
    items.getItems().forEach((item) => {
        const time = item.dwellTime;
        const position = item.mostRecentPosition;
        if (typeof time === 'number') {
            blended.putText(time.toString(), new cv_analytics_lib_1.cv.Point2(position.x + 10, position.y + position.height - 10), cv_analytics_lib_1.cv.FONT_HERSHEY_PLAIN, 2, green, cv_analytics_lib_1.cv.LINE_4, 1);
        }
        blended.drawRectangle(position, mode === 'track' ? blue : red, lineThickness);
    });
    blended.drawRectangle(dwellArea, green, 2);
    cv_analytics_lib_1.cv.imshow('camera', blended);
    const frameNumber = recorder.write(framed, { fps });
    event.saveFrameFromItems(items, frameNumber, countFaces);
});
process.on('SIGINT', function () {
    camera.stop();
    console.log(recorder.stop());
    process.exit();
});
//# sourceMappingURL=face-tracking.js.map