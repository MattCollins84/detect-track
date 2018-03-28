const ItemCollection = require('./ItemCollection');
const cv = require('opencv4nodejs');

class BGItemCollection extends ItemCollection {

  constructor(ItemType, options = {}) {
    super(ItemType, options);
    this.bgSubtractor = new cv.BackgroundSubtractorMOG2();
  }

  add(rects) {
    this.munkresDistance(rects);
  }

  detect(frame, options = {}) {
    
    const {
      filter,
      upperThreshold = 255,
      lowerThreshold = 0
    } = options;
    
    const foreGroundMask = this.bgSubtractor.apply(frame);
    
    const iterations = 2;
    const dilated = foreGroundMask.dilate(
      cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3)),
      new cv.Point(-1, -1),
      iterations
    );
    
    const blurred = dilated.blur(new cv.Size(15, 15));
    const thresholded = blurred.threshold(lowerThreshold, upperThreshold, cv.THRESH_BINARY);
    const rects = this.getRectsFromBlobs(thresholded, filter);
    
    return rects;
  }

}

module.exports = BGItemCollection;