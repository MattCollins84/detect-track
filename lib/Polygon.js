const intersect = require('polygons-intersect');
const cv = require('opencv4nodejs');
const Rect = require('./Rect');

class Polygon {
  
  constructor(points) {
    this.points = points || [];
  }

  toPointsObject() {
    return this.points.map(point => { 
      return {
        x: point[0], 
        y: point[1]
      }
    });
  }

  calculateBoundingRect() {
    const points = this.toPointsObject();
    const extremes = points.reduce((extremes, point) => {
      if (extremes === null) return {
        smallX: point.x,
        bigX: point.x,
        smallY: point.y,
        bigY: point.y
      }
      extremes.smallX = point.x < extremes.smallX ? point.x : extremes.smallX;
      extremes.bigX = point.x > extremes.bigX ? point.x : extremes.bigX;
      extremes.smallY = point.y < extremes.smallY ? point.y : extremes.smallY;
      extremes.bigY = point.y > extremes.bigY ? point.y : extremes.bigY;
      return extremes;
    }, null);
    return new Rect({
      x: extremes.smallX,
      y: extremes.smallY,
      w: extremes.bigX - extremes.smallX,
      h: extremes.bigY - extremes.smallY
    });
  }

  toOpenCVPoly() {
    return this.points.map(point => { 
      return new cv.Point(point[0], point[1]);
    });
  }

  intersects(polygon) {
    const p1 = this.toPointsObject();
    const p2 = polygon.toPointsObject();

    p1.forEach((point, index) => {
      if (point.x === p2[index].x) {
        point.x++
      }
      if (point.y === p2[index].y) {
        point.y++
      }
    });

    const i = intersect(p1, p2);
    return i;
  }

}

module.exports = Polygon;