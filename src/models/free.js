import Cell from './cell.js';

class Free extends Cell {
    constructor(x, y, qty = 0.0) {
        super(x, y);
        this._qty = qty;
        this.ants = [];
    }

    GetQty() { return this._qty; }
    SetQty(newValue) { this._qty = newValue; }
}

export default Free;





