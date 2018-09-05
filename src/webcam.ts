import { VideoClassifyItemCollection, Item, Utils, cv } from 'cv-analytics-lib';
const { grabFrames } = Utils;

const opts = {
  source: 'rtsp://admin:Cloudview2018@10.0.1.130/Streaming/Channels/101/'
}
const items = new VideoClassifyItemCollection(Item, opts);
const stream = items.getStream();
var res;
var frameBuffer = [];
stream.on('data', data => {
  res = data;
  console.log(data.detections.misc);
})
stream.start();

grabFrames(opts.source, 5, (frame) => {

  frameBuffer.push(frame);

  if (frameBuffer.length <= 15) return;

  let theFrame: cv.Mat = frameBuffer.shift();

  if (res && res.detections && res.detections.misc) {
    res.detections.misc.forEach(detection => {
      theFrame.drawRectangle(detection, new cv.Vec3(0, 0, 255), 2)
    })
  }

  // put into window
  cv.imshow('Tracking', theFrame);
  
});