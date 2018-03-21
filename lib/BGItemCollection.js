const ItemCollection = require('./ItemCollection');
const cv = require('opencv4nodejs');
const bgSubtractor = new cv.BackgroundSubtractorMOG2();

class BGItemCollection extends ItemCollection {

  constructor(ItemType) {
    super(ItemType);
  }

  add(rects) {
    this.munkresDistance(rects);
  }

  detect(frame, minPxSize = 4000) {
    const foreGroundMask = bgSubtractor.apply(frame);
    
    const iterations = 2;
    const dilated = foreGroundMask.dilate(
      cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3)),
      new cv.Point(-1, -1),
      iterations
    );
    
    const blurred = dilated.blur(new cv.Size(10, 10));
    const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

    const rects = this.getRectsFromBlobs(thresholded, minPxSize);
    
    return rects;
  }

  getRectsFromBlobs(binaryImg, minPxSize) {
    const rects = [];
    const {
      centroids,
      stats
    } = binaryImg.connectedComponentsWithStats();

    // pretend label 0 is background
    for (let label = 1; label < centroids.rows; label += 1) {
      const [x, y, w, h] = [
        stats.at(label, cv.CC_STAT_LEFT),
        stats.at(label, cv.CC_STAT_TOP),
        stats.at(label, cv.CC_STAT_WIDTH),
        stats.at(label, cv.CC_STAT_HEIGHT)
      ];
      
      const size = stats.at(label, cv.CC_STAT_AREA);
      
      if (minPxSize < size) {
        rects.push({ x, y, w, h, name: 'car', confidence: 100 })
      }
    }

    return rects;
  };

}

module.exports = BGItemCollection;