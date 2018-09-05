/**
 * Dependencies
 */
import { cv, Item, ColourItemCollection, Utils, IColourDetectOptions } from 'cv-analytics-lib';
const { grabFrames } = Utils;
const movie = 'hi-vis-small.mp4';

/**
 * Constants
 */
const red = new cv.Vec3(0, 0, 255);
const green = new cv.Vec3(0, 255, 0);
const blue = new cv.Vec3(255, 0, 0);
const lineThickness = 2;

/**
 * Item collection (Colour Detection)
 */
const items = new ColourItemCollection(Item);
grabFrames(`./${movie}`, 20, (frame: cv.Mat) => {

  // detect the items on screen
  const opts: IColourDetectOptions = {
    colours: [
      {
        name: "orange",
        space: "BGR",
        upper: new cv.Vec3(255, 255, 255),
        lower: new cv.Vec3(50, 80, 230)
      }
    ],
    filter: (rect) => {
      return true;
    }
  }

  const rects = items.detect(frame, opts);

  // track items, purge the inactive ones
  items.add(rects);
  items.purgeInactive();

  console.log(items.getItems().length)

  let colour: cv.Vec3
  items.getItems().forEach(item => {
    switch (item.type) {
      case "red":
        colour = green;
        break;
      case "green":
        colour = blue;
        break
      default:
      case "blue":
        colour = red;
        break;
    }
    frame.drawRectangle(item.mostRecentPosition, colour, lineThickness);
    // frame.putText(`${item.id.toString()}`, new cv.Point2(item.mostRecentPosition.x - 10, item.mostRecentPosition.y - 10), cv.FONT_ITALIC, 0.8, colour, 2);
  })

  // frame.putText(
  //   items.getItems().length.toString(),
  //   new cv.Point2(10, 40),
  //   cv.FONT_ITALIC,
  //   1.5,
  //   red,
  //   2
  // );


  // put into window
  cv.imshow('Tracking', frame);
  
});


