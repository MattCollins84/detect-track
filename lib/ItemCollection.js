const munkres = require('munkres-js');

class ItemCollection {

  constructor(ItemType) {
    this.ItemType = ItemType;
    this.items = [];
    this.lastId = 0;
  }

  add(rects) {
    throw new Error(`You have to implement the method add() on ${this.constructor.name}`);
  }

  detect(rects) {
    throw new Error(`You have to implement the method detect() on ${this.constructor.name}`);
  }

  track(frame) {
    throw new Error(`You have to implement the method track() on ${this.constructor.name}`);
  }

  munkresDistance(rects) {

    // capture the items 
    // carry on if we have some items or new rects
    const items = this.items;
    if (items.length === 0 && rects.length === 0) return;

    // build our matrix
    const matrix = items.reduce((matrix, currentItem) => {
      currentItem.matched = false;
      const row = [];
      rects.forEach(rect => {
        const item = new this.ItemType(rect);
        rect.item = item;
        const distance = currentItem.mostRecentPosition.distance(item.mostRecentPosition);
        row.push(distance);
      });

      matrix.push(row);
      return matrix;

    }, []);

    // if we have something in our matrix
    if (matrix.length) {

      // calculate the optimal matches
      // mark detections and objects as matched
      munkres(matrix).forEach(pair => {
        const item = items[pair[0]];
        const rect = rects[pair[1]];
        item.logPosition(rect);
        item.matched = true;
        rect.matched = true;
      });

    }

    // capture the unmatched objects and detections
    const unmatchedItems = this.items.filter(item => !item.matched);
    const unmatchedRects = rects.filter(rect => !rect.matched);

    // deactivate the unmatched objects
    unmatchedItems.forEach(item => item.active = false);

    // create new objects from unmatched detections
    unmatchedRects.forEach(rect => {
      const item = new this.ItemType(rect);
      this.items.push(item);
      item.id = ++this.lastId;
    });

  }

  purgeInactive() {
    this.items = this.items.filter(item => item.active);
  }

  getItems() {
    return this.items;
  }

}

module.exports = ItemCollection;