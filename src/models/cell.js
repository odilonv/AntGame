class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tile = new Image();
    }


    GetType() { return this.constructor.name; }
    getTile() { return this.tile; }
}

export default Cell;
