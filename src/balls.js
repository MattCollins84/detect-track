const cv = require('opencv4nodejs');
const options = {
  space: "HLS",
  upper: new cv.Vec(150, 255, 150),
  lower: new cv.Vec(0, 150, 0)
}

let frame = cv.imread('./balls_green.png');
// frame = frame.cvtColor(cv.COLOR_BGR2HLS);

const rangeMask = frame.inRange(options.lower, options.upper);

const blurred = rangeMask.blur(new cv.Size(10, 10));
const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

cv.imwrite('./balls_mod.png', thresholded);