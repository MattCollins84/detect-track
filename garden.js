/**
 * Dependencies
 */
const cv = require('opencv4nodejs');
const Item = require('./lib/Item');
const Polygon = require('./lib/Polygon');
const BGItemCollection = require('./lib/BGItemCollection');
const { grabFrames } = require('./lib/Utils');
const movie = 'garden.mp4';

/**
 * Constants
 */
const red = new cv.Vec(0, 0, 255);
const paleRed = new cv.Vec(0, 0, 255);
const green = new cv.Vec(0, 255, 0);
const blue = new cv.Vec(255, 0, 0);
const lineThickness = 2;

/**
 * Item collection (BG Subtraction)
 * direction counter
 * Per frame...
 */
var counter = { left: 0, right: 0}
const items = new BGItemCollection(Item);
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
  const restricted = [
    [150, 0],
    [50, 250],
    [50, 575],
    [150, 575]
  ];
  const restrictedPoly = new Polygon(restricted);
  const restrictedRect = restrictedPoly.calculateBoundingRect();
  frame.drawPolylines([restrictedPoly.toOpenCVPoly()], true, red, 2);

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

    frame.drawRectangle(item.mostRecentPosition.openCVRect(), new cv.Vec(b, g, r), lineThickness);
  });

  // put into window
  cv.imshow('Tracking', frame);
  
});


