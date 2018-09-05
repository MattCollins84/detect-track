"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv_analytics_lib_1 = require("cv-analytics-lib");
class DwellItem extends cv_analytics_lib_1.Item {
    constructor(rect, options = {}) {
        super(rect, options);
        this.dwellStarted = null;
        this.inZone = false;
    }
    logPosition(rect, options = {}) {
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
    get dwellTime() {
        if (this.inZone === false)
            return null;
        return Math.floor((new Date().getTime() - this.dwellStarted.getTime()) / 1000);
    }
}
exports.DwellItem = DwellItem;
//# sourceMappingURL=DwellItem.js.map