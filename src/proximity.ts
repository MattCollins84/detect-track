/**
 * Dependencies
 */
import { cv, RegionOfInterest, Detection, GenericItemCollection, Utils, Point } from 'cv-analytics-lib';
import { DwellItem } from './DwellItem'
const { grabFrames } = Utils;
const movie = 'tom.mp4';

/**
 * Constants
 */
const red = new cv.Vec3(0, 0, 255);
const green = new cv.Vec3(0, 255, 0);
const orange = new cv.Vec3(100, 180, 255);
const lineThickness = 4;
const sceneData = require('../tom.json')
console.log(sceneData.length)
/**
 * Item collection (BG Subtraction)
 */
const dwellZone = new RegionOfInterest([
  new Point(1430, 0),
  new Point(1430, 1080),
  new Point(1920, 1080),
  new Point(1920, 0)
], { matchingType: 'any' })
const items = new GenericItemCollection(DwellItem, { dwellROI: dwellZone });
grabFrames(`./${movie}`, 5, (frame) => {

  const frameData = sceneData.length && sceneData.shift().detections
        .filter(d => d.name == 'person')
        .map(d => new Detection(d.x, d.y, d.w, d.h, { name: d.name, confidence: d.confidence }))
  
  // track items, purge the inactive ones
  items.add(frameData || []);
  items.purgeInactive();

  frame.drawRectangle(new cv.Rect(0, 940, 1960, 80), new cv.Vec3(0, 0, 0), -1)

  if (items.length === 0) {
    frame.putText(
      'No People Detected',
      new cv.Point2(30, 1000),
      cv.FONT_HERSHEY_PLAIN,
      4,
      green,
      cv.LINE_4,
      1
    )
  }

  items.getItems().forEach((item: DwellItem) => {
    
    const tom = item.mostRecentPosition;

    let colour = green;
    if (tom.centre.x >= 960 && tom.centre.x <= 1430) {
      colour = orange;
    } else if (tom.centre.x >= 1430) {
      colour = red;
    }

    console.log(item.dwellTime);

    frame.drawRectangle(tom, colour, lineThickness);

    let text = 'Person Detected Off Site'
    if (colour === orange) {
      text = 'Person Detected On Site'
    }

    if (colour === red) {
      text = `Person Detected inside secure perimeter: ${item.dwellTime}`
    }

    frame.putText(
      text,
      new cv.Point2(30, 1000),
      cv.FONT_HERSHEY_PLAIN,
      4,
      colour,
      cv.LINE_4,
      1
    )
  });

  const resized = frame.resizeToMax(640)

  // put into window
  cv.imshow('Tracking', resized);
  
});


