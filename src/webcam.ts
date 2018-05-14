import { VideoClassifyItemCollection, Item, Utils, cv, Detection } from 'cv-analytics-lib';
const { grabFrames } = Utils;

const opts = {
  source: 'rtsp://admin:Cloudview2018@10.0.1.130/Streaming/Channels/101/',
  delay: 15
}
const items = new VideoClassifyItemCollection<Item>(Item, opts);
const stream = items.getStream();
var res;
var frameBuffer = [];
stream.on('data', data => {
  res = data;
})

grabFrames(opts.source, 40, (frame) => {

  frameBuffer.push(frame);

  if (frameBuffer.length <= 15) return;

  let theFrame = frameBuffer.shift();

  if (res && res.detections && res.detections.misc) {
    res.detections.misc.forEach(detection => {
      detection = new Detection(detection);
      theFrame = detection.drawOutline(theFrame)
    })
  }

  // put into window
  cv.imshow('Tracking', theFrame);
  
});