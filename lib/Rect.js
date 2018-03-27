const cv = require('opencv4nodejs');
const red = [0, 0, 255];
const green = [0, 255, 0];
const blue = [255, 0, 0];

class Rect {
  
  constructor(rect) {
    this.x = rect.x || 0;
    this.y = rect.y || 0;
    this.w = rect.w || 0;
    this.h = rect.h || 0;
    this._openCVRect = new cv.Rect(this.x, this.y, this.w, this.h);
  }

  centrePoint() {
    return {
      x: this.x + (this.w / 2),
      y: this.y + (this.w / 2)
    }
  }

  distance(object) {
    const c1 = this.centrePoint();
    const c2 = object.centrePoint();
    let   xs = c2.x - c1.x,
          ys = c2.y - c1.y;
    xs *= xs;
    ys *= ys;
    return Math.abs(Math.sqrt(xs + ys));
  }

  // converts { x, y, h, w } to { top, bottom, left, right }
  toTBLR() {
    return {
      top: this.y,
      bottom: this.y + this.h,
      left: this.x,
      right: this.x + this.w
    }
  }

  openCVRect() {
    return this._openCVRect;
  }
}

module.exports = Rect;