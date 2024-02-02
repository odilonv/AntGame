import Free from './free.js';

class Objective extends Free {
    constructor(x, y, qty = 1.0) {
        super(x, y);
        let fruitsCaseIndex = [[0, 449], [96, 449], [32, 449], [64, 449], [128, 449], [160, 449], [192, 449]]

        this._qty = qty;
        this.tileIndex = fruitsCaseIndex[Math.floor(Math.random() * fruitsCaseIndex.length)];
        this.tile.src = 'web/images/tiles/foodAndColony.png';
    }

    GetQty() { return this._qty; }
    SetQty(newValue) { this._qty = newValue; }
    getTile() { return this.tile; }
    getTileIndex() { return this.tileIndex; }

}

export default Objective;

