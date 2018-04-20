/**
 * Dependencies
 */
import { cv, Item, Polygon, BGItemCollection, Utils, Point } from 'cv-analytics-lib';
const { grabFrames } = Utils;
const movie = 'garden.mp4';

/**
 * Constants
 */
const red = new cv.Vec3(0, 0, 255);
const lineThickness = 2;

/**
 * Item collection (BG Subtraction)
 */
const items = new BGItemCollection<Item>(Item);
grabFrames(`./${movie}`, 120, (frame) => {

  const filter = (rect) => {
    return rect.area >= 2000;
  }

  // detect the items on screen
  const rects = items.detect(frame, { filter, lowerThreshold: 220 });
  
  // track items, purge the inactive ones
  items.add(rects);
  items.purgeInactive();

  // define the restricted area;
  const restricted: Point[] = [
    new Point({ x: 150, y: 0 }),
    new Point({ x: 50, y: 250 }),
    new Point({ x: 50, y: 575 }),
    new Point({ x: 150, y: 575 })
  ];
  const restrictedPoly = new Polygon(restricted);
  const restrictedRect = restrictedPoly.calculateBoundingRect();
  frame.drawPolylines([restrictedPoly.toOpenCVPoints()], true, red, 2);

  // do whatever we want...
  // in this case annotate and count
  items.getItems().forEach(item => {
    let distance = item.mostRecentPosition.toTBLR().left - restrictedRect.toTBLR().right;
    distance = distance < 0 ? 0 : distance;

    const clearDistance = 255;
    const interval = Math.round(clearDistance / 255);

    const r = 255 - distance * interval;
    let g = 255 - r; g = g < 160 ? 160 : g; g = distance == 0 ? 0 : g;
    const b = 0;

    frame.drawRectangle(item.mostRecentPosition.openCVRect(), new cv.Vec3(b, g, r), lineThickness);
  });

  // put into window
  cv.imshow('Tracking', frame);
  
});


