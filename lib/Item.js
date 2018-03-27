const Rect = require('./Rect')
class Item {

  constructor(rect) {
    this.type = rect.name || null;
    rect = new Rect(rect);
    this.id = null;
    this.startingPosition = rect // starting rect
    this.history = [rect] // positional history
    this.active = true; // is this item still "active"
    this.mostRecentPosition = rect; // what is the last known position of this item
    this.matched = false; // current "matched status" of this item
    this.direction = { // current directional status of the item
      x: null,
      y: null
    }
  }

  // update and record last 10 positions
  logPosition(rect) {
    rect = new Rect(rect);
    this.mostRecentPosition = rect;
    this.history = this.history.slice(0, 9);
    this.history.unshift(rect);
    this.calculateDirection()
  }

  calculateDirection() {
    
    const lastHistoryIndex = this.history.length - 1;

    const xDiff = this.history[0].centrePoint().x - this.history[lastHistoryIndex].centrePoint().x;
    if (xDiff < 0) this.direction.x = 'left';
    else if (xDiff > 0) this.direction.x = 'right';

    const yDiff = this.history[0].centrePoint().y - this.history[lastHistoryIndex].centrePoint().y;
    if (yDiff < 0) this.direction.y = 'down';
    else if (yDiff > 0) this.direction.y = 'up';
    
  }

}

module.exports = Item;