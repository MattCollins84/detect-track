const ItemCollection = require('./ItemCollection');
const cv = require('opencv4nodejs');
const bgSubtractor = new cv.BackgroundSubtractorMOG2();
const request = require('request');
const fs = require('fs');

class BGItemCollection extends ItemCollection {

  constructor(ItemType, options = {}) {
    super(ItemType, options);
  }

  add(rects, frame) {
    this.munkresDistance(rects);
    this.purgeInactive();
    this.items.forEach(item => {
      if (item.tracker) {
        item.tracker.clear();
      }
      item.tracker = new cv.TrackerMIL();
      item.tracker.init(frame, item.mostRecentPosition.openCVRect())
    })
  }

  track(frame) {
    this.items.forEach(item => {
      let rect = item.tracker.update(frame);
      rect = {
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height
      }
      item.logPosition(rect);
    })
  }

  detect(frame, options = {}, callback) {
    const {
      groups = []
    } = options;
    const imgPath = `/tmp/track-frame.jpg`;
    cv.imwriteAsync(imgPath, frame, frame => {
      return this.classify(imgPath, groups || [], callback);
    });
  }

  classify(imgPath, groups = [], callback) {
    const requestOptions = {
      method: "POST",
      // url: "http://213.106.150.143:5000/image/classify",
      url: "http://beast:5000/image/classify",
      json: true,
      formData: {
        image: fs.createReadStream(imgPath),
        groups: JSON.stringify(groups)
      }
    }
    request(requestOptions, (err, res, body) => {
      if (err) return callback(err);
      let rects = {};
      groups.forEach(group => {
        const groupRects = body.data.detections[group];
        rects[group] = groupRects || [];
      });
      if (groups.length === 0) { 
        rects.misc = body.data.detections.misc;
      }
      return callback(null, rects);
    })
  }

}

module.exports = BGItemCollection;