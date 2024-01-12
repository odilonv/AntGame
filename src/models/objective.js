class Objective extends Cell {
    constructor(x, y, qty = 1.0) {
        super(x, y);
        this._qty = qty;
    }

    GetQty() { return this._qty; }
    SetQty(newValue) { this._qty = newValue; }
}
