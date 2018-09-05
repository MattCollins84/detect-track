/**
 * Dependencies
 */
import { cv, Item, Detection, BGItemCollection, Utils } from 'cv-analytics-lib';
import * as fs from 'fs'
const { grabFrames } = Utils;
const movie = 'proximity-3.mp4';

const sceneData = []

/**
 * Item collection (BG Subtraction)
 */
const items = new BGItemCollection(Item);
grabFrames(`./${movie}`, 5, (frame) => {

  const filter = (rect) => {
    return rect.area >= 1000;
  }

  // detect the items on screen
  const rects = items.detect(frame, { filter, lowerThreshold: 220 });
  
  const data = {
    detections: rects.map((rect: Detection) => {
      return {
        x: rect.x,
        y: rect.y,
        height: rect.height,
        width: rect.width
      }
    })
  }

  sceneData.push(data)
  if (sceneData.length === 1674) {
    fs.writeFileSync('./data.json', JSON.stringify(sceneData, null, 2));
    process.exit(0)
  }

  // put into window
  cv.imshow('Tracking', frame);
  
});


