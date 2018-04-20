/**
 * Dependencies
 */
import { Utils, BGItemCollection, Item } from 'cv-analytics-lib';
const { grabFrames } = Utils;

const items = new BGItemCollection<Item>(Item);
grabFrames('rtsp://admin:Cloudview2018!@10.0.1.130/Streaming/Channels/101/', 5, (frame) => {

  const filter = (rect) => {
    return rect.area >= 4000;
  }

  // detect the items on screen
  items.detect(frame, { filter, lowerThreshold: 200, upperThreshold: 255 });
  
});


