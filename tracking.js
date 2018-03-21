/**
 * Dependencies
 */
const cv = require('opencv4nodejs');
const ClassifyItemCollection = require('./lib/ClassifyItemCollection');
const Item = require('./lib/Item')
const { grabFrames } = require('./lib/Utils');
const movie = 'Tracking.mp4';

/**
 * Constants
 */
const red = new cv.Vec(0, 0, 255);
const green = new cv.Vec(0, 255, 0);
const blue = new cv.Vec(255, 0, 0);
const lineThickness = 2;


const items = new ClassifyItemCollection(Item);
let frameNum = 0;
grabFrames(`./${movie}`, 35, (frame) => {

  if (frameNum % 30 === 0) {
    items.detect(frame, ["people"], (err, rects) => {
      if (err) throw new Error(err);
      
      // detect items, purge the inactive ones
      items.add(rects.people, frame);
      items.purgeInactive();
    })
  }

  if (frameNum % 3 === 0) {
    items.track(frame);
  }

  items.getItems().forEach(item => {
    frame.drawRectangle(item.mostRecentPosition.openCVRect(), red, lineThickness);
    frame.putText(`${item.id.toString()}`, new cv.Point(item.mostRecentPosition.x + 10, item.mostRecentPosition.y + 25), cv.FONT_ITALIC, 0.8, red, 2);
  })

  frameNum++;
  cv.imshow('Tracking', frame)
  
});


