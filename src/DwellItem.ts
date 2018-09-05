import { Item, Detection, IGenericOpts } from "cv-analytics-lib";

export class DwellItem extends Item {

  private dwellStarted: Date = null;
  private inZone: boolean = false;

  constructor(rect: Detection, options: object = {}) {
    super(rect, options);
  }

  logPosition(rect: Detection, options: IGenericOpts = {}): void {
    super.logPosition(rect, options);

    if (options.dwellROI && options.dwellROI.detect(rect) && this.inZone === false) {
      this.inZone = true;
      this.dwellStarted = new Date();
    }

    else if (options.dwellROI && !options.dwellROI.detect(rect) && this.inZone === true) {
      this.inZone = false;
      this.dwellStarted = null;
    }
  }

  get dwellTime(): number {
    if (this.inZone === false) return null;
    return Math.floor((new Date().getTime() - this.dwellStarted.getTime()) / 1000);
  }

}