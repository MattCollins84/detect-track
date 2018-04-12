/**
 * Dependencies
 */
import { cv, Item, ColourItemCollection, Utils, IColourDetectOptions } from 'cv-analytics-lib';
const { grabFrames } = Utils;
const movie = 'balls.mp4';

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
const items = new ColourItemCollection<Item>(Item);
grabFrames(`./${movie}`, 20, (frame: cv.Mat) => {

  // detect the items on screen
  const opts: IColourDetectOptions = {
    colours: [
      {
        name: "red",
        space: "BGR",
        upper: new cv.Vec3(50, 50, 255),
        lower: new cv.Vec3(0, 0, 230)
      },
      {
        name: "blue",
        space: "BGR",
        upper: new cv.Vec3(255, 150, 150),
        lower: new cv.Vec3(230, 0, 0)
      },
      {
        name: "green",
        space: "BGR",
        upper: new cv.Vec3(150, 255, 150),
        lower: new cv.Vec3(0, 150, 0)
      }
    ],
    filter: (rect) => {
      return rect.y <= 100 && rect.w <= 40 && rect.h <= 40;
    }
  }

  const rects = items.detect(frame, opts );

  // track items, purge the inactive ones
  items.add(rects);
  items.purgeInactive();

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
    frame.drawRectangle(item.mostRecentPosition.openCVRect(), colour, lineThickness);
    frame.putText(`${item.id.toString()}`, new cv.Point2(item.mostRecentPosition.x - 10, item.mostRecentPosition.y - 10), cv.FONT_ITALIC, 0.8, colour, 2);
  })

  frame.putText(
    items.getItems().length.toString(),
    new cv.Point2(10, 40),
    cv.FONT_ITALIC,
    1.5,
    red,
    2
  );


  // put into window
  cv.imshow('Tracking', frame);
  
});


