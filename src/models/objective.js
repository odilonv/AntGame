import Free from './free.js';

class Objective extends Free {
    constructor(x, y, qty = 1.0) {
        super(x, y);
        this._qty = qty;
        this.tileIndex = [0, 450];
        this.tile.src = 'web/images/tiles/foodAndColony.png';
    }

    GetQty() { return this._qty; }
    SetQty(newValue) { this._qty = newValue; }
    getTile() { return this.tile; }

}

export default Objective;

