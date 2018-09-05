"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dependencies
 */
const cv_analytics_lib_1 = require("cv-analytics-lib");
/**
 * Event DB
 */
const event = new cv_analytics_lib_1.AnalyticsEvent({
    host: '10.0.1.94',
    user: 'analytics',
    dbname: 'analytics'
}, 36);
event.loadEvent((err, data) => {
    const camera = new cv_analytics_lib_1.BaseCamera({
        source: './video.mp4',
        calculateFrameInterval: true
    });
    camera.on('frame', frame => {
        const frameData = data.frames[camera.frameNumber];
        if (frameData) {
            frameData.forEach(detection => frame.drawRectangle(detection, new cv_analytics_lib_1.cv.Vec3(0, 0, 255), 2));
        }
        cv_analytics_lib_1.cv.imshow('frame', frame);
    });
});
//# sourceMappingURL=load-event.js.map