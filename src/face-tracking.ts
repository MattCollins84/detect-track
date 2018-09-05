/**
 * Dependencies
 */
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall()
import { DwellItem } from './DwellItem'
import { 
  cv, 
  GenericItemCollection, 
  Rect, 
  BaseCamera, 
  VideoRecorder, 
  StreamingAnalyticsEvent, 
  Detection,
  RegionOfInterest
} from 'cv-analytics-lib';
import { ItemCollection } from '../node_modules/cv-analytics-lib/src';

/**
 * Colours etc...
 */
const red = new cv.Vec3(0, 0, 255);
const green = new cv.Vec3(0, 255, 0);
const blue = new cv.Vec3(255, 0, 0);
const lineThickness = 2;

/**
 * Dwell zone
 */
const dwellArea = new Rect(30, 30, 200, 300)
const dwellROI: RegionOfInterest = new RegionOfInterest(dwellArea.toPolygon().points, { matchingType: 'any' })


/**
 * classifier, item collection and camera (using local cam)
 * VideoWriter
 */
const classifier: cv.CascadeClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT);
const items = new GenericItemCollection(DwellItem, { tracking: true, dwellROI: dwellROI });
const camera = new BaseCamera({ 
  source: 'WC0',
  calculateFrameInterval: false, 
  maxFrameSize: 640
});
const recorder = new VideoRecorder('./video.mp4', VideoRecorder.getFourCC('XVID'))

/**
 * Event DB
 */
const event = new StreamingAnalyticsEvent({
  host: '10.0.1.94',
  user: 'analytics',
  dbname: 'analytics'
});

/**
 * Misc
 */
let frameCount = 0;
const borderWidth = 10;
const fps = Math.floor(camera.getConfig().fps);

/**
 * Tag function
 */
const countFaces = (items: any) => {
  return {
    inZone: items.getItems().some((item: DwellItem) => !!item.dwellTime),
    faceCount: items.length
  }
}

camera.on('frame', (frame: cv.Mat) => {
  
  // filter function
  const trackingFilter = (rect: Rect) => {
    if (rect.x <= borderWidth) return false;
    if (rect.x + rect.width >= frame.cols - borderWidth) return false;
    if (rect.y <= borderWidth) return false;
    if (rect.y + rect.height >= frame.rows - borderWidth) return false;
    return true;
  }

  // draw filter borders
  const borders = [
    new cv.Rect(0, 0, frame.cols, borderWidth), // top
    new cv.Rect(0, frame.rows - borderWidth, frame.cols, borderWidth), // bottom
    new cv.Rect(0, borderWidth, borderWidth, frame.rows - (borderWidth * 2)), // left
    new cv.Rect(frame.cols - borderWidth, borderWidth, borderWidth, frame.rows - (borderWidth * 2)), // right 
  ]

  const overlay = frame.copy()
  borders.forEach(border => {
    overlay.drawRectangle(border, red, -1)
  })
  
  const blended = overlay.addWeighted(0.5, frame, 0.5, 0)
  const framed = blended.copy();
  // per frame detection/tracking
  frameCount++;
  let faces = [];
  let mode = 'track';
  if (true || frameCount === 1 || frameCount % fps === 0) {
    faces = classifier.detectMultiScale(frame.bgrToGray())
            .objects.map(face => new Detection(face.x, face.y, face.width, face.height, { name: 'Face', confidence: 100 }))
            .filter(rect => trackingFilter(rect));
    if (faces.length) {
      mode = 'detect';
      items.add(faces, frame);
    } else {
      items.track(frame, trackingFilter);
    }
  }
  
  else {
    mode = 'track';
    items.track(frame, trackingFilter);
  }
  
  items.getItems().forEach((item: DwellItem) => {
    const time = item.dwellTime;
    const position = item.mostRecentPosition
    if (typeof time === 'number') {
      blended.putText(
        time.toString(),
        new cv.Point2(position.x + 10, position.y + position.height - 10),
        cv.FONT_HERSHEY_PLAIN,
        2,
        green,
        cv.LINE_4,
        1
      )
    }
    blended.drawRectangle(position, mode === 'track' ? blue : red, lineThickness)
  })

  blended.drawRectangle(dwellArea, green, 2)

  cv.imshow('camera', blended);
  const frameNumber = recorder.write(framed, { fps });
  event.saveFrameFromItems(items as any, frameNumber, countFaces as any)

})

process.on('SIGINT', function() {
  camera.stop();
  console.log(recorder.stop());
  process.exit();
});