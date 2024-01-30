import Cell from './cell.js';

class Free extends Cell {
    constructor(x, y, qty = 0.0) {
        super(x, y);
        this._qty = qty;
        this._qtyFromBegining = qty;
        this.tileIndex = [Math.floor(Math.random() * (200 - 0 + 1)) + 0, Math.floor(Math.random() * (80 - 0 + 1)) + 0];
        this.tile.src = 'web/images/tiles/grass.png';
        this.tileSize = 32;
    }

    GetQty() { return this._qty; }
    SetQty(newValue) { this._qty = newValue; }
    getTile() { return this.tile; }

}

export default Free;






