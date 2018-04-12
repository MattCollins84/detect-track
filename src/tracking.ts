/**
 * Dependencies
 */
import { cv, Item, ClassifyItemCollection, Utils } from 'cv-analytics-lib';
const { grabFrames } = Utils;
const movie = 'Tracking.mp4';

/**
 * Constants
 */
const red = new cv.Vec3(0, 0, 255);
const lineThickness = 2;


const items = new ClassifyItemCollection<Item>(Item);
let frameNum = 0;
grabFrames(`./${movie}`, 35, (frame) => {

  if (frameNum % 30 === 0) {
    items.detect(frame, { groups: ["people"] }, (err, rects) => {
      if (err) throw new Error(err);
      
      // detect items, purge the inactive ones
      items.add(rects.people, frame);
      items.purgeInactive();
    })
  }

  items.track(frame);

  items.getItems().forEach(item => {
    frame.drawRectangle(item.mostRecentPosition.openCVRect(), red, lineThickness);
    frame.putText(`${item.id.toString()}`, new cv.Point2(item.mostRecentPosition.x + 10, item.mostRecentPosition.y + 25), cv.FONT_ITALIC, 0.8, red, 2);
  })

  frameNum++;
  cv.imshow('Tracking', frame)
  
});


