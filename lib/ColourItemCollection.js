const ItemCollection = require('./ItemCollection');
const cv = require('opencv4nodejs');
const green = new cv.Vec(0, 255, 0);

class ColourItemCollection extends ItemCollection {

  constructor(ItemType, options = {}) {
    super(ItemType, options);
  }

  add(rects) {
    this.munkresDistance(rects);
  }

  detect(frame, options = {}) {
    
    const {
      colours = [],
      filter
    } = options;
    let rects = [];
    colours.forEach((colour, i) => {
      
      let colourFrame;
      switch(colour.space.toUpperCase()) {
        case "HLS":
          colourFrame = frame.cvtColor(cv.COLOR_BGR2HLS);
          break;
        
        case "BGR":
        default:
          colourFrame = frame;
          break;

      }
      const rangeMask = colourFrame.inRange(colour.lower, colour.upper);
      const blurred = rangeMask.blur(new cv.Size(10, 10));
      const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);
      rects = rects.concat(
        this.getRectsFromBlobs(thresholded, filter)
        .map(rect => {
          rect.name = colour.name
          return rect;
        })
      );

    });
    
    return rects;

  }

}

module.exports = ColourItemCollection;