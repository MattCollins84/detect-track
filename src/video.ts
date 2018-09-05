/**
 * Dependencies
 */
import { cv, VideoClassifyItemCollection, Item } from 'cv-analytics-lib';

const movie = '/home/analytics/tom.mp4';

/**
 * Constants
 */
const red = new cv.Vec3(0, 0, 255);
const green = new cv.Vec3(0, 255, 0);
const orange = new cv.Vec3(100, 180, 255);
const lineThickness = 4;
const frames = [];
/**
 * Item collection (VideoClassify)
 */

const items = new VideoClassifyItemCollection(Item, { 
  source: movie
});

const stream = items.getStream();

stream.on('data', data => {
  data && data.detections && data.detections.misc && frames.push(data.detections.misc);
  console.log(frames.length)
  if (frames.length >= 900) {
    stream.stop()
  }
})

stream.start()