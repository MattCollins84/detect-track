/**
 * Dependencies
 */
import { cv, AnalyticsEvent, BaseCamera } from 'cv-analytics-lib';


/**
 * Event DB
 */
const event = new AnalyticsEvent({
  host: '10.0.1.94',
  user: 'analytics',
  dbname: 'analytics'
}, 36);

event.loadEvent((err, data) => {
  const camera = new BaseCamera({
    source: './video.mp4',
    calculateFrameInterval: true
  })
  camera.on('frame', frame => {
    const frameData = data.frames[camera.frameNumber];
    if (frameData) {
      frameData.forEach(detection => frame.drawRectangle(detection, new cv.Vec3(0, 0, 255), 2))
    }
    cv.imshow('frame', frame)
  })
});