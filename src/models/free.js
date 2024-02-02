import Cell from './cell.js';

class Free extends Cell {
    constructor(x, y, qtyPheromones = 0.0) {
        super(x, y);
        this._qtyPheromones = qtyPheromones;
        this._qtyPheromonesFromBegining = this._qtyPheromones;
        this.tileIndex = [Math.floor(Math.random() * (200 - 0 + 1)) + 0, Math.floor(Math.random() * (80 - 0 + 1)) + 0];
        this.tile.src = 'web/images/tiles/grass.png';
        this.tileSize = 32;
    }

    getTile() { return this.tile; }
    getTileIndex() { return this.tileIndex; }
}

export default Free;






